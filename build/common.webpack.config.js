import path from 'path';
import pkg from '../package.json';
const root_dir = path.resolve(__dirname, '..');
const get_cur_dir = (...args)=>path.resolve(root_dir, ...args);  // 获取当前项目下的某个目录
const isDebug = !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose');
const staticAssetName = isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]';
const imgRegexp = /\.(bmp|gif|jpg|jpeg|png|svg)$/;
const jsRegexp = /\.(?:js|jsx|mjs)$/;
const cssRegexp = /\.(?:css|less|scss)$/;
const minimizeCssOptions = {
  discardComments: { removeAll: true },
};

// 多入口时，如果用html-webpack-plugin，需要配置多个
// 引入第三方库：webpack.ProvidePlugin暴露变量

let config = {
  context: root_dir,
  mode: isDebug ? 'development' : 'production',
  output: {
    path: get_cur_dir('dist','public/assets'),
    publicPath: '/assets/', // 按需加载 或 加载外部资源
    filename: isDebug ? '[name].js' : '[name].[chunkhash:8].js',
    chunkFilename: isDebug ? '[name].chunk.js' :'[name].[chunkhash:8].chunk.js', // 非入口文件
    devtoolModuleFilenameTemplate: info => {
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/');
    }
  },
  resolve: {
    modules: ['node_modules', 'src']
  },
  module: {
    strictExportPresence: true, // 缺少exports报错，而非警告
    // 这个输出的是哪部分文件？
    rules: [
      // js相关文本
      {
        test: jsRegexp,
        include: get_cur_dir('src'),
        exclude: get_cur_dir('dist'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: isDebug,
          babelrc: false,
        }
      },
      // 样式
      {
        test: cssRegexp,
        // css-loader用来解析处理css中的url路径，把css文件变成一个模块
        // style-loader把css文件变成style标签插入head
        rules: [
          // 第三方样式
          {
            include: get_cur_dir('src'),
            exclude: get_cur_dir('dist'),
            loader: 'css-loader',
            options: {
              sourceMap: isDebug,
              minimize: isDebug ? false : minimizeCssOptions
            }
          },
          // 内部
          {
            include: get_cur_dir('src'),
            exclude: get_cur_dir('dist'),
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: isDebug,
              modules: true,
              localIdentName: isDebug ? '[name]-[local]-[hash:base64:5]' : '..',
              minimize: isDebug ? false : minimizeCssOptions
            }
          },{
            loader: 'postcss-loader',
            options: {
              config: {
                path: get_cur_dir('./postcss.config.js')
              }
            }
          }
        ]
      },
      // 图片
      {
        test: imgRegexp,
        // url-loader当图片较小时转为base64
        oneOf: [
          {
            // issuer: /\.(?:css|less|scss)$/,
            test: /\.svg$/,
            loader: 'svg-url-loader',
            options: {
              name: staticAssetName,
              limit: 4096,
            }
          },{
            loader: 'url-loader',
            options: {
              name: staticAssetName,
              limit: 4096,
            }
          },{
            loader: 'file-loader',
            options: {
              name: staticAssetName
            }
          }
        ]
      },
      // 普通文本转成js module
      {
        test: /\.txt$/,
        loader: 'raw-loader',
      },
      // md 文件转成html
      {
        test: /\.md$/,
        loader: path.resolve('./markdown-loader.js'),
      },
      {
        exclude: [jsRegexp, cssRegexp, imgRegexp, /\.json$/, /\.txt$/, /\.md$/],
        loader: 'file-loader',
        options: {
          name: staticAssetName
        }
      },
      // todo 这个是为了解决什么问题？
      ...(isDebug ? [] : [{
        test: get_cur_dir('node_modules/react-deep-force-update/lib/index.js'),
        loader: 'null-loader'
      }])
    ],
  },
  // 有错误不能继续
  bail: !isDebug,

  cache: isDebug,

  // 指定打包包含的信息
  stats: {
    cached: isVerbose,
    cachedAssets: isVerbose,
    chunks: isVerbose,
    chunkModules: isVerbose,
    colors: true,
    hash: isVerbose,
    modules: isVerbose,
    reasons: isDebug,
    timings: true,
    version: isVerbose,
  },
  devtool: isDebug ? 'cheap-module-inline-source-map' : 'source-map',
}

export default config;
