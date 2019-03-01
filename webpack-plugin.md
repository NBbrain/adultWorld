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
2. .tap 或 .tapPromise 及 .tapAsync('identify', (source, target, routesList, callback)=>{}) 与 compiler.plugin('identify', callback) 的区别，只是语法糖？


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

## 用到的参数属性

- chunks{chunk{files}}

[ { id: 0,//chunk id
    rendered: true,
    initial: false,//require.ensure产生，非initial
    entry: false,//非入口文件
    recorded: undefined,
    extraAsync: false,
    size: 296855,//chunk大小，比特
    names: [],//require.ensure不是通过webpack配置的，所以chunk的names是空
    files: [ '0.bundle.js' ],//该chunk产生的文件
    hash: '42fbfbea594ba593e76a',//chunk的hash
    parents: [ 2 ],//父级chunk
    origins: [ [Object] ] },
  { id: 1,
    rendered: true,
    initial: false,//require.ensure产生，非initial
    entry: false,//非入口文件
    recorded: undefined,
    extraAsync: false,
    size: 297181,//chunk大小，比特
    names: [],
    files: [ '1.bundle.js' ],//产生的文件
    hash: '456d05301e4adca16986',//chunk的hash
    parents: [ 2 ],
    origins: [ [Object] ] },
  { id: 2,
    rendered: true,
    initial: true,//commonchunkplugin产生或者入口文件产生
    entry: false,//非入口文件
    recorded: undefined,
    extraAsync: false,
    size: 687,//chunk大小，比特
    names: [ 'main' ],
    files: [ 'bundle.js' ],//产生的文件
    hash: '248029a0cfd99f46babc',//chunk的hash
    parents: [ 3 ],
    origins: [ [Object] ] },
  { id: 3,
    rendered: true,
    initial: true,//monchunkplugin产生或者入口文件产生
    entry: true,//commonchunkplugin把webpack执行环境抽取出来
    recorded: undefined,
    extraAsync: false,
    size: 0,//chunk大小，比特
    names: [ 'vendor' ],
    files: [ 'vendor.bundle.js' ],//产生的文件
    hash: 'fbf76c7c330eaf0de943',//chunk的hash
    parents: [],
    origins: [] } ]
- assets{file}
[ { name: '0.bundle.js',
    size: 299109,
    chunks: [ 0, 3 ],

    chunkNames: [],
    emitted: undefined,
    isOverSizeLimit: undefined },
  { name: '1.bundle.js',
    size: 299469,
    chunks: [ 1, 3 ],
    chunkNames: [],
    emitted: undefined,
    isOverSizeLimit: undefined },
  { name: 'bundle.js',

    size: 968,

    chunks: [ 2, 3 ],

    chunkNames: [ 'main' ],

    emitted: undefined,

    isOverSizeLimit: undefined },
  { name: 'vendor.bundle.js',
    size: 5562,
    chunks: [ 3 ],
    chunkNames: [ 'vendor' ],
    emitted: undefined,
    isOverSizeLimit: undefined }]
- state{chunks, modules}
- modules
{ id: 10,
   identifier: 'C:\\Users\\Administrator\\Desktop\\webpack-chunkfilename\\node_
odules\\html-loader\\index.js!C:\\Users\\Administrator\\Desktop\\webpack-chunkf
lename\\src\\Components\\Header.html',
   name: './src/Components/Header.html',//模块名称，已经转化为相对于根目录的路径
   index: 10,
   index2: 8,
   size: 62,
   cacheable: true,//缓存
   built: true,
   optional: false,
   prefetched: false,
   chunks: [ 0 ],//在那个chunk中出现
   assets: [],
   issuer: 'C:\\Users\\Administrator\\Desktop\\webpack-chunkfilename\\node_modu
es\\eslint-loader\\index.js!C:\\Users\\Administrator\\Desktop\\webpack-chunkfil
name\\src\\Components\\Header.js',//是谁开始本模块的调用的，即模块调用发起者
   issuerId: 1,//发起者id
   issuerName: './src/Components/Header.js',//发起者相对于根目录的路径
   profile: undefined,
   failed: false,
   errors: 0,
   warnings: 0,
   reasons: [ [Object] ],
   usedExports: [ 'default' ],
   providedExports: null,
   depth: 2,
   source: 'module.exports = "<header class=\\"header\\">{{text}}</header>";' }



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


