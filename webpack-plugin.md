# plugin API

Tapable是webpack的核心工具，提供插件接口

1. 使用：扩展Tapable对象，提供的钩子及钩子的类型；
2. 使用钩子hooks 和 tap，插件可以以多种不同的方式运行；
3. compiler hooks记录了 Tapable内在的钩子，指出哪些tap方法可用。
4. 自定义钩子函数：tapable 中

  - SyncHook, SyncBailHook, SyncWaterfallHook 同步串行
  - SyncLoopHook 同步循环
  - AsyncParallelHook, AsyncParallelBailHook 异步并发
  - AsyncSeriesHook, AsyncSeriesBailHook, AsyncSeriesWaterfallHook 异步串行
  [https://juejin.im/post/5abf33f16fb9a028e46ec352]

5. 使用：

```javascript
const SyncHook = require('tapable').SyncHook;
let queue = new SyncHook(['name']); // 构造函数接收一个可选参数字符串数组
// 订阅，将回调函数添加到this.hooks队列
queue.tap('1', callback(param)) // 1,用来标识订阅的函数
queue.tap('2', callback)
// 循环调用钩子
queue.call('webpack','') // 发布的时候，触发订阅的函数，同时传入参数

// 具有 `apply` 方法……
if (compiler.hooks.myCustomHook) throw new Error('Already in use');
compiler.hooks.myCustomHook = new SyncHook(['a', 'b', 'c']);

// 在你想要触发钩子的位置/时机下调用……
compiler.hooks.myCustomHook.call(a, b, c);
```

## webpack第个方法执行前，都执行一个回调，判断是否有错误
1. ConcurrentCompilationError
2. finalCallback 执行failed钩子，并执行callback


## compiler.hooks的钩子

1. compile 阶段，提供的方法
  - tap 同步的方式运行

2. run 阶段，提供的方法
  - tapAsync 以异步的方式触发run钩子
  - tapPromise

## 问题：
1. Compiler类的实例对象hooks 及 hooks对象的属性
2. .tap 或 .tapPromise 及 .tapAsync('identify', (source, target, routesList, callback)=>{}) 与 compiler.plugin('identify', callback) 的区别


## webpack关键事件钩子

- entry-option 初始化option
- run 开始编译
- make 从entry开始递归的分析依赖，对每个依赖模块进行build
- before-resolve - after-resolve 对其中一个模块位置进行解析
- build-module 开始构建 (build) 这个module,这里将使用文件对应的loader加载
- normal-module-loader 对用loader加载完成的module(是一段js代码)进行编译,用 acorn 编译,生成ast抽象语法树。
- program 开始对ast进行遍历，当遇到require等一些调用表达式时，触发call require事件的handler执行，收集依赖，并。如：AMDRequireDependenciesBlockParserPlugin等
- seal 所有依赖build完成，下面将开始对chunk进行优化，比如合并,抽取公共模块,加hash
- bootstrap 生成启动代码
- emit 把各个chunk输出到结果文件


## 事件钩子执行顺序
'before run'
  'run'
    compile:func//调用 compile() 函数
        'before compile'
           'compile'//(1)compiler 对象的第一阶段
               newCompilation:object//创建 compilation 对象
               'make' //(2)compiler 对象的第二阶段
                    compilation.finish:func
                       "finish-modules"
                    compilation.seal
                         "seal"
                         "optimize"
                         "optimize-modules-basic"
                         "optimize-modules-advanced"
                         "optimize-modules"
                         "after-optimize-modules"//首先是优化模块
                         "optimize-chunks-basic"
                         "optimize-chunks"//然后是优化 chunk
                         "optimize-chunks-advanced"
                         "after-optimize-chunks"
                         "optimize-tree"
                            "after-optimize-tree"
                            "should-record"
                            "revive-modules"
                            "optimize-module-order"
                            "advanced-optimize-module-order"
                            "before-module-ids"
                            "module-ids"//首先优化 module-order，然后优化 module-id
                            "optimize-module-ids"
                            "after-optimize-module-ids"
                            "revive-chunks"
                            "optimize-chunk-order"
                            "before-chunk-ids"//首先优化 chunk-order，然后 chunk-id
                            "optimize-chunk-ids"
                            "after-optimize-chunk-ids"
                            "record-modules"//record module 然后 record chunk
                            "record-chunks"
                            "before-hash"
                               compilation.createHash//func
                                 "chunk-hash"//webpack-md5-hash
                            "after-hash"
                            "record-hash"//before-hash/after-hash/record-hash
                            "before-module-assets"
                            "should-generate-chunk-assets"
                            "before-chunk-assets"
                            "additional-chunk-assets"
                            "record"
                            "additional-assets"
                                "optimize-chunk-assets"
                                   "after-optimize-chunk-assets"
                                   "optimize-assets"
                                      "after-optimize-assets"
                                      "need-additional-seal"
                                         unseal:func
                                           "unseal"
                                      "after-seal"
                    "after-compile"//(4)完成模块构建和编译过程（seal 函数回调）
    "emit"//(5)compile 函数的回调，compiler 开始输出 assets，是改变 assets 最后机会
    "after-emit"//(6)文件产生完成

## 钩子 compiler.hooks提供的事件钩子

  - entryOption (SyncBailHook)：在 webpack 选项中的 entry 配置项 处理过之后，执行插件。
  - afterPlugins (SyncHook)：设置完初始插件之后，执行插件。 `参数：compiler`
  - afterResolvers (SyncHook)：resolver 安装完成之后，执行插件。 `参数：compiler`
  - environment (SyncHook)：environment 准备好之后，执行插件。
  - afterEnvironment (SyncHook)：environment 安装完成之后，执行插件。
  - beforeRun (AsyncSeriesHook)：compiler.run() 执行之前，添加一个钩子。 `参数：compiler`
  - run (AsyncSeriesHook)：开始读取 records 之前，钩入(hook into) compiler。 `参数：compiler`
  - watchRun (AsyncSeriesHook)：监听模式下，一个新的编译(compilation)触发之后，执行一个插件，但是是在实际编译开始之前。 `参数：compiler`
  - normalModuleFactory (SyncHook)：NormalModuleFactory 创建之后，执行插件。 `参数：normalModuleFactory`
  - contextModuleFactory：ContextModuleFactory 创建之后，执行插件。 `参数：contextModuleFactory`
  - beforeCompile (AsyncSeriesHook)：编译(compilation)参数创建之后，执行插件。 `参数：compilationParams`
  - compile (SyncHook)：一个新的编译(compilation)创建之后，钩入(hook into) compiler。 `参数：compilationParams`
  - thisCompilation (SyncHook)：触发 compilation 事件之前执行（查看下面的 compilation）。 `参数：compilation`
  - compilation (SyncHook)：编译(compilation)创建之后，执行插件。 `参数：compilation`
  - make (AsyncParallelHook)：... `参数：compilation`
  - afterCompile (AsyncSeriesHook)：... `参数：compilation`
  - shouldEmit (SyncBailHook)：此时返回 true/false。 `参数：compilation`
  - needAdditionalPass (SyncBailHook)：...
  - emit (AsyncSeriesHook)：生成资源到 output 目录之前。 `参数：compilation`
  - afterEmit (AsyncSeriesHook)：生成资源到 output 目录之后。 `参数：compilation`
  - done (AsyncSeriesHook)：编译(compilation)完成。 `参数：stats`
  - failed (SyncHook)：编译(compilation)失败。 `参数：error`
  - invalid (SyncHook)：监听模式下，编译无效时。 `参数：fileName, changeTime`
  - watchClose (SyncHook)：监听模式停止。

```javascript
class pluginName{
  apply(compiler){

  }
}

```


## compilation提供的事件钩子 compilation会被compiler用来创建新的编译；Compilation能够访问所有的模块及它们的依赖；对应用程序进行字面上的编译。提供的方法

编译阶段会被`加载loaded`，`封存sealed`，`优化optimized`，`分块chunked`，`哈希hashed`，`重新创建restored`.

- buildModule (SyncHook)：在模块构建开始之前触发。 `参数：module`
- rebuildModule (SyncHook)：在重新构建一个模块之前触发。 `参数：module`
- failedModule (SyncHook)：模块构建失败时执行。 `参数：module error`
- succeedModule (SyncHook)：模块构建成功时执行。 `参数：module`
- finishModules (SyncHook)：所有模块都完成构建。 `参数：modules`
- finishRebuildingModule (SyncHook)：一个模块完成重新构建。 `参数：module`
- seal (SyncHook)：编译(compilation)停止接收新模块时触发。
- unseal (SyncHook)：编译(compilation)开始接收新模块时触发。
- optimizeDependenciesBasic (SyncBailHook)：... `参数：modules`
- optimizeDependencies (SyncBailHook)：依赖优化开始时触发。 `参数：modules`
- optimizeDependenciesAdvanced (SyncBailHook)：... `参数：modules`
- afterOptimizeDependencies (SyncHook)：... `参数：modules`
- optimize (SyncHook)：优化阶段开始时触发。
- optimizeModulesBasic (SyncBailHook)：... `参数：modules`
- optimizeModules (SyncBailHook)：... `参数：modules`
- optimizeModulesAdvanced (SyncBailHook)：... `参数：modules`
- afterOptimizeModules (SyncHook)：... `参数：modules`
- optimizeChunksBasic (SyncBailHook)：... `参数：chunks`
- optimizeChunks (SyncBailHook)：优化 chunk。 `参数：chunks`
- optimizeChunksAdvanced (SyncBailHook)：... `参数：chunks`
- afterOptimizeChunks (SyncHook)：chunk 优化完成之后触发。 `参数：chunks`
- optimizeTree (AsyncSeriesHook)：异步优化依赖树。 `参数：chunks modules`
- afterOptimizeTree (SyncHook)：... `参数：chunks modules`
- optimizeChunkModulesBasic (SyncBailHook)：... `参数：chunks modules`
- optimizeChunkModules (SyncBailHook)：... `参数：chunks modules`
- optimizeChunkModulesAdvanced (SyncBailHook)：... `参数：chunks modules`
- afterOptimizeChunkModules (SyncHook)：... `参数：chunks modules`
- shouldRecord (SyncBailHook)：...
- reviveModules (SyncHook)：从 records 中恢复模块信息。 `参数：modules records`
- optimizeModuleOrder (SyncHook)：将模块从最重要的到最不重要的进行排序。 `参数：modules`
- advancedOptimizeModuleOrder (SyncHook)：... `参数：modules`
- beforeModuleIds (SyncHook)：... `参数：modules`
- moduleIds (SyncHook)：... `参数：modules`
- optimizeModuleIds (SyncHook)：... `参数：chunks`
- afterOptimizeModuleIds (SyncHook)：... `参数：chunks`
- reviveChunks (SyncHook)：从 records 中恢复 chunk 信息。 `参数：modules records`
- optimizeChunkOrder (SyncHook)：将 chunk 从最重要的到最不重要的进行排序。 `参数：chunks`
- beforeOptimizeChunkIds (SyncHook)：chunk id 优化之前触发。 `参数：chunks`
- optimizeChunkIds (SyncHook)：优化每个 chunk 的 id。 `参数：chunks`
- afterOptimizeChunkIds (SyncHook)：chunk id 优化完成之后触发。 `参数：chunks`
- recordModules (SyncHook)：将模块信息存储到 records。 `参数：modules records`
- recordChunks (SyncHook)：将 chunk 信息存储到 records。 `参数：chunks records`
- beforeHash (SyncHook)：在编译被哈希(hashed)之前。
- afterHash (SyncHook)：在编译被哈希(hashed)之后。
- recordHash (SyncHook)：... `参数：records`
- record (SyncHook)：将 compilation 相关信息存储到 records 中。 `参数：compilation records`
- beforeModuleAssets (SyncHook)：...
- shouldGenerateChunkAssets (SyncBailHook)：...
- beforeChunkAssets (SyncHook)：在创建 chunk 资源(asset)之前。
- additionalChunkAssets (SyncHook)：为 chunk 创建附加资源(asset) `参数：chunks`
- records (SyncHook)：... `参数：compilation records`
- additionalAssets (AsyncSeriesHook)：为编译(compilation)创建附加资源(asset)。这个钩子可以用来下载图像，例如： ``compilation.hooks.additionalAssets.tapAsync('MyPlugin', callback => {
  download('https://img.shields.io/npm/v/webpack.svg', function(resp) {
    if(resp.status === 200) {
      compilation.assets['webpack-version.svg'] = toAsset(resp);
      callback();
    } else {
      callback(new Error('[webpack-example-plugin] Unable to download the image'));
    }
  });
});
- optimizeChunkAssets (AsyncSeriesHook)：优化所有 chunk 资源(asset)。资源(asset)会被存储在 compilation.assets。每个 Chunk 都有一个 files 属性，指向这个 chunk 创建的所有文件。附加资源(asset)被存储在 compilation.additionalChunkAssets 中。 `参数：chunks`
以下是为每个 chunk 添加 banner 的简单示例。
compilation.hooks
  .optimizeChunkAssets
  .tapAsync('MyPlugin', (chunks, callback) => {
    chunks.forEach(chunk => {
      chunk.files.forEach(file => {
        compilation.assets[file] = new ConcatSource(
          '\/**Sweet Banner**\/',
          '\n',
          compilation.assets[file]
        );
      });
    });
    callback();
  });
- afterOptimizeChunkAssets (SyncHook)：chunk 资源(asset)已经被优化。 `参数：chunks`
这里是一个来自 @boopathi 的示例插件，详细地输出每个 chunk 里有什么。
compilation.hooks.afterOptimizeChunkAssets.tap('MyPlugin', chunks => {
  chunks.forEach(chunk => {
    console.log({
      id: chunk.id,
      name: chunk.name,
      includes: chunk.modules.map(module => module.request)
    });
  });
});
- optimizeAssets (AsyncSeriesHook)：优化存储在 compilation.assets 中的所有资源(asset)。 `参数：assets`
- afterOptimizeAssets (SyncHook)：资源优化已经结束。 `参数：assets`
- needAdditionalSeal (SyncBailHook)：...
- afterSeal (AsyncSeriesHook)：...
- chunkHash (SyncHook)：... `参数：chunk chunkHash`
- moduleAsset (SyncHook)：一个模块中的一个资源被添加到编译中。 `参数：module filename`
- chunkAsset (SyncHook)：一个 chunk 中的一个资源被添加到编译中。 `参数：chunk filename`
- assetPath (SyncWaterfallHook)：... `参数：filename data`
- needAdditionalPass (SyncBailHook)：...
- childCompiler (SyncHook)：... `参数：childCompiler compilerName compilerIndex`
- normalModuleLoader (SyncHook)：普通模块 loader，真正（一个接一个地）加载模块图(graph)中所有模块的函数。 `参数：loaderContext module`


```javascript
compilation.hooks.someHook.tap(/* ... */);
```


## webpack 处理的内容包含

- 入口：构建依赖图的开始，找出相应依赖的模块与library；单入口、多入口、公共文件
- 出口：使用了CDN 和 资源hash，path中包含[hash]，publicPath为CDN路径，不知publicPath时可以空白，运行时动态设置
- loader：对文件转换成有效模块，添加到依赖图中---module.rules{test, use/loader}
- plugin：
- 模式：webpack --mode=development 将 process.env.NODE_ENV设置为该值
- 浏览器兼容性web, node 构建与布署的区别？
- 目标：可自定义
- devtool
- context 绝对路径
- serve：webpack-server提供选项
- stats：精确控制要显示的bundle信息
- devServer
- 管理所有模块的交互：runtime(连接模块所需的加载和解析逻辑、包含已加载模块的连接、懒加载模块的执行逻辑) 和 manifest(src--->编译、解析、映射的详细工点--->manifest)打包完发送到浏览器，运行时通过manifest来解析和加载模块。通过bundle计算出内容散列，如果内容发生修改会通过新的散列指向新的文件，但内容不变时哈希还是改变了，runtime和mainifest的每次注入构建都会发生变化。故提取manifest来实现长效缓存。Webpack-Manifest-Plugin插件来查看该文件
- resolve 方便模块解析
- performance：性能，{hints：“warning”提示, maxAssetSize文件大小, assetFilter 文件类型断言}
- externals: ["react", /^@angular\//], 可自定义：即不遵循/打包这些模块，而是运行时从环境中请求。从输出的bundle中排除依赖的方法，即排除的不再打包到bundle中。
- optimization：优化
  - chunks: 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
  - minSize: 表示在压缩前的最小模块大小，默认为0；
  - minChunks: 表示被引用次数，默认为1；
  - maxAsyncRequests: 最大的按需(异步)加载次数，默认为1；
  - maxInitialRequests: 最大的初始化加载次数，默认为1；
  - name: 拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成；
  - cacheGroups: 缓存组。name、chunks、minSize、minChunks、maxAsyncRequests、maxInitialRequests ...
  - priority: 表示缓存的优先级；
  - test: 缓存组的规则，表示符合条件的的放入当前缓存组，值可以是function、boolean、string、RegExp，默认为空；
  - reuseExistingChunk: 表示可以使用已经存在的块，即如果满足条件的块已经存在就使用已有的，不再创建一个新的块。

- commonsChunkPlugin 从应用程序bundle中提取vender引用到 vender bundle，把引用vendor部分替换为__webpack__require()调用

- typescript配置，可以写成webpack.config.ts；但必须安装typescript 与 ts-node @types/node @types/webpack；tsconfig.json 安装tsconfig-paths即可配置tsconfig-for-webpack-config.json文件 ***

多文件，如何输出(哪些是公共，哪些业务，如何合并，哪些文件合并成一个)


- loader的配置

```javascript
module: {
  // 关于模块配置
  rules: [
    // 模块规则（配置 loader、解析器等选项）
    {
      test: /\.jsx?$/,
      include: [
        path.resolve(__dirname, "app")
      ],
      exclude: [
        path.resolve(__dirname, "app/demo-files")
      ],
      // 这里是匹配条件，每个选项都接收一个正则表达式或字符串
      // test 和 include 具有相同的作用，都是必须匹配选项
      // exclude 是必不匹配选项（优先于 test 和 include）
      // 最佳实践：
      // - 只在 test 和 文件名匹配 中使用正则表达式
      // - 在 include 和 exclude 中使用绝对路径数组
      // - 尽量避免 exclude，更倾向于使用 include
      issuer: { test, include, exclude },
      // issuer 条件（导入源）
      enforce: "pre",
      enforce: "post",
      // 标识应用这些规则，即使规则覆盖（高级选项）
      loader: "babel-loader",
      // 应该应用的 loader，它相对上下文解析
      // 为了更清晰，`-loader` 后缀在 webpack 2 中不再是可选的
      // 查看 webpack 1 升级指南。
      options: {
        presets: ["es2015"]
      },
      // loader 的可选项
    },
    {
      test: /\.html$/,
      use: [
        // 应用多个 loader 和选项
        "htmllint-loader",
        {
          loader: "html-loader",
          options: {
            /* ... */
          }
        }
      ]
    },
    { oneOf: [ /* rules */ ] },
    // 只使用这些嵌套规则之一
    { rules: [ /* rules */ ] },
    // 使用所有这些嵌套规则（合并可用条件）
    { resource: { and: [ /* 条件 */ ] } },
    // 仅当所有条件都匹配时才匹配
    { resource: { or: [ /* 条件 */ ] } },
    { resource: [ /* 条件 */ ] },
    // 任意条件匹配时匹配（默认为数组）
    { resource: { not: /* 条件 */ } }
    // 条件不匹配时匹配
  ],
}
```

- resolve的配置

```javascript
resolve: {
  // 解析模块请求的选项
  // （不适用于对 loader 解析）
  modules: [
    "node_modules",
    path.resolve(__dirname, "app")
  ],
  // 用于查找模块的目录
  extensions: [".js", ".json", ".jsx", ".css"],
  // 使用的扩展名
  alias: {
    // 模块别名列表
    "module": "new-module",
    // 起别名："module" -> "new-module" 和 "module/path/file" -> "new-module/path/file"
    "only-module$": "new-module",
    // 起别名 "only-module" -> "new-module"，但不匹配 "only-module/path/file" -> "new-module/path/file"
    "module": path.resolve(__dirname, "app/third/module.js"),
    // 起别名 "module" -> "./app/third/module.js" 和 "module/file" 会导致错误
    // 模块别名相对于当前上下文导入
  },
  /* 可供选择的别名语法（点击展示） */
  /* 高级解析选项（点击展示） */
},
```




loader
this.context：当前处理文件的所在目录，假如当前 Loader 处理的文件是 /src/main.js，则 this.context 就等于 /src。
this.resource：当前处理文件的完整请求路径，包括 querystring，例如 /src/main.js?name=1。
this.resourcePath：当前处理文件的路径，例如 /src/main.js。
this.resourceQuery：当前处理文件的 querystring。
this.target：等于 Webpack 配置中的 Target。
this.loadModule：但 Loader 在处理一个文件时，如果依赖其它文件的处理结果才能得出当前文件的结果时， 就可以通过 this.loadModule(request: string, callback: function(err, source, sourceMap, module)) 去获得 request 对应文件的处理结果。
this.resolve：像 require 语句一样获得指定文件的完整路径，使用方法为 resolve(context: string, request: string, callback: function(err, result: string))。
this.addDependency：给当前处理文件添加其依赖的文件，以便再其依赖的文件发生变化时，会重新调用 Loader 处理该文件。使用方法为 addDependency(file: string)。
this.addContextDependency：和 addDependency 类似，但 addContextDependency 是把整个目录加入到当前正在处理文件的依赖中。使用方法为 addContextDependency(directory: string)。
this.clearDependencies：清除当前正在处理文件的所有依赖，使用方法为 clearDependencies()。
this.emitFile：输出一个文件，使用方法为 emitFile(name: string, content: Buffer|string, sourceMap: {...})。
