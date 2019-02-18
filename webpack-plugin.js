class showCompilerPlugin{
  constructor(options){

  }
  apply(compiler){
    compiler.hooks.
  }
}

module.exports = showCompilerPlugin;


// this.hooks = {
//   /** @type {SyncBailHook<Compilation>} */
//   shouldEmit: new SyncBailHook(["compilation"]),
//   /** @type {AsyncSeriesHook<Stats>} */
//   done: new AsyncSeriesHook(["stats"]),
//   /** @type {AsyncSeriesHook<>} */
//   additionalPass: new AsyncSeriesHook([]),
//   /** @type {AsyncSeriesHook<Compiler>} */
//   beforeRun: new AsyncSeriesHook(["compiler"]),
//   /** @type {AsyncSeriesHook<Compiler>} */
//   run: new AsyncSeriesHook(["compiler"]),
//   /** @type {AsyncSeriesHook<Compilation>} */
//   emit: new AsyncSeriesHook(["compilation"]),
//   /** @type {AsyncSeriesHook<Compilation>} */
//   afterEmit: new AsyncSeriesHook(["compilation"]),

//   /** @type {SyncHook<Compilation, CompilationParams>} */
//   thisCompilation: new SyncHook(["compilation", "params"]),
//   /** @type {SyncHook<Compilation, CompilationParams>} */
//   compilation: new SyncHook(["compilation", "params"]),
//   /** @type {SyncHook<NormalModuleFactory>} */
//   normalModuleFactory: new SyncHook(["normalModuleFactory"]),
//   /** @type {SyncHook<ContextModuleFactory>}  */
//   contextModuleFactory: new SyncHook(["contextModulefactory"]),

//   /** @type {AsyncSeriesHook<CompilationParams>} */
//   beforeCompile: new AsyncSeriesHook(["params"]),
//   /** @type {SyncHook<CompilationParams>} */
//   compile: new SyncHook(["params"]),
//   /** @type {AsyncParallelHook<Compilation>} */
//   make: new AsyncParallelHook(["compilation"]),
//   /** @type {AsyncSeriesHook<Compilation>} */
//   afterCompile: new AsyncSeriesHook(["compilation"]),

//   /** @type {AsyncSeriesHook<Compiler>} */
//   watchRun: new AsyncSeriesHook(["compiler"]),
//   /** @type {SyncHook<Error>} */
//   failed: new SyncHook(["error"]),
//   /** @type {SyncHook<string, string>} */
//   invalid: new SyncHook(["filename", "changeTime"]),
//   /** @type {SyncHook} */
//   watchClose: new SyncHook([]),

//   // TODO the following hooks are weirdly located here
//   // TODO move them for webpack 5
//   /** @type {SyncHook} */
//   environment: new SyncHook([]),
//   /** @type {SyncHook} */
//   afterEnvironment: new SyncHook([]),
//   /** @type {SyncHook<Compiler>} */
//   afterPlugins: new SyncHook(["compiler"]),
//   /** @type {SyncHook<Compiler>} */
//   afterResolvers: new SyncHook(["compiler"]),
//   /** @type {SyncBailHook<string, Entry>} */
//   entryOption: new SyncBailHook(["context", "entry"])
// };

// this._pluginCompat.tap("Compiler", callback)


// this.hooks = {
//   /** @type {SyncHook<Module>} */
//   buildModule: new SyncHook(["module"]),
//   /** @type {SyncHook<Module>} */
//   rebuildModule: new SyncHook(["module"]),
//   /** @type {SyncHook<Module, Error>} */
//   failedModule: new SyncHook(["module", "error"]),
//   /** @type {SyncHook<Module>} */
//   succeedModule: new SyncHook(["module"]),

//   /** @type {SyncHook<Dependency, string>} */
//   addEntry: new SyncHook(["entry", "name"]),
//   /** @type {SyncHook<Dependency, string, Error>} */
//   failedEntry: new SyncHook(["entry", "name", "error"]),
//   /** @type {SyncHook<Dependency, string, Module>} */
//   succeedEntry: new SyncHook(["entry", "name", "module"]),

//   /** @type {SyncWaterfallHook<DependencyReference, Dependency, Module>} */
//   dependencyReference: new SyncWaterfallHook([
//     "dependencyReference",
//     "dependency",
//     "module"
//   ]),

//   /** @type {SyncHook<Module[]>} */
//   finishModules: new SyncHook(["modules"]),
//   /** @type {SyncHook<Module>} */
//   finishRebuildingModule: new SyncHook(["module"]),
//   /** @type {SyncHook} */
//   unseal: new SyncHook([]),
//   /** @type {SyncHook} */
//   seal: new SyncHook([]),

//   /** @type {SyncHook} */
//   beforeChunks: new SyncHook([]),
//   /** @type {SyncHook<Chunk[]>} */
//   afterChunks: new SyncHook(["chunks"]),

//   /** @type {SyncBailHook<Module[]>} */
//   optimizeDependenciesBasic: new SyncBailHook(["modules"]),
//   /** @type {SyncBailHook<Module[]>} */
//   optimizeDependencies: new SyncBailHook(["modules"]),
//   /** @type {SyncBailHook<Module[]>} */
//   optimizeDependenciesAdvanced: new SyncBailHook(["modules"]),
//   /** @type {SyncBailHook<Module[]>} */
//   afterOptimizeDependencies: new SyncHook(["modules"]),

//   /** @type {SyncHook} */
//   optimize: new SyncHook([]),
//   /** @type {SyncBailHook<Module[]>} */
//   optimizeModulesBasic: new SyncBailHook(["modules"]),
//   /** @type {SyncBailHook<Module[]>} */
//   optimizeModules: new SyncBailHook(["modules"]),
//   /** @type {SyncBailHook<Module[]>} */
//   optimizeModulesAdvanced: new SyncBailHook(["modules"]),
//   /** @type {SyncHook<Module[]>} */
//   afterOptimizeModules: new SyncHook(["modules"]),

//   /** @type {SyncBailHook<Chunk[], ChunkGroup[]>} */
//   optimizeChunksBasic: new SyncBailHook(["chunks", "chunkGroups"]),
//   /** @type {SyncBailHook<Chunk[], ChunkGroup[]>} */
//   optimizeChunks: new SyncBailHook(["chunks", "chunkGroups"]),
//   /** @type {SyncBailHook<Chunk[], ChunkGroup[]>} */
//   optimizeChunksAdvanced: new SyncBailHook(["chunks", "chunkGroups"]),
//   /** @type {SyncHook<Chunk[], ChunkGroup[]>} */
//   afterOptimizeChunks: new SyncHook(["chunks", "chunkGroups"]),

//   /** @type {AsyncSeriesHook<Chunk[], Module[]>} */
//   optimizeTree: new AsyncSeriesHook(["chunks", "modules"]),
//   /** @type {SyncHook<Chunk[], Module[]>} */
//   afterOptimizeTree: new SyncHook(["chunks", "modules"]),

//   /** @type {SyncBailHook<Chunk[], Module[]>} */
//   optimizeChunkModulesBasic: new SyncBailHook(["chunks", "modules"]),
//   /** @type {SyncBailHook<Chunk[], Module[]>} */
//   optimizeChunkModules: new SyncBailHook(["chunks", "modules"]),
//   /** @type {SyncBailHook<Chunk[], Module[]>} */
//   optimizeChunkModulesAdvanced: new SyncBailHook(["chunks", "modules"]),
//   /** @type {SyncHook<Chunk[], Module[]>} */
//   afterOptimizeChunkModules: new SyncHook(["chunks", "modules"]),
//   /** @type {SyncBailHook} */
//   shouldRecord: new SyncBailHook([]),

//   /** @type {SyncHook<Module[], any>} */
//   reviveModules: new SyncHook(["modules", "records"]),
//   /** @type {SyncHook<Module[]>} */
//   optimizeModuleOrder: new SyncHook(["modules"]),
//   /** @type {SyncHook<Module[]>} */
//   advancedOptimizeModuleOrder: new SyncHook(["modules"]),
//   /** @type {SyncHook<Module[]>} */
//   beforeModuleIds: new SyncHook(["modules"]),
//   /** @type {SyncHook<Module[]>} */
//   moduleIds: new SyncHook(["modules"]),
//   /** @type {SyncHook<Module[]>} */
//   optimizeModuleIds: new SyncHook(["modules"]),
//   /** @type {SyncHook<Module[]>} */
//   afterOptimizeModuleIds: new SyncHook(["modules"]),

//   /** @type {SyncHook<Chunk[], any>} */
//   reviveChunks: new SyncHook(["chunks", "records"]),
//   /** @type {SyncHook<Chunk[]>} */
//   optimizeChunkOrder: new SyncHook(["chunks"]),
//   /** @type {SyncHook<Chunk[]>} */
//   beforeChunkIds: new SyncHook(["chunks"]),
//   /** @type {SyncHook<Chunk[]>} */
//   optimizeChunkIds: new SyncHook(["chunks"]),
//   /** @type {SyncHook<Chunk[]>} */
//   afterOptimizeChunkIds: new SyncHook(["chunks"]),

//   /** @type {SyncHook<Module[], any>} */
//   recordModules: new SyncHook(["modules", "records"]),
//   /** @type {SyncHook<Chunk[], any>} */
//   recordChunks: new SyncHook(["chunks", "records"]),

//   /** @type {SyncHook} */
//   beforeHash: new SyncHook([]),
//   /** @type {SyncHook<Chunk>} */
//   contentHash: new SyncHook(["chunk"]),
//   /** @type {SyncHook} */
//   afterHash: new SyncHook([]),
//   /** @type {SyncHook<any>} */
//   recordHash: new SyncHook(["records"]),
//   /** @type {SyncHook<Compilation, any>} */
//   record: new SyncHook(["compilation", "records"]),

//   /** @type {SyncHook} */
//   beforeModuleAssets: new SyncHook([]),
//   /** @type {SyncBailHook} */
//   shouldGenerateChunkAssets: new SyncBailHook([]),
//   /** @type {SyncHook} */
//   beforeChunkAssets: new SyncHook([]),
//   /** @type {SyncHook<Chunk[]>} */
//   additionalChunkAssets: new SyncHook(["chunks"]),

//   /** @type {AsyncSeriesHook} */
//   additionalAssets: new AsyncSeriesHook([]),
//   /** @type {AsyncSeriesHook<Chunk[]>} */
//   optimizeChunkAssets: new AsyncSeriesHook(["chunks"]),
//   /** @type {SyncHook<Chunk[]>} */
//   afterOptimizeChunkAssets: new SyncHook(["chunks"]),
//   /** @type {AsyncSeriesHook<CompilationAssets>} */
//   optimizeAssets: new AsyncSeriesHook(["assets"]),
//   /** @type {SyncHook<CompilationAssets>} */
//   afterOptimizeAssets: new SyncHook(["assets"]),

//   /** @type {SyncBailHook} */
//   needAdditionalSeal: new SyncBailHook([]),
//   /** @type {AsyncSeriesHook} */
//   afterSeal: new AsyncSeriesHook([]),

//   /** @type {SyncHook<Chunk, Hash>} */
//   chunkHash: new SyncHook(["chunk", "chunkHash"]),
//   /** @type {SyncHook<Module, string>} */
//   moduleAsset: new SyncHook(["module", "filename"]),
//   /** @type {SyncHook<Chunk, string>} */
//   chunkAsset: new SyncHook(["chunk", "filename"]),

//   /** @type {SyncWaterfallHook<string, TODO>} */
//   assetPath: new SyncWaterfallHook(["filename", "data"]), // TODO MainTemplate

//   /** @type {SyncBailHook} */
//   needAdditionalPass: new SyncBailHook([]),

//   /** @type {SyncHook<Compiler, string, number>} */
//   childCompiler: new SyncHook([
//     "childCompiler",
//     "compilerName",
//     "compilerIndex"
//   ]),

//   // TODO the following hooks are weirdly located here
//   // TODO move them for webpack 5
//   /** @type {SyncHook<object, Module>} */
//   normalModuleLoader: new SyncHook(["loaderContext", "module"]),

//   /** @type {SyncBailHook<Chunk[]>} */
//   optimizeExtractedChunksBasic: new SyncBailHook(["chunks"]),
//   /** @type {SyncBailHook<Chunk[]>} */
//   optimizeExtractedChunks: new SyncBailHook(["chunks"]),
//   /** @type {SyncBailHook<Chunk[]>} */
//   optimizeExtractedChunksAdvanced: new SyncBailHook(["chunks"]),
//   /** @type {SyncHook<Chunk[]>} */
//   afterOptimizeExtractedChunks: new SyncHook(["chunks"])
// };

// this._pluginCompat.tap("compilation", callback)
