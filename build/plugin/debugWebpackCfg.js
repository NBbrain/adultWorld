const pluginName = 'debugWebpackConfigPlugin';
module.exports = class debugWebpackConfigPlugin {
  constructor(options){

  }
  apply(compiler){
    compiler.hooks.compilation.tap(pluginName, (compilation)=>{
      compilation.hooks.succeedModule.tap(pluginName, (module)=>{
        // console.log(module);
        // console.log('============================');
      })
      compilation.hooks.succeedModule.tap(pluginName, (module)=>{
        // console.log(module);
        // console.log('失败============================');
      })
    })
  }
}