-  compilation.outputOptions

  - path: 'builds',
  - filename: 'bundle.js',
  - publicPath: 'builds/',
  - chunkFilename: '[id].bundle.js',
  - library: '',
  - hotUpdateFunction: 'webpackHotUpdate',
  - jsonpFunction: 'webpackJsonp',
  - libraryTarget: 'var',
  - sourceMapFilename: '[file].map[query]',
  - hotUpdateChunkFilename: '[id].[hash].hot-update.js',
  - hotUpdateMainFilename: '[hash].hot-update.json',
  - crossOriginLoading: false,
  - hashFunction: 'md5',
  - hashDigest: 'hex',
  - hashDigestLength: 20,
  - devtoolLineToLine: false,
  - strictModuleExceptionHandling: false

- compilation.options
  entry: './src',
  output:{
    - path: 'builds',
    - filename: 'bundle.js',
    - publicPath: 'builds/',
    - chunkFilename: '[id].bundle.js',
    - library: '',
    - hotUpdateFunction: 'webpackHotUpdate',
    - jsonpFunction: 'webpackJsonp',
    - libraryTarget: 'var',
    - sourceMapFilename: '[file].map[query]',
    - hotUpdateChunkFilename: '[id].[hash].hot-update.js',
    - hotUpdateMainFilename: '[hash].hot-update.json',
    - crossOriginLoading: false,
    - hashFunction: 'md5',
    - hashDigest: 'hex',
    - hashDigestLength: 20,
    - devtoolLineToLine: false,
    - strictModuleExceptionHandling: false
  },
  plugins:[
    - CommonsChunkPlugin {
      - chunkNames: 'vendor',
      - filenameTemplate: 'vendor.bundle.js',
      - minChunks: 2,
      - selectedChunks: undefined,
      - async: undefined,
      - minSize: undefined,
      - ident: 'C:\\Users\\Administrator\\Desktop\\webpack-chunkfilename\\node_modules\\webpack\\lib\\optimize\\CommonsChunkPlugin.js0'
    },
    - HtmlWebpackPlugin {
      - options: [Object],
      - childCompilerHash: '729d3caf962246f308dc6d5b1542a9ae',
      - childCompilationOutputName: 'index.html'
    }
  ],
  module:{
    - loaders: [ [Object], [Object], [Object], [Object] ],
    - unknownContextRequest: '.',
    - unknownContextRegExp: false,
    - unknownContextRecursive: true,
    - unknownContextCritical: true,
    - exprContextRequest: '.',
    - exprContextRegExp: false,
    - exprContextRecursive: true,
    - exprContextCritical: true,
    - wrappedContextRegExp: /.*/,
    - wrappedContextRecursive: true,
    - wrappedContextCritical: false,
    - unsafeCache: true
  },
  - bail: false,
  - profile: false,
  - context: 'C:\\Users\\Administrator\\Desktop\\webpack-chunkfilename',
  - devtool: false,
  - cache: true,
  - target: 'web',
  - node:{
    - console: false,
    - process: true,
    - global: true,
    - Buffer: true,
    - setImmediate: true,
    - __filename: 'mock',
    - __dirname: 'mock'
  },
  performance: { maxAssetSize: 250000, maxEntrypointSize: 250000, hints: false },
  resolve:{
    - unsafeCache: true,
    - modules: [ 'node_modules' ],
    - extensions: [ '.js', '.json' ],
    - aliasFields: [ 'browser' ],
    - mainFields: [ 'browser', 'module', 'main' ] },
  resolveLoader:{
    - unsafeCache: true,
    - mainFields: [ 'loader', 'main' ],
    - extensions: [ '.js', '.json' ]
  }
}

