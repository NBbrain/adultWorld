const fs = require('fs');
const frontMatter = require('front-matter');  // 处理读取到的文件流 为 对象{attributes, body, frontmatter}
const markdownIt = require('markdown-it'); // markdown 文件 处理成html, 实例配置， 实例渲染数据

module.exports = function markdownLoader(source){
  const md = new markdownIt({
    html: true,
    linkify: true,
  });
  const fd = frontMatter(source);
  fd.attributes.key = path.basename(this.resourcePath, '.md');
  fd.attributes.html = md.render(fd.body);
  return module.exports = `${JSON.stringify(fd.attributes)}`;
}
