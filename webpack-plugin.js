class showCompilerPlugin{
  constructor(options){
    this.options = options;
  }
  apply(compiler){
    compiler.plugin('compilation', (compilation)=>{
      compilation.plugin('optimize-chunks', function (chunks) {
        chunks.forEach(function (chunk) {
          // chunk 含有模块的循环引用
          chunk.modules.forEach(function (module) {
              console.log(module);
              // module.loaders, module.rawRequest, module.dependencies 等。
          });
        });
      });
    })
    // 在钩子事件上用tap进行事件监听；compiler.hooks.done.call(param)进行事件广播，但这些事件是webpack里的事件，会自行执行。
    // compiler.hooks.done.tap('dependency_tree', ()=>{

    // })
    // compiler.hooks.done.tapAsync
    // compiler.hooks.done.tapPromise
  }
}

module.exports = showCompilerPlugin;


