## webpack完成以下任务

1. client端为web
2. 入口为src/fe/client.js
3. 输出asset-manifest.json文件 到dist目录
4. server端为node
5. 入口为src/server/server.js
6. 根据asset-manifest.json生成js文件

## 启动

1. npm start 启动服务，静态文件在public下，client的entry添加热更新的资源处理；服务端的热更新
2. build/lib/fs.js 提供promise文件处理的公共方法
3. render 启动server子进程，根据路由配置生成相应的html文件，存入目录dist/public，请求这个路径，将获取的文本，存入本地dist目录的文件中
3. runServer 启动子进程，输出相应的信息----?
4. build 进行clean, copy, bundle, runder, 启动docker子进程？
5. clean 清除dist目录下的内容
6. bundle 运行webpack，并进行错误处理***
7. copy 写入dist/package.json，并将静态文件拷贝入dist，监听public目录，发生变化，则创建idst目录，并将文件拷贝入dist
8. deploy 一系列的git操作



## node支持ES6
1. 安装 babel-register, babel-preset-env后，启动脚本
require('babel-register') ({
    presets: [ 'env' ]
})
module.exports = require('js')
使用babel-node命令执行启动脚本脚本
2. babel插件：babel-plugin-transform-es2015-modules-commonjs，@babel/plugin-transform-modules-commonjs


## vscode调试

## vscode 调试node
node.js解析js通过懒加载模式，所以调试时加上--nolazy选项
```json
{
    "type": "node",
    "request": "launch",
    "name": "nodemon",
    "runtimeExecutable": "nodemon", // 以什么命令运算，"npm"
    "args": ["${workspaceRoot}/bin/www"], // 启动目录
    "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
    },
    "outDir": null, // 尝试在输出目录找到与源码中相应位置来映射
    "internalConsoleOptions": "neverOpen", //内部控制台
    "evnFile": "xx.env",
    "skipFiles":[],
    "preLanchTask": "debug", //调试开始前要执行的任务，在task.json中的名字
    "restart": true,
    "protocol": "inspector",    //调试协议：auto, legacy
    "address": "", // 调试TCP/IP地址，远程调试
    "stopOnEntry": "", // 程序启动时立即中断
    "breakOnLoad": false,
    "localRoot": "", // vscode的根目录，映射远程与本地
    "remoteRoot": "", // node根目录，映射远程与本地
    "webRoot": "",
    "sourceMaps": true,
    "console": "integratedTerminal",
    "runtimeArgs": [    //对应nodemon --inspect之后除了启动文件之外的其他配置
    "--exec",
    "babel-node",
    "--presets",
    "env"
    ],
    "cwd": "${workspaceFolder}", // 程序启动目录
    "runtimeArgs": ["run-script", "start"], // 参数
    "program": "${workspaceFolder}/build/webpack.config.babel.js",
    "port": 9229,
    "timeout": 60000,
    "restart": true,
    "processId": "${command:PickProcess}",
    "sourceMaps": true,
    "env":{
        "NODE_ENV": "development"
    },
    "externalConsole": true  //使用外部控制台
}
```
