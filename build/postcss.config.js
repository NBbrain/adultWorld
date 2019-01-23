const pkg = require('../package.json');
// 执行 postcss([plugin(options)]).process(css)
// 或 postcss().use(plugin()).process(css)
module.exports = ()=>({
  plugins: [
    // 转换 @import 规则为行内内容
    require('postcss-import')(),
    // 媒体选择
    require('postcss-custom-media')(),
    // 最大与最小屏的媒体
    require('postcss-media-minmax')(),
    // clac函数
    require('postcss-calc')(),
    // & 新的嵌套规则
    // require('postcss-nesting')(),
    // & 新的嵌套规则
    // require('postcss-nested')(),
    // 颜色函数
    require('postcss-color-function')(),
    // fliter:...
    require('pleeease-filters')(),
    // todo
    require('pixrem')(),
    // :not(:first-child .k) not选择器
    require('postcss-selector-not')(),
    // fix flex的bug
    require('postcss-flexbugs-fixes')(),
    // 加前缀
    require('autoprefixer')({
      browsers: pkg.browserslist,
      flexbox: 'no-2009',
    })
  ]
})
