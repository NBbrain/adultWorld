import fs from 'fs';
var ws = fs.createWriteStream('./test.js', {start: 0});
class sourceTree{
  constructor(options){
    this.options = options;
  }
  apply(compiler){
    compiler.hooks.compilation.tap('compilation',(compilation)=>{
      let chunkName_path = compilation.outputOptions.chunkFilename;
      if(`${chunkName_path}`.indexOf('/src/pages/')>=0){
        let chunkName = chunkName_path.replace(/[\w\.\-]+\//g, '');
        console.log(chunkName);
      }
      compilation.hooks.chunkHash.tap('chunk-hash', (chunk, hash)=>{
        console.log(chunk, hash);
      });
      compilation.hooks.afterOptimizeChunkIds.tap('after-optimize-chunk-ids', (chunks) =>{
        console.log(chunks);
      })
    })
  }
}

// 优化顺序：modules, chunks, 树[record, module-order, module-ids, chunk-order, chunk-ids, record-modules, record-chunks, hash, assets]

module.exports = sourceTree;