```javascript
// compilation 的状态信息
 var webpackStatsJson = compilation.getStats().toJson();
  var publicPath = typeof compilation.options.output.publicPath !== 'undefined'
    ? compilation.mainTemplate.getPublicPath({hash: webpackStatsJson.hash})
    : path.relative(path.resolve(compilation.options.output.path, path.dirname(self.childCompilationOutputName)), compilation.options.output.path)
      .split(path.sep).join('/');
    if (publicPath.length && publicPath.substr(-1, 1) !== '/') {
      publicPath += '/';
    }
// childCompilation
if (childCompilation && childCompilation.errors && childCompilation.errors.length) {
  var errorDetails = childCompilation.errors.map(function (error) {
    return error.message + (error.error ? ':\n' + error.error : '');
  }).join('\n');
  reject(new Error('Child compilation failed:\n' + errorDetails));
  //如果报错，直接reject
}
// template
var outputName = compilation.mainTemplate.applyPluginsWaterfall('asset-path', outputOptions.filename, {
      hash: childCompilation.hash,
      chunk: entries[0]
      //因为上面提供的是SingleEntryPlugin ·
    });
HtmlWebpackPlugin.prototype.getFullTemplatePath = function (template, context) {
  if (template.indexOf('!') === -1) {
    template = require.resolve('./lib/loader.js') + '!' + path.resolve(context, template);
  }
  // Resolve template path
  return template.replace(
    /([!])([^/\\][^!?]+|[^/\\!?])($|\?[^!?\n]+$)/,
    function (match, prefix, filepath, postfix) {
      return prefix + path.resolve(filepath) + postfix;
    });
};

childCompiler.apply(
  new NodeTemplatePlugin(outputOptions),
  new NodeTargetPlugin(),
  new LibraryTemplatePlugin('HTML_WEBPACK_PLUGIN_RESULT', 'var'),
  new SingleEntryPlugin(this.context, template),
  //上面的通过loader加载的本地文件系统的内容传入到我们的SingleEntryPlugin中
  new LoaderTargetPlugin('node')
);
```

例1：html-webpack-plugin中就使用到了多个chunks属性,如names,initial等
```javascript
//该chunk要被选中的条件是：有名称，不是懒加载，在includedChunks中但是不在excludedChunks中
HtmlWebpackPlugin.prototype.filterChunks = function (chunks, includedChunks, excludedChunks) {
  return chunks.filter(function (chunk) {
    var chunkName = chunk.names[0];
    // This chunk doesn't have a name. This script can't handled it.
    //通过require.ensure产生的chunk不会被保留，names是一个数组
    if (chunkName === undefined) {
      return false;
    }
    // Skip if the chunk should be lazy loaded
    //如果是require.ensure产生的chunk直接忽略
    if (!chunk.initial) {
      return false;
    }
    // Skip if the chunks should be filtered and the given chunk was not added explicity
    //这个chunk必须在includedchunks里面
    if (Array.isArray(includedChunks) && includedChunks.indexOf(chunkName) === -1) {
      return false;
    }
    // Skip if the chunks should be filtered and the given chunk was excluded explicity
    //这个chunk不能在excludedChunks中
    if (Array.isArray(excludedChunks) && excludedChunks.indexOf(chunkName) !== -1) {
      return false;
    }
    // Add otherwise
    return true;
  });
};
```
例2：通过id对chunks进行排序
```javascript
/**
 * Sorts the chunks based on the chunk id.
 *
 * @param  {Array} chunks the list of chunks to sort
 * @return {Array} The sorted list of chunks
 * entry chunk在前，两个都是entry那么id大的在前
 */
module.exports.id = function (chunks) {
  return chunks.sort(function orderEntryLast (a, b) {
    if (a.entry !== b.entry) {
      return b.entry ? 1 : -1;
    } else {
      return b.id - a.id;
    }
  });
};
```
这样入口文件都会排列在前面，但是有一点就是这里的id较大的在前面，这和我们的occurenceOrderplugin完全是相反的，所以这里还是存在疑问的。

例3:通过chunk.parents(全部是parentId数组)来获取拓排序
```javascript
/*
  Sorts dependencies between chunks by their "parents" attribute.
  This function sorts chunks based on their dependencies with each other.
  The parent relation between chunks as generated by Webpack for each chunk
  is used to define a directed (and hopefully acyclic) graph, which is then
  topologically sorted in order to retrieve the correct order in which
  chunks need to be embedded into HTML. A directed edge in this graph is
  describing a "is parent of" relationship from a chunk to another (distinct)
  chunk. Thus topological sorting orders chunks from bottom-layer chunks to
  highest level chunks that use the lower-level chunks.

  @param {Array} chunks an array of chunks as generated by the html-webpack-plugin.
  It is assumed that each entry contains at least the properties "id"
  (containing the chunk id) and "parents" (array containing the ids of the
  parent chunks).
  @return {Array} A topologically sorted version of the input chunks
  因为最上面的通过commonchunkplugin产生的chunk具有webpack的runtime，所以排列在前面
*/
module.exports.dependency = function (chunks) {
  if (!chunks) {
    return chunks;
  }
  // We build a map (chunk-id -> chunk) for faster access during graph building.
  // 通过chunk-id -> chunk这种Map结构更加容易绘制图
  var nodeMap = {};
  chunks.forEach(function (chunk) {
    nodeMap[chunk.id] = chunk;
  });
  // Next, we add an edge for each parent relationship into the graph
  var edges = [];
  chunks.forEach(function (chunk) {
    if (chunk.parents) {
      // Add an edge for each parent (parent -> child)
      chunk.parents.forEach(function (parentId) {
        // webpack2 chunk.parents are chunks instead of string id(s)
        var parentChunk = _.isObject(parentId) ? parentId : nodeMap[parentId];
        // If the parent chunk does not exist (e.g. because of an excluded chunk)
        // we ignore that parent
        if (parentChunk) {
          edges.push([parentChunk, chunk]);
        }
      });
    }
  });
  // We now perform a topological sorting on the input chunks and built edges
  return toposort.array(chunks, edges);
};
```
通过这种方式可以把各个chunk公有的模块排列在前面，从而提前加载，这是合理的！

