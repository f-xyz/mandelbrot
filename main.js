define(function(require/*, exports, module*/) {
    'use strict';

    var controls = new (require('./src/controls'));
    var renderer = window.renderer = new (require('./src/renderer'))(controls);

});