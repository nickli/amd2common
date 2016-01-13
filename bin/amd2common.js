var path = require('path');
var fs = require('fs');
var r2c = require("../index");

var argv = process.argv.slice(2);

if( argv.length > 0 ){
	r2c( argv[0] );
};