```javascript
compiler.plugin("done", function(stats) {
    this._sendStats(this.sockets, stats.toJson(clientStats));
    //clientStats表示客户端stats要输出的内容过滤
    this._stats = stats;
  }.bind(this));
Server.prototype._sendStats = function(sockets, stats, force) {
  if(!force &&
    stats &&
    (!stats.errors || stats.errors.length === 0) &&
    stats.assets &&
    stats.assets.every(function(asset) {
      return !asset.emitted;
      //每一个asset都是没有emitted属性，表示没有发生变化。如果发生变化那么这个assets肯定有emitted属性。所以emitted属性表示是否又重新生成了一遍assets资源
    })
  )
    return this.sockWrite(sockets, "still-ok");
  this.sockWrite(sockets, "hash", stats.hash);
  //正常情况下首先发送hash，然后发送ok
  if(stats.errors.length > 0)
    this.sockWrite(sockets, "errors", stats.errors);
  else if(stats.warnings.length > 0)
    this.sockWrite(sockets, "warnings", stats.warnings);
  else
  //发送hash后再发送ok
    this.sockWrite(sockets, "ok");
}
```

7.如何对输出的assets资源进行过滤
下面给出一个例子1:

```javascript
 var assets = {
    // The public path
    publicPath: publicPath,
    // Will contain all js & css files by chunk
    chunks: {},
    // Will contain all js files
    js: [],
    // Will contain all css files
    css: [],
    // Will contain the html5 appcache manifest files if it exists
    //这里是application cache文件，这里不是文件内容是文件的名称。key就是文件名称
    manifest: Object.keys(compilation.assets).filter(function (assetFile) {
      return path.extname(assetFile) === '.appcache';
    })[0]
  };
```
例子2：过滤出所有的css文件
```javascript
 var chunkFiles = [].concat(chunk.files).map(function (chunkFile) {
      return publicPath + chunkFile;
    });
    var css = chunkFiles.filter(function (chunkFile) {
      // Some chunks may contain content hash in their names, for ex. 'main.css?1e7cac4e4d8b52fd5ccd2541146ef03f'.
      // We must proper handle such cases, so we use regexp testing here
      return /.css($|\?)/.test(chunkFile);
    });
```
当然过滤出来的资源可能会要添加hash，我们看看如何处理：

