define(function (require, exports, module) {
    'use strict';

    var Stats = require('stats');
    var stats = new Stats();
    document.body.appendChild(stats.domElement);

    module.exports = stats;

});