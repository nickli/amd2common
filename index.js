/*
 * Copyright (c) 2016 @释剑
 */

'use strict';

module.exports = function(convertDir,opts) {
    var fs = require('fs');
    var helper = require("./helper");
    var r2c = require("./convert");

    opts = (opts || {});
    var root = (opts.root || "./");
    var baseUrl = opts.baseUrl;
    var paths = opts.paths;

    var tarFiles = helper.getAllFiles(convertDir);
    var viewJsFiles = helper.getTypedFiles(tarFiles, ".js");

    for (var i = 0; i < viewJsFiles.length; i++) {

        var jsFilePath = viewJsFiles[i];

        //如果该js文件存在
        console.log(jsFilePath)
        if (fs.existsSync(jsFilePath)) {
            var commonContent = r2c(jsFilePath, {
                root: root,
                baseUrl: baseUrl,
                paths: paths
            });

            fs.writeFileSync(jsFilePath, commonContent, "utf8");
        }
    }
};