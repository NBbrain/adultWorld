# plugin API

Tapable是webpack的核心工具，提供插件接口

1. 使用：扩展Tapable对象，提供的钩子及钩子的类型；
2. 使用钩子hooks 和 tap，插件可以以多种不同的方式运行；
3. compiler hooks记录了 Tapable内在的钩子，指出哪些tap方法可用。
4. 自定义钩子函数：tapable 中 SyncHook, SyncBailHook, SyncWaterfallHook, SyncLoopHook, AsyncParallelHook, AsyncParallelBailHook, AsyncSeriesHook, AsyncSeriesBailHook, AsyncSeriesWaterfallHook

```javascript
const SyncHook = require('tapable').SyncHook;

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


## 钩子 compiler提供的方法

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


## 钩子 compilation会被compiler用来创建新的编译；Compilation能够访问所有的模块及它们的依赖；对应用程序进行字面上的编译。提供的方法

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
