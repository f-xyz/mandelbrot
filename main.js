define(function(require/*, exports, module*/) {
    'use strict';

    var Controls = require('./src/controls');
    var Renderer = require('./src/renderer');

    window.renderer = new Renderer(new Controls());

});