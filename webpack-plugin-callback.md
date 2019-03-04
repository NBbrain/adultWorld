# 所有事件钩子

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
- additionalAssets (AsyncSeriesHook)：为编译(compilation)创建附加资源(asset)。这个钩子可以用来下载图像，
```javascript
compilation.hooks.additionalAssets.tapAsync('MyPlugin', callback => {
  download('https://img.shields.io/npm/v/webpack.svg', function(resp) {
    if(resp.status === 200) {
      compilation.assets['webpack-version.svg'] = toAsset(resp);
      callback();
    } else {
      callback(new Error('[webpack-example-plugin] Unable to download the image'));
    }
  });
});
```
- optimizeChunkAssets (AsyncSeriesHook)：优化所有 chunk 资源(asset)。资源(asset)会被存储在 compilation.assets。每个 Chunk 都有一个 files 属性，指向这个 chunk 创建的所有文件。附加资源(asset)被存储在 compilation.additionalChunkAssets 中。 `参数：chunks`
以下是为每个 chunk 添加 banner 的简单示例。

```javascript
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
```

- afterOptimizeChunkAssets (SyncHook)：chunk 资源(asset)已经被优化。 `参数：chunks`
这里是一个来自 @boopathi 的示例插件，详细地输出每个 chunk 里有什么。

```javascript
compilation.hooks.afterOptimizeChunkAssets.tap('MyPlugin', chunks => {
  chunks.forEach(chunk => {
    console.log({
      id: chunk.id,
      name: chunk.name,
      includes: chunk.modules.map(module => module.request)
    });
  });
});
```

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

## 事件钩子执行顺序结构

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
