import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import webpackAssetsManifest from 'webpack-assets-manifest'; // 生成一个json文件，和原文件名散列匹配
import nodeExternals from 'webpack-node-externals'; // 构建一个外部函数，告诉要包含的模块 或 子模块
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'; // 模块分析
import config from './common.webpack.config';
import { resolve } from 'dns';
import pkg from '../package.json';
import overrideRules from './lib/overrideRules';
import debugWebpackConfigPlugin from './plugin/debugWebpackCfg';

const root_dir = path.resolve(__dirname, '..');
const get_cur_dir = (...args)=>path.resolve(root_dir, ...args);  // 获取当前项目下的某个目录
const isDebug = !process.argv.includes('--release');
const isAnalyze = process.argv.includes('--analyze') || process.argv.includes('analyse');

const staticAssetName = isDebug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]';
const imgRegexp = /\.(bmp|gif|jpg|jpeg|png|svg)$/;
const jsRegexp = /\.(?:js|jsx|mjs)$/;
const cssRegexp = /\.(?:css|less|scss)$/;



const clientConfig = {
  ...config,
  name: 'client',
  target: 'web',
  entry: {
    client: ['@babel/polyfill', '../src/fe/client.js']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
      __isClient__: true,
      __DEV__: isDebug,
    }),
    // 生成manifest.json文件，在服务端使用
    new webpackAssetsManifest({
      // 生成的json----文件名，多页面需要配置成数组
      output: `${get_cur_dir('dist')}/asset-manifest.json`,
      writeToDisk: true,
      publicPath: true,
      // entry
      customize:({key, value})=>{
        if(key.toLowerCase().endsWith('.map')) return false;
        return {key, value};
      },
      // 根据中间的chunk-manifest.json文件
      done: ({manifest, stats})=>{
        const chunkFilename = `${get_cur_dir('dist')}/chunk-manifest.json`
        try{
          // 获取非.map文件的路径
          const fileFilter = file => !file.endsWith('.map');
          const addPath = file => manifest.getPublicPath(file);
          const chunkFiles = stats.compilation.chunkGroups.reduce((acc, c)=>{
            // 定义属性
            acc[c.name] = [
              ...(acc[c.name] || []),
              c.chunks.reduce((files, cc) => [
                ...files,
                ...cc.files.filter(fileFilter).map(addPath)
              ], [])
            ];
            return acc;
          }, Object.create(null));
        }catch(err){
          console.error(`Error: Cannot write ${chunkFileName}:`, err);
          if(!isDebug) process.exit(1);
        }
      }
    }),
    ...(isDebug ? [] : [...(isAnalyze ? [new BundleAnalyzerPlugin()] : [])])
  ],
  // ???
  // optimization 优化打包策略
  // optimization.splitChunks替换了原来 的CommonsChunkPlugin
  // optimization.splitChunks 和 optimization.runtimeChunk 默认生成共享的代码块；一切皆模块，一个模块对应一个文件
  // chunk 代码块，一个chunk由多个模块组成
  // webpack-dev-server开发时的一个服务器，把打包的文件全部放入mwdhk，可以热更新替换。
  // 缓存组：将node_modules中的模块拆分一个vendors的代码块，也可以对重复引用的模块再提取
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: 'initial',
          test: /\/node_modules\//,
          name: 'vendors',
        }
      }
    }
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  }
}

const serverConfig = {
  ...config,
  name: 'server',
  target: 'node',
  entry: {
    server: ['@babel/polyfill', './src/server/server.js']
  },
  output: {
    ...config.output,
    path: get_cur_dir('../dist'),
    filename: '[name].js',
    chunkFilename: 'chunks/[name].js',
    libraryTarget: 'commonjs2',   // commonjs 2 module.exports
  },
  resolve: {
    ...config.resolve,
  },
  // todo 改写了规则？？
  module: {
    ...config.module,
    // 对rules执行最后的回调，为其添加额外的配置，为什么要这么实现？
    rules: overrideRules(config.module.rules, rule => {
      // babel-loader时，更新其preset配置
      if(rule.loader === 'babel-loader'){
        return {
          ...rule,
          options: {
            ...rule.options,
            presets: rule.options.presets.map(preset => preset[0] !== '@babel/preset-env' ? preset : [
              '@babel/preset-env',
              {
                targets: {
                  node: pkg.engines.node.match(/(\d+\.?)+/)[0],
                },
                modules: false,
                useBuiltIns: false,
                debug: false
              }
            ])
          }
        }
      }
      if(rule.loader === 'file-loader' ||
        rule.loader === 'url-loader' ||
        rule.loader === 'svg-url-loader'){
        return {
          ...rule,
          options: {
            ...rule.options,
            emitFile: false,
          },
        };
      }
      return rule;
    })
  },
  // 描述外部可访问的方式，从输出bundle中排除
  externals:[
    './chunk-manifest.json',
    './asset-manifest.json',
    nodeExternals({
      whitelist:[cssRegexp, imgRegexp]
    })
  ],
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER': false,
      __DEV__: isDebug,
    }),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
    new debugWebpackConfigPlugin()
  ],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  }
}

export default [clientConfig, serverConfig];
