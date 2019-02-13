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
