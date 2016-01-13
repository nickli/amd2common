#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var r2c = require("../index");

var argv = process.argv.slice(2);

if (argv.length > 0) {
	var cdir = argv[0];
	if (fs.existsSync(cdir)) {
        r2c(cdir);
	} else {
		console.log("目标目录不存在")
	}
	
} else {
	console.log("请输入要转换的目录")
};