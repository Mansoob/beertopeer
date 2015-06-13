'use strict';

var Beer2Peer= require('./Beer2Peer.react');
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var jQuery = require('jquery');

var Create = require('./Create.react');
var Join = require('./Join.react');
var Show = require('./Show.react');

var injectTapEventPlugin = require("react-tap-event-plugin");

injectTapEventPlugin();

var Routes = (
  <Route name='beer2peer' path='/' handler={Beer2Peer}>
    <DefaultRoute handler = {Create} />
    <Route name='create' handler={Create} />
    <Route name='join' handler = {Join} />
    <Route name='show' handler = {Show} />
  </Route>
);

Router.run(Routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('content'));
});