```javascript
/**
 * Appends a cache busting hash
 self.appendHash(assets.manifest, webpackStatsJson.hash);
 为文件名称后面添加一个hash值用于缓存，是在文件的路径上而不是内容
 */
 var webpackStatsJson = compilation.getStats().toJson();
 if (this.options.hash) {
    assets.manifest = self.appendHash(assets.manifest, webpackStatsJson.hash);
    assets.favicon = self.appendHash(assets.favicon, webpackStatsJson.hash);
  }
HtmlWebpackPlugin.prototype.appendHash = function (url, hash) {
  if (!url) {
    return url;
  }
  return url + (url.indexOf('?') === -1 ? '?' : '&') + hash;
};
8.如何对输出的资源路径进行特别的处理
HtmlWebpackPlugin.prototype.htmlWebpackPluginAssets = function (compilation, chunks) {
  var self = this;
  var webpackStatsJson = compilation.getStats().toJson();
  //获取compilation的所有的信息
  // Use the configured public path or build a relative path
  var publicPath = typeof compilation.options.output.publicPath !== 'undefined'
    // If a hard coded public path exists use it
    ? compilation.mainTemplate.getPublicPath({hash: webpackStatsJson.hash})
    // If no public path was set get a relative url path
    // 这个publicPath是可以使用hash的
    : path.relative(path.resolve(compilation.options.output.path, path.dirname(self.childCompilationOutputName)), compilation.options.output.path)
      .split(path.sep).join('/');
    //self.childCompilationOutputName得到的"index.html"，dirname得到的是".",所以resolve结果为" C:\Users\Administrator\Desktop\webpack-chunkfilename\builds"
    if (publicPath.length && publicPath.substr(-1, 1) !== '/') {
      publicPath += '/';
    }
    //获取倒数第一个字符,添加一个"/"

  var assets = {
    // The public path
    publicPath: publicPath,
    // Will contain all js & css files by chunk
    chunks: {},
    // Will contain all js files
    js: [],
    // Will contain all css files
    css: [],
    // Will contain the html5 appcache manifest files if it exists
    //这里是application cache文件，这里不是文件内容是文件的名称
    manifest: Object.keys(compilation.assets).filter(function (assetFile) {
      return path.extname(assetFile) === '.appcache';
    })[0]
  };

  // Append a hash for cache busting（缓存清除）
  //hash: true | false if true then append a unique webpack compilation hash to all
  // included scripts and CSS files. This is useful for cache busting.
  if (this.options.hash) {
    assets.manifest = self.appendHash(assets.manifest, webpackStatsJson.hash);
    assets.favicon = self.appendHash(assets.favicon, webpackStatsJson.hash);
  }
  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];
    var chunkName = chunk.names[0];
    //为每一个chunk都在上面的这个assets对象上添加一个对象，如assets.chunks[chunkName]={}
    assets.chunks[chunkName] = {};
    // Prepend the public path to all chunk files
    //chunk.files表示该chunk产生的所有的文件，不过是文件名称name而不是内容
    var chunkFiles = [].concat(chunk.files).map(function (chunkFile) {
      return publicPath + chunkFile;
    });

    // Append a hash for cache busting
    //为每一个文件加上了publicPath同时还要加上hash
    if (this.options.hash) {
      chunkFiles = chunkFiles.map(function (chunkFile) {
        return self.appendHash(chunkFile, webpackStatsJson.hash);
      });
    }

    // Webpack outputs an array for each chunk when using sourcemaps
    // But we need only the entry file
    //chunk.files[0]就是该chunk产生的入口文件
    var entry = chunkFiles[0];
    assets.chunks[chunkName].size = chunk.size;
    assets.chunks[chunkName].entry = entry;
    assets.chunks[chunkName].hash = chunk.hash;
    assets.js.push(entry);
    //为每一个该chunk产生的文件都在上面的assets对象上添加一个对象，key是chunkName
    //value为一个对象{chunkName:{size:100,entry:'/qlin/',hash:'chunk的hash'}}
    // Gather all css files
    var css = chunkFiles.filter(function (chunkFile) {
      // Some chunks may contain content hash in their names, for ex. 'main.css?1e7cac4e4d8b52fd5ccd2541146ef03f'.
      // We must proper handle such cases, so we use regexp testing here
      return /.css($|\?)/.test(chunkFile);
    });
    assets.chunks[chunkName].css = css;
    //css属性就是我们的文件路径
    assets.css = assets.css.concat(css);
  }
  // Duplicate css assets can occur on occasion if more than one chunk
  // requires the same css.
  assets.css = _.uniq(assets.css);
  //如果多个chunk使用了同一个css那么会产生重复的css
  return assets;
};
```
上面的这个例子展示了如何如何为输出的资源做这些处理：添加publicPath以便html能够正常访问;为资源的文件名，即URL中添加编译的hash值。同时你要注意：
```javascript
  var entry = chunkFiles[0];
    assets.chunks[chunkName].size = chunk.size;
    assets.chunks[chunkName].entry = entry;
    assets.chunks[chunkName].hash = chunk.hash;
    assets.js.push(entry);
```
之所以会如此处理是因为如果在webpack中配置了：

  devtool:'cheap-source-map',
那么每一个chunk产生的files就是一个数组，如下：

[ 'builds/vendor.bundle.js', 'builds/vendor.bundle.js.map' ]
[ 'builds/bundle.js', 'builds/bundle.js.map' ]
所以我们只会保存第一个js文件而已！

