import path from 'path';
import express from 'express';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import webpackConfig from './webpack.config';
import run, { format } from './run';
import clean from './clean';

const isDebug = !process.argv.includes('--release');

// https://webpack.js.org/configuration/watch/#watchoptions
const watchOptions = {
  // Watching may not work with NFS and machines in VirtualBox
  // Uncomment next line if it is your case (use true or interval in milliseconds)
  // poll: true,
  // Decrease CPU or memory usage in some file systems
  // ignored: /node_modules/,
};
function createCompilationPromise(name, compiler, config) {
  return new Promise((resolve, reject) => {
    let timeStart = new Date();
    compiler.hooks.compile.tap(name, () => {
      timeStart = new Date();
      console.info(`[${format(timeStart)}] Compiling '${name}'...`);
    });

    compiler.hooks.compilation.tap(name, (compilation)=>{
      console.info(compilation.getStatus().toJson().assets);
    });
    compiler.hooks.done.tap(name, stats => {
      console.log(name);
      console.info(stats.toString(config.stats));
      const timeEnd = new Date();
      const time = timeEnd.getTime() - timeStart.getTime();
      if (stats.hasErrors()) {
        console.info(
          `[${format(timeEnd)}] Failed to compile '${name}' after ${time} ms`,
        );
        reject(new Error('Compilation failed!'));
      } else {
        console.info(
          `[${format(
            timeEnd,
          )}] Finished '${name}' compilation after ${time} ms`,
        );
        resolve(stats);
      }
    });
  });
}

let server;

