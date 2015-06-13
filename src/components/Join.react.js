/**
 * Created by kknauf on 13.06.15.
 */
'use strict';

var React = require('react');
var TextField = require('material-ui').TextField;
var RaisedButton = require('material-ui').RaisedButton;

var MIN_NUMBER_OF_CHARACTERS = 4;
var MAX_NUMBER_OF_CHARACTERS = 6;

var Join = React.createClass({

    getInitialState() {
        return {errorText: '' };
    },

    checkCode(eventCode) {
        console.log('Checking '+ eventCode);
        return eventCode.toString().match(new RegExp('^[A-Z]{'+MIN_NUMBER_OF_CHARACTERS+','+MAX_NUMBER_OF_CHARACTERS+'}$'));
    },

    onKeyDown() {
        var eventCode = this.refs.eventCode.getValue().toString().toUpperCase();
        if (!this.checkCode(eventCode)) {
            this.setState( {errorText: MIN_NUMBER_OF_CHARACTERS+'-'+MAX_NUMBER_OF_CHARACTERS+' digits required.'});
        } else {
            this.setState( {errorText: ''});
        }
    },

    joinEvent() {
        var eventCode = this.refs.eventCode.getValue().toString().toUpperCase();
        if (this.checkCode(eventCode)) {
            console.log('Joining Event: ' +eventCode);
            this.context.router.transitionTo('pay', {eventCode: eventCode});
        }
    },

    render: function() {
        return (
            <div>
                <form onSubmit={this.joinEvent} >
                <TextField
                    ref = "eventCode"
                    errorText={this.state.errorText}
                    onKeyUp={this.onKeyDown}
                    className = "upperCase"
                    floatingLabelText="Event Code"/>
                <br/>
                <br/>
                <RaisedButton label="Join" primary={true} />
                </form>
            </div>
        );
    }
});

Join.contextTypes = {
    router: React.PropTypes.func
};

module.exports = Join;