9.如何判断是否要重新产生资源文件
```javascript
 // If this is a hot update compilation, move on!
 // This solves a problem where an `index.html` file is generated for hot-update js files
 // It only happens in Webpack 2, where hot updates are emitted separately before the full bundle
  if (self.isHotUpdateCompilation(assets)) {
      return callback();
    }  // If the template and the assets did not change we don't have to emit the html
    //如果template和assets资源没有发生变化，我们不会重新产生html
    var assetJson = JSON.stringify(self.getAssetFiles(assets));
    //注意：这里包括了js,css,.appcache文件以及publicPath路径
    //isCompilationCached = compilationResult.hash && self.childCompilerHash === compilationResult.hash;
   //如果上次child compiler产生的hash和本次产生的hash(本次再次编译了一遍html)一致表示html没有变化
   //同时配置指定了可以读取html缓存，而且资源本身也没有发生变化，直接返回
    if (isCompilationCached && self.options.cache && assetJson === self.assetJson) {
      return callback();
    } else {
      self.assetJson = assetJson;
    }

HtmlWebpackPlugin.prototype.isHotUpdateCompilation = function (assets) {
  //如果每一个js的文件名，也就是入口文件都含有hot-update字段那么返回true
  return assets.js.length && assets.js.every(function (name) {
    return /\.hot-update\.js$/.test(name);
  });
};
HtmlWebpackPlugin.prototype.getAssetFiles = function (assets) {
  var files = _.uniq(Object.keys(assets).filter(function (assetType) {
    return assetType !== 'chunks' && assets[assetType];
    //获取类型不是chunks的资源
  }).reduce(function (files, assetType) {
    return files.concat(assets[assetType]);
  }, []));
  files.sort();
  return files;
};
```
如果该html是为了达到热更新的效果，那么不用每次都重新产生html文件，这有点值得学习。同时，这里也展示了如何判断本次编译的资源和上次的资源有没有发生变化，其通过把JSON转化为字符串的方式来比较！注意：childCompilerHash表示加载了html后得到的hash值！

10.如何获取一次打包依赖的所有的文件并在所有文件中添加一个自己的文件
```javascript
/*
 * Pushes the content of the given filename to the compilation assets
 */
HtmlWebpackPlugin.prototype.addFileToAssets = function (filename, compilation) {
  filename = path.resolve(compilation.compiler.context, filename);
  //获取文件的绝对路径，我们配置的是一个path
  //处理一个 promise 的 map 集合。只有有一个失败，所有的执行都结束,也就是说我们必须要同时获取到这个文件的大小和内容本身
  return Promise.props({
    size: fs.statAsync(filename),
    source: fs.readFileAsync(filename)
  })
  .catch(function () {
    return Promise.reject(new Error('HtmlWebpackPlugin: could not load file ' + filename));
  })
  .then(function (results) {
    var basename = path.basename(filename);
    //path.basename('/foo/bar/baz/asdf/quux.html')
     // Returns: 'quux.html'
     //获取文件名称
    compilation.fileDependencies.push(filename);
    //在compilation.fileDependencies中添加文件，filename是完整的文件路径
    compilation.assets[basename] = {
      source: function () {
        return results.source;
      },
      //source是文件的内容，通过fs.readFileAsync完成
      size: function () {
        return results.size.size;
        //size通过 fs.statAsync(filename)完成
      }
    };
    return basename;
  });
};
```
这里要学习的内容还是挺多的，首先把我们自己的文件添加到需要打包依赖文件集合中：

compilation.fileDependencies//在compilation.fileDependencies添加的必须是绝对路径
接下来就是修改compilation.assets对象：
```javascript
compilation.assets[basename] = {
      source: function () {
        return results.source;
      },
      //source是文件的内容，通过fs.readFileAsync完成
      size: function () {
        return results.size.size;
        //size通过 fs.statAsync(filename)完成
      }
    };
    return basename;
  });
```
不过这里的key就是我们的文件名，而不再包含文件路径！最后一个就是题外话了，来源于我们的bluebird(Promise.prop方法):

```javascript
var Promise = require('bluebird');
Promise.promisifyAll(fs);//所有fs对象的方法都promisify了，所以才有fs.statAsync(filename)， fs.readFileAsync(filename)，通过这两个方法就可以获取到我们的compilation.assets需要的source和size
```
