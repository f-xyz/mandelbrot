#!/usr/bin/env node

var fs = require('fs');
var express = require('express');
var srv = express();
var colors = require('colors');
var argv = require('optimist').argv;

var port = argv.port || argv._[0] || 5000;
var root = argv.root || argv._[1] || __dirname;

//srv.use(express.logger());
srv.use(express.directory(root));
srv.use(express.static(root));
srv.listen(port);

console.log('GSOM-3000 HTTP Server\n'.yellow.underline);
console.log('  * port: '.white + port.toString().green);
console.log('  * root: '.white + root.toString().green + "\n");
console.log(['',
'░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░',
'░░░░░░░░░░▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░░',
'░░░░░░░░▄▀░░░░░░░░░░░░▄░░░░░░░▀▄░░░░░░░',
'░░░░░░░░█░░▄░░░░▄░░░░░░░░░░░░░░█░░░░░░░',
'░░░░░░░░█░░░░░░░░░░░░▄█▄▄░░▄░░░█░▄▄▄░░░',
'░▄▄▄▄▄░░█░░░░░░▀░░░░▀█░░▀▄░░░░░█▀▀░██░░',
'░██▄▀██▄█░░░▄░░░░░░░██░░░░▀▀▀▀▀░░░░██░░',
'░░▀██▄▀██░░░░░░░░▀░██▀░░░░░░░░░░░░░▀██░',
'░░░░▀████░▀░░░░▄░░░██░░░▄█░░░░▄░▄█░░██░',
'░░░░░░░▀█░░░░▄░░░░░██░░░░▄░░░▄░░▄░░░██░',
'░░░░░░░▄█▄░░░░░░░░░░░▀▄░░▀▀▀▀▀▀▀▀░░▄▀░░',
'░░░░░░█▀▀█████████▀▀▀▀████████████▀░░░░',
'░░░░░░████▀░░███▀░░░░░░▀███░░▀██▀░░░░░░',
'░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░'].join('\n').rainbow);

