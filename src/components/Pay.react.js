/**
 * Created by kknauf on 13.06.15.
 */
'use strict';

var $ = require('jquery');
var React = require('react');
var mui = require('material-ui');
var TextField = mui.TextField;
var RaisedButton = mui.RaisedButton;
var CircularProgress = mui.CircularProgress;
var RippleService = require('../services/RippleService');
var Config = require('../constants/Config');
var ErrorMessage = require('./ErrorMessage');

var UserStore = require('../stores/UserStore');

var ripple = require('ripple-lib');

var {Progress, LoadingState}  = require('./Progress.react');

var Pay = React.createClass({
    getInitialState: function() {
        return {
            loadingState: LoadingState.LOADING,
            loadingMessage: 'Retrieving event from server...'
        };
    },

    onClickPayButton: function() {

        var user = UserStore.getUser();

        var amount = this.refs.amountField.getValue().replace(',', '.');

        var rippleAmount = ripple.Amount.from_human(amount + ' ' + this.state.currency);

        this.setState({
            loadingState: LoadingState.LOADING,
            loadingMessage: 'Transaction ongoing...'
        });

        RippleService.pay(user.name, user.rippleSecret, this.state.targetRippleAccountId, rippleAmount, this.props.params.eventCode, function (success) {
            console.log('payment result ' + success);
            if(!success) {
                this.setState({
                    errorMessage: "Payment failed! Try again?",
                    loadingState: LoadingState.LOADED
                });
            } else {
                this.context.router.transitionTo('show', {eventCode: this.props.params.eventCode});
            }
        }.bind(this));

    },

    componentDidMount: function() {
        $.get( Config.serverOptions.url + '/event/'+ this.props.params.eventCode, function(data, status) {
            this.setState({
                eventName: data.eventName,
                totalAmount: data.totalAmount,
                currency: data.currency,
                targetRippleAccountId: data.recipientRippleAccountId,
                eventCreator: data.recipientUserName
            });
        }.bind(this));
        this.setLoadedState();
    },

    setLoadedState: function() {
        this.setState({loadingState: LoadingState.LOADED});
    },

    render: function() {
        if(this.state.loadingState === LoadingState.LOADING) {
            return (<Progress message = {this.state.loadingMessage}/>);
        } else {
            return (
                <div>
                    <ErrorMessage message={this.state.errorMessage}/>
                    <p><b>{this.state.eventCreator}</b> has requested <b>{this.state.totalAmount} {this.state.currency}</b> from the group.</p>
                    <div>
                        <TextField ref="amountField"
                                   className="text-field-text-right"
                                   style={{width:'18em'}}
                                   hintText="0.00"
                                   floatingLabelText = "EUR"
                        />
                        <br/>
                        <br/>
                        <RaisedButton label="Pay!"
                                      primary={true}
                                      onClick={this.onClickPayButton}/>
                    </div>
                </div>
            );
        }
    }
});

Pay.contextTypes = {
    router: React.PropTypes.func
};

module.exports = Pay;