/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
async function start() {
  if (server) return server;
  server = express();
  server.use(errorOverlayMiddleware());
  // public目录？
  server.use(express.static(path.resolve(__dirname, '../public')));

  // 入口配置热更新，并处理其资源缓存，做排序是？
  const clientConfig = webpackConfig.find(config => config.name === 'client');
  clientConfig.entry.client = ['./lib/webpackHotDevClient']
    .concat(clientConfig.entry.client)
    .sort((a, b) => b.includes('polyfill') - a.includes('polyfill'));
  // 为什么在此处替换其输出文件规则？
  clientConfig.output.filename = clientConfig.output.filename.replace(
    'chunkhash',
    'hash',
  );
  clientConfig.output.chunkFilename = clientConfig.output.chunkFilename.replace(
    'chunkhash',
    'hash',
  );
  // 为什么又在些过滤掉null-loader？
  clientConfig.module.rules = clientConfig.module.rules.filter(
    x => x.loader !== 'null-loader',
  );

  // 热更新插件
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  // 服务端热更新，配置与客户端不同
  const serverConfig = webpackConfig.find(config => config.name === 'server');
  serverConfig.output.hotUpdateMainFilename = 'updates/[hash].hot-update.json';
  serverConfig.output.hotUpdateChunkFilename =
    'updates/[id].[hash].hot-update.js';
  serverConfig.module.rules = serverConfig.module.rules.filter(
    x => x.loader !== 'null-loader',
  );
  serverConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  // Configure compilation
  await run(clean);
  const multiCompiler = webpack(webpackConfig, (error, stats)=>{
    let info = stats && stats.toJson()
    console.info(info && info.errors);
  });
  const clientCompiler = multiCompiler.compilers.find(
    compiler => compiler.name === 'client',
  );
  const serverCompiler = multiCompiler.compilers.find(
    compiler => compiler.name === 'server',
  );

  const clientPromise = createCompilationPromise(
    'client',
    clientCompiler,
    clientConfig,
  );
  const serverPromise = createCompilationPromise(
    'server',
    serverCompiler,
    serverConfig,
  );

  // https://github.com/webpack/webpack-dev-middleware
  // client server启用webpack中间件，将webpack编译结果。。。
  server.use(webpackDevMiddleware(clientCompiler, {
    publicPath: '/',
  }));
  server.use(
    webpackDevMiddleware(clientCompiler, {
      publicPath: clientConfig.output.publicPath,
      writeToDisk: true,
      logLevel: 'silent',
      watchOptions,
    }),
  );

  // https://github.com/glenjamin/webpack-hot-middleware
  // client server热更新
  server.use(webpackHotMiddleware(clientCompiler, {
    log: false,
  }));

  serverCompiler.hooks.done.tap('server', stats => {
    purgeCache(('./dist/server'));
  })

  function purgeCache(moduleName){
    searchCache(moduleName, function(mod){
      delete require.cache[mod.id];
    });
    Object.keys(module.constructor._pathCache).forEach((cacheKey)=>{
      if(cacheKey.indexOf(moduleName)>0){
        delete module.constructor._pathCache[cacheKey];
      }
    })
  }
  function searchCache(moduleName, callback){
    let mod = require.resolve(moduleName);
    if(mod && ((mod = require.cache[mod]) !== undefined)){
      (function traverse(mod){
        mod.children.forEach((child)=>{
          traverse(child);
        })
        callback(mod);
      })(mod)
    }
  }
  server.listen(3000, function () {
    console.log(`app start: http://localhost:3000`)
  });
  // let appPromise;
  // let appPromiseResolve;
  // let appPromiseIsResolved = true;
  // serverCompiler.hooks.compile.tap('server', () => {
  //   if (!appPromiseIsResolved) return;
  //   appPromiseIsResolved = false;
  //   // eslint-disable-next-line no-return-assign
  //   appPromise = new Promise(resolve => (appPromiseResolve = resolve));
  // });

  // let app;
  // server.use((req, res) => {
  //   appPromise
  //     .then(() => app.handle(req, res))
  //     .catch(error => console.error(error));
  // });

  // function checkForUpdate(fromUpdate) {
  //   const hmrPrefix = '[\x1b[35mHMR\x1b[0m] ';
  //   if (!app.hot) {
  //     throw new Error(`${hmrPrefix}Hot Module Replacement is disabled.`);
  //   }
  //   if (app.hot.status() !== 'idle') {
  //     return Promise.resolve();
  //   }
  //   return app.hot
  //     .check(true)
  //     .then(updatedModules => {
  //       if (!updatedModules) {
  //         if (fromUpdate) {
  //           console.info(`${hmrPrefix}Update applied.`);
  //         }
  //         return;
  //       }
  //       if (updatedModules.length === 0) {
  //         console.info(`${hmrPrefix}Nothing hot updated.`);
  //       } else {
  //         console.info(`${hmrPrefix}Updated modules:`);
  //         updatedModules.forEach(moduleId =>
  //           console.info(`${hmrPrefix} - ${moduleId}`),
  //         );
  //         checkForUpdate(true);
  //       }
  //     })
  //     .catch(error => {
  //       if (['abort', 'fail'].includes(app.hot.status())) {
  //         console.warn(`${hmrPrefix}Cannot apply update.`);
  //         delete require.cache[require.resolve('../dist/server')];
  //         // eslint-disable-next-line global-require, import/no-unresolved
  //         app = require('../dist/server').default;
  //         console.warn(`${hmrPrefix}App has been reloaded.`);
  //       } else {
  //         console.warn(
  //           `${hmrPrefix}Update failed: ${error.stack || error.message}`,
  //         );
  //       }
  //     });
  // }

  // serverCompiler.watch(watchOptions, (error, stats) => {
  //   if (app && !error && !stats.hasErrors()) {
  //     checkForUpdate().then(() => {
  //       appPromiseIsResolved = true;
  //       appPromiseResolve();
  //     });
  //   }
  // });
  // // Wait until both client-side and server-side bundles are ready
  // await clientPromise;
  // await serverPromise;

  // const timeStart = new Date();
  // console.info(`[${format(timeStart)}] Launching server...`);

  // // Load compiled src/server.js as a middleware
  // // eslint-disable-next-line global-require, import/no-unresolved
  // // ??? 未输出server
  // app = require('../dist/server').default;
  // appPromiseIsResolved = true;
  // appPromiseResolve();

  // // Launch the development server with Browsersync and HMR
  // await new Promise((resolve, reject) =>
  //   browserSync.create().init(
  //     {
  //       // https://www.browsersync.io/docs/options
  //       server: 'src/server/server.js',
  //       middleware: [server],
  //       open: !process.argv.includes('--silent'),
  //       ...(isDebug ? {} : { notify: false, ui: false }),
  //     },
  //     (error, bs) => {return (error ? reject(error) : resolve(bs))},
  //   ),
  // );

  // const timeEnd = new Date();
  // const time = timeEnd.getTime() - timeStart.getTime();
  // console.info(`[${format(timeEnd)}] Server launched after ${time} ms`);
  return server;
}

export default start;
