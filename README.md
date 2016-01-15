把项目中的所有amd规范的module文件批量转换为commonjs规范的module。

安装：

~~~js
$ npm install -g amd2common --save
~~~

使用：

command方式：

cd到需要转换的目标文件夹上级目录，比如~/user/site/amd 这个目录要转换为commonjs规范，那首先cd到~/user/site ， 然后在命令行执行

~~~js
amd2common site
~~~

API方式：参考example中的run.js

~~~js
var r2c = require("../index");

r2c( "canvax" , {
    root : "./"
});
~~~