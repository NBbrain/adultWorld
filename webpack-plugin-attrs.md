# plugin API  属性

## 两种定义插件方式

1. 老的: compiler.plugin('事件钩子', 后面的参数决定同步或异步)
2. 新的：compiler.hooks.事件钩子.tap('name', callback) / tapAsync(name, function(params, callback)) / tapPromise(name, callback(params)=>{}).then()


## 参数配置

```javascript
// compilation.outputOptions
{
	path: 'builds',
	filename: 'bundle.js',
	publicPath: 'builds/',
	chunkFilename: '[id].bundle.js',
	library: '',
	hotUpdateFunction: 'webpackHotUpdate',
	jsonpFunction: 'webpackJsonp',
	libraryTarget: 'var',
	sourceMapFilename: '[file].map[query]',
	hotUpdateChunkFilename: '[id].[hash].hot-update.js',
	hotUpdateMainFilename: '[hash].hot-update.json',
	crossOriginLoading: false,
	hashFunction: 'md5',
	hashDigest: 'hex',
	hashDigestLength: 20,
	devtoolLineToLine: false,
	strictModuleExceptionHandling: false
}
// compilation.options
{
	entry: './src',
	output: {
		path: 'builds',
		filename: 'bundle.js',
		publicPath: 'builds/',
		chunkFilename: '[id].bundle.js',
		library: '',
		hotUpdateFunction: 'webpackHotUpdate',
		jsonpFunction: 'webpackJsonp',
		libraryTarget: 'var',
		sourceMapFilename: '[file].map[query]',
		hotUpdateChunkFilename: '[id].[hash].hot-update.js',
		hotUpdateMainFilename: '[hash].hot-update.json',
		crossOriginLoading: false,
		hashFunction: 'md5',
		hashDigest: 'hex',
		hashDigestLength: 20,
		devtoolLineToLine: false,
		strictModuleExceptionHandling: false
	},
	plugins: [CommonsChunkPlugin {
			chunkNames: 'vendor',
			filenameTemplate: 'vendor.bundle.js',
			minChunks: 2,
			selectedChunks: undefined,
			async: undefined,
			minSize: undefined,
			ident: 'C:\\Users\\Administrator\\Desktop\\webpack-chunkfilename\\node_mo
			dules\\ webpack\\ lib\\ optimize\\ CommonsChunkPlugin.js0 ' },
			HtmlWebpackPlugin {
				options: [Object],
				childCompilerHash: '729d3caf962246f308dc6d5b1542a9ae',
				childCompilationOutputName: 'index.html'
			}],
		module: {
			loaders: [
				[Object],
				[Object],
				[Object],
				[Object]
			],
			unknownContextRequest: '.',
			unknownContextRegExp: false,
			unknownContextRecursive: true,
			unknownContextCritical: true,
			exprContextRequest: '.',
			exprContextRegExp: false,
			exprContextRecursive: true,
			exprContextCritical: true,
			wrappedContextRegExp: /.*/,
			wrappedContextRecursive: true,
			wrappedContextCritical: false,
			unsafeCache: true
		},
		bail: false,
		profile: false,
		context: 'C:\\Users\\Administrator\\Desktop\\webpack-chunkfilename',
		devtool: false,
		cache: true,
		target: 'web',
		node: {
			console: false,
			process: true,
			global: true,
			Buffer: true,
			setImmediate: true,
			__filename: 'mock',
			__dirname: 'mock'
		},
		performance: {
			maxAssetSize: 250000,
			maxEntrypointSize: 250000,
			hints: false
		},
		resolve: {
			unsafeCache: true,
			modules: ['node_modules'],
			extensions: ['.js', '.json'],
			aliasFields: ['browser'],
			mainFields: ['browser', 'module', 'main']
		},
		resolveLoader: {
			unsafeCache: true,
			mainFields: ['loader', 'main'],
			extensions: ['.js', '.json']
		}
  }
}
```


```javascript
// assets
[{
  name: '0.bundle.js',
  size: 299109,
  chunks: [0, 3],
  chunkNames: [],
  emitted: undefined,
  isOverSizeLimit: undefined
}]
// chunks
[{
  id: 0, //chunk id
  rendered: true,
  initial: false, //require.ensure产生，非initial
  entry: false, //非入口文件
  recorded: undefined,
  extraAsync: false,
  size: 296855, //chunk大小，比特
  names: [], //require.ensure不是通过webpack配置的，所以chunk的names是空
  files: ['0.bundle.js'], //该chunk产生的文件
  hash: '42fbfbea594ba593e76a', //chunk的hash
  parents: [2], //父级chunk
  origins: [
    [Object]
  ]
}]
// module
{
	id: 10,
	identifier: 'C:\\Users\\Administrator\\Desktop\\webpack-chunkfilename\\node_
	odules\\ html - loader\\ index.js!C: \\Users\\ Administrator\\ Desktop\\ webpack - chunkf
	lename\\ src\\ Components\\ Header.html ',
	name: './src/Components/Header.html', //模块名称，已经转化为相对于根目录的路径
	index: 10,
	index2: 8,
	size: 62,
	cacheable: true, //缓存
	built: true,
	optional: false,
	prefetched: false,
	chunks: [0], //在那个chunk中出现
	assets: [],
	issuer: 'C:\\Users\\Administrator\\Desktop\\webpack-chunkfilename\\node_modues\\ eslint - loader\\ index.js!C: \\Users\\ Administrator\\ Desktop\\ webpack - chunkfilname\\ src\\ Components\\ Header.js ',//是谁开始本模块的调用的，即模块调用发起者
	issuerId: 1, //发起者id
	issuerName: './src/Components/Header.js', //发起者相对于根目录的路径
	profile: undefined,
	failed: false,
	errors: 0,
	warnings: 0,
	reasons: [
		[Object]
	],
	usedExports: ['default'],
	providedExports: null,
	depth: 2,
	source: 'module.exports = "<header class=\\"header\\">{{text}}</header>";'
}
```

## Tapable是webpack的核心工具，提供插件接口

1. 使用：扩展Tapable对象，提供的钩子及钩子的类型；
2. 使用钩子hooks 和 tap，插件可以以多种不同的方式运行；
3. compiler hooks记录了 Tapable内在的钩子，指出哪些tap方法可用。
4. 自定义钩子函数：tapable 中

  - SyncHook, SyncBailHook, SyncWaterfallHook 同步串行
  - SyncLoopHook 同步循环
  - AsyncParallelHook, AsyncParallelBailHook 异步并发
  - AsyncSeriesHook, AsyncSeriesBailHook, AsyncSeriesWaterfallHook 异步串行
  [https://juejin.im/post/5abf33f16fb9a028e46ec352]

5. 使用：

```javascript
const SyncHook = require('tapable').SyncHook;
let queue = new SyncHook(['name']); // 构造函数接收一个可选参数字符串数组
// 订阅，将回调函数添加到this.hooks队列
queue.tap('1', callback(param)) // 1,用来标识订阅的函数
queue.tap('2', callback)
// 循环调用钩子
queue.call('webpack','') // 发布的时候，触发订阅的函数，同时传入参数

// 具有 `apply` 方法……
if (compiler.hooks.myCustomHook) throw new Error('Already in use');
compiler.hooks.myCustomHook = new SyncHook(['a', 'b', 'c']);

// 在你想要触发钩子的位置/时机下调用……
compiler.hooks.myCustomHook.call(a, b, c);
```

## vscode 调试node

```json
{
  "type": "node",
  "request": "launch",
  "name": "nodemon",
  "runtimeExecutable": "nodemon", // 以什么命令运算，"npm"
  "args": ["${workspaceRoot}/bin/www"], // 启动目录
  "restart": true,
  "protocol": "inspector",    //调试协议：auto, legacy
  "address": "", // 调试TCP/IP地址
  "stopOnEntry": "", // 程序启动时立即中断
  "localRoot": "", // vscode的根目录
  "remoteRoot": "", // node根目录
  "sourceMaps": true,
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen",
  "runtimeArgs": [    //对应nodemon --inspect之后除了启动文件之外的其他配置
    "--exec",
    "babel-node",
    "--presets",
    "env"
  ],
  "cwd": "${workspaceFolder}", // 程序启动目录
  "runtimeArgs": ["run-script", "start"], // 参数
  "program": "${workspaceFolder}/build/webpack.config.babel.js",
  "port": 9229,
  "timeout": 60000,
  "restart": true,
  "processId": "${command:PickProcess}",
  "sourceMaps": true
}
```

## webpack 处理的内容包含

- 入口：构建依赖图的开始，找出相应依赖的模块与library；单入口、多入口、公共文件
- 出口：使用了CDN 和 资源hash，path中包含[hash]，publicPath为CDN路径，不知publicPath时可以空白，运行时动态设置
- loader：对文件转换成有效模块，添加到依赖图中---module.rules{test, use/loader}
- plugin：
- 模式：webpack --mode=development 将 process.env.NODE_ENV设置为该值
- 浏览器兼容性web, node 构建与布署的区别？
- 目标：可自定义
- devtool
- context 绝对路径
- serve：webpack-server提供选项
- stats：精确控制要显示的bundle信息
- devServer
- 管理所有模块的交互：runtime(连接模块所需的加载和解析逻辑、包含已加载模块的连接、懒加载模块的执行逻辑) 和 manifest(src--->编译、解析、映射的详细工点--->manifest)打包完发送到浏览器，运行时通过manifest来解析和加载模块。通过bundle计算出内容散列，如果内容发生修改会通过新的散列指向新的文件，但内容不变时哈希还是改变了，runtime和mainifest的每次注入构建都会发生变化。故提取manifest来实现长效缓存。Webpack-Manifest-Plugin插件来查看该文件
- resolve 方便模块解析
- performance：性能，{hints：“warning”提示, maxAssetSize文件大小, assetFilter 文件类型断言}
- externals: ["react", /^@angular\//], 可自定义：即不遵循/打包这些模块，而是运行时从环境中请求。从输出的bundle中排除依赖的方法，即排除的不再打包到bundle中。
- optimization：优化
  - chunks: 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
  - minSize: 表示在压缩前的最小模块大小，默认为0；
  - minChunks: 表示被引用次数，默认为1；
  - maxAsyncRequests: 最大的按需(异步)加载次数，默认为1；
  - maxInitialRequests: 最大的初始化加载次数，默认为1；
  - name: 拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成；
  - cacheGroups: 缓存组。name、chunks、minSize、minChunks、maxAsyncRequests、maxInitialRequests ...
  - priority: 表示缓存的优先级；
  - test: 缓存组的规则，表示符合条件的的放入当前缓存组，值可以是function、boolean、string、RegExp，默认为空；
  - reuseExistingChunk: 表示可以使用已经存在的块，即如果满足条件的块已经存在就使用已有的，不再创建一个新的块。

- commonsChunkPlugin 从应用程序bundle中提取vender引用到 vender bundle，把引用vendor部分替换为__webpack__require()调用

- typescript配置，可以写成webpack.config.ts；但必须安装typescript 与 ts-node @types/node @types/webpack；tsconfig.json 安装tsconfig-paths即可配置tsconfig-for-webpack-config.json文件 ***


## 实用例子讲解

```javascript
// compilation 获取publicPath 1. 根据hast 及mainTemplate.getPublicPath()方法来获取, 即配置了publicPath的情况; 2. options.output.path + self.childCompilationOutputName(文件名)
 var webpackStatsJson = compilation.getStats().toJson();
  var publicPath = typeof compilation.options.output.publicPath !== 'undefined'
    ? compilation.mainTemplate.getPublicPath({hash: webpackStatsJson.hash})
    : path.relative(path.resolve(compilation.options.output.path, path.dirname(self.childCompilationOutputName))
      ,compilation.options.output.path
      )
      .split(path.sep).join('/');
    if (publicPath.length && publicPath.substr(-1, 1) !== '/') {
      publicPath += '/';
    }
// 子compiler中的错误信息：childCompilation
if (childCompilation && childCompilation.errors && childCompilation.errors.length) {
  var errorDetails = childCompilation.errors.map(function (error) {
    return error.message + (error.error ? ':\n' + error.error : '');
  }).join('\n');
  reject(new Error('Child compilation failed:\n' + errorDetails));
}
// 开启的child compiler如何对文件的hash进行替换，得到最终文件名
var outputName = compilation.mainTemplate.applyPluginsWaterfall('asset-path', outputOptions.filename, {
  hash: childCompilation.hash,
  chunk: entries[0]
});
// 如何加载本地文件系统，然后开启一个新的child compiler ???
HtmlWebpackPlugin.prototype.getFullTemplatePath = function (template, context) {
  if (template.indexOf('!') === -1) {
    template = require.resolve('./lib/loader.js') + '!' + path.resolve(context, template);
  }
  return template.replace(
    /([!])([^/\\][^!?]+|[^/\\!?])($|\?[^!?\n]+$)/,
    function (match, prefix, filepath, postfix) {
      return prefix + path.resolve(filepath) + postfix;
    });
};
childCompiler.apply(
  new NodeTemplatePlugin(outputOptions),
  new NodeTargetPlugin(),
  new LibraryTemplatePlugin('HTML_WEBPACK_PLUGIN_RESULT', 'var'),
  new SingleEntryPlugin(this.context, template),
  new LoaderTargetPlugin('node')
);
```

```javascript
//该chunk要被选中的条件是：有名称，不是懒加载，在includedChunks中但是不在excludedChunks中
HtmlWebpackPlugin.prototype.filterChunks = function (chunks, includedChunks, excludedChunks) {
  return chunks.filter(function (chunk) {
    var chunkName = chunk.names[0];
    //通过require.ensure产生的chunk不会被保留，names是一个数组
    if (chunkName === undefined) {
      return false;
    }
    //如果是require.ensure产生的chunk直接忽略
    if (!chunk.initial) {
      return false;
    }
    //这个chunk必须在includedchunks里面
    if (Array.isArray(includedChunks) && includedChunks.indexOf(chunkName) === -1) {
      return false;
    }
    //这个chunk不能在excludedChunks中
    if (Array.isArray(excludedChunks) && excludedChunks.indexOf(chunkName) !== -1) {
      return false;
    }
    return true;
  });
};
```

```javascript
// 通过id对chunks进行排序
/**
 * Sorts the chunks based on the chunk id.
 *
 * @param  {Array} chunks the list of chunks to sort
 * @return {Array} The sorted list of chunks
 * entry chunk在前，两个都是entry那么id大的在前
 */
module.exports.id = function (chunks) {
  return chunks.sort(function orderEntryLast (a, b) {
    if (a.entry !== b.entry) {
      return b.entry ? 1 : -1;
    } else {
      return b.id - a.id;
    }
  });
};
```

```javascript
// 通过chunk.parents(全部是parentId数组)来获取拓排序
/*
  因为最上面的通过commonchunkplugin产生的chunk具有webpack的runtime，所以排列在前面
*/
module.exports.dependency = function (chunks) {
  if (!chunks) {
    return chunks;
  }
  // 通过chunk-id -> chunk这种Map结构更加容易绘制图
  var nodeMap = {};
  chunks.forEach(function (chunk) {
    nodeMap[chunk.id] = chunk;
  });
  var edges = [];
  chunks.forEach(function (chunk) {
    if (chunk.parents) {
      chunk.parents.forEach(function (parentId) {
        var parentChunk = _.isObject(parentId) ? parentId : nodeMap[parentId];
        if (parentChunk) {
          edges.push([parentChunk, chunk]);
        }
      });
    }
  });
  return toposort.array(chunks, edges);
};
```

```javascript
// 有stats.assets.emitted属性，表示资源发生了变化
compiler.plugin("done", function(stats) {
  this._sendStats(this.sockets, stats.toJson(clientStats));
  this._stats = stats;
}.bind(this));
Server.prototype._sendStats = function(sockets, stats, force) {
  if(!force && stats && (!stats.errors || stats.errors.length === 0) && stats.assets && stats.assets.every(function(asset) {
      return !asset.emitted;
    })
  ){
    return this.sockWrite(sockets, "still-ok");
  }
  this.sockWrite(sockets, "hash", stats.hash);
  if(stats.errors.length > 0){
    this.sockWrite(sockets, "errors", stats.errors);
  }else if(stats.warnings.length > 0){
    this.sockWrite(sockets, "warnings", stats.warnings);
  }else{
    this.sockWrite(sockets, "ok");
  }
}
```

```javascript
var assets = {
  publicPath: publicPath,
  chunks: {},
  js: [],
  css: [],
  //这里是application cache文件，这里不是文件内容是文件的名称。key就是文件名称
  manifest: Object.keys(compilation.assets).filter(function (assetFile) {
    return path.extname(assetFile) === '.appcache';
  })[0]
};
// css文件
var chunkFiles = [].concat(chunk.files).map(function (chunkFile) {
  return publicPath + chunkFile;
});
var css = chunkFiles.filter(function (chunkFile) {
  return /.css($|\?)/.test(chunkFile);
});
//存在hash时
var webpackStatsJson = compilation.getStats().toJson();
if (this.options.hash) {
  assets.manifest = self.appendHash(assets.manifest, webpackStatsJson.hash);
  assets.favicon = self.appendHash(assets.favicon, webpackStatsJson.hash);
}
HtmlWebpackPlugin.prototype.appendHash = function (url, hash) {
  if (!url) {
    return url;
  }
  return url + (url.indexOf('?') === -1 ? '?' : '&') + hash;
};
```

```javascript
HtmlWebpackPlugin.prototype.htmlWebpackPluginAssets = function (compilation, chunks) {
  var self = this;
  var webpackStatsJson = compilation.getStats().toJson();
  // publicPath
  var publicPath = typeof compilation.options.output.publicPath !== 'undefined'
    ? compilation.mainTemplate.getPublicPath({hash: webpackStatsJson.hash})
    : path.relative(path.resolve(compilation.options.output.path, path.dirname(self.childCompilationOutputName)),
                    compilation.options.output.path)
      .split(path.sep).join('/');
    if (publicPath.length && publicPath.substr(-1, 1) !== '/') {
      publicPath += '/';
    }
  // 定义assets
  var assets = {
    publicPath: publicPath,
    chunks: {},
    js: [],
    css: [],
    manifest: Object.keys(compilation.assets).filter(function (assetFile) {
      return path.extname(assetFile) === '.appcache';
    })[0]
  };

  // 缓存清除
  if (this.options.hash) {
    assets.manifest = self.appendHash(assets.manifest, webpackStatsJson.hash);
    assets.favicon = self.appendHash(assets.favicon, webpackStatsJson.hash);
  }
  for (var i = 0; i < chunks.length; i++) {
    var chunk = chunks[i];
    var chunkName = chunk.names[0];
    assets.chunks[chunkName] = {};
    var chunkFiles = [].concat(chunk.files).map(function (chunkFile) {
      return publicPath + chunkFile;
    });

    // Append a hash for cache busting
    //为每一个文件加上了publicPath同时还要加上hash
    if (this.options.hash) {
      chunkFiles = chunkFiles.map(function (chunkFile) {
        return self.appendHash(chunkFile, webpackStatsJson.hash);
      });
    }

    //chunk.files[0]就是该chunk产生的入口文件
    var entry = chunkFiles[0];
    assets.chunks[chunkName].size = chunk.size;
    assets.chunks[chunkName].entry = entry;
    assets.chunks[chunkName].hash = chunk.hash;
    assets.js.push(entry);
    //为每一个该chunk产生的文件都在上面的assets对象上添加一个对象，key是chunkName
    //value为一个对象{chunkName:{size:100,entry:'/qlin/',hash:'chunk的hash'}}
    // Gather all css files
    var css = chunkFiles.filter(function (chunkFile) {
      return /.css($|\?)/.test(chunkFile);
    });
    assets.chunks[chunkName].css = css;
    assets.css = assets.css.concat(css);
  }

  assets.css = _.uniq(assets.css);
  //如果多个chunk使用了同一个css那么会产生重复的css
  return assets;
};
```
上面的这个例子展示了如何如何为输出的资源做这些处理：添加publicPath以便html能够正常访问;为资源的文件名，即URL中添加编译的hash值。同时你要注意：
```javascript
  var entry = chunkFiles[0];
    assets.chunks[chunkName].size = chunk.size;
    assets.chunks[chunkName].entry = entry;
    assets.chunks[chunkName].hash = chunk.hash;
    assets.js.push(entry);
```
之所以会如此处理是因为如果在webpack中配置了：

  devtool:'cheap-source-map',
那么每一个chunk产生的files就是一个数组，如下：

[ 'builds/vendor.bundle.js', 'builds/vendor.bundle.js.map' ]
[ 'builds/bundle.js', 'builds/bundle.js.map' ]
所以我们只会保存第一个js文件而已！

```javascript
// 如何判断是否要重新产生资源文件
if (self.isHotUpdateCompilation(assets)) {
  return callback();
}
  //如果template和assets资源没有发生变化，我们不会重新产生html
  var assetJson = JSON.stringify(self.getAssetFiles(assets));
  //注意：这里包括了js,css,.appcache文件以及publicPath路径
  //isCompilationCached = compilationResult.hash && self.childCompilerHash === compilationResult.hash;
  //如果上次child compiler产生的hash和本次产生的hash(本次再次编译了一遍html)一致表示html没有变化
  //同时配置指定了可以读取html缓存，而且资源本身也没有发生变化，直接返回
  if (isCompilationCached && self.options.cache && assetJson === self.assetJson) {
    return callback();
  } else {
    self.assetJson = assetJson;
  }

// 所以热更新的js资源
HtmlWebpackPlugin.prototype.isHotUpdateCompilation = function (assets) {
  return assets.js.length && assets.js.every(function (name) {
    return /\.hot-update\.js$/.test(name);
  });
};

// 非chunks资源文件
HtmlWebpackPlugin.prototype.getAssetFiles = function (assets) {
  var files = _.uniq(Object.keys(assets).filter(function (assetType) {
    return assetType !== 'chunks' && assets[assetType];
  }).reduce(function (files, assetType) {
    return files.concat(assets[assetType]);
  }, []));
  files.sort();
  return files;
};
```

```javascript
// 如何获取一次打包依赖的所有的文件并在所有文件中添加一个自己的文件
HtmlWebpackPlugin.prototype.addFileToAssets = function (filename, compilation) {
  filename = path.resolve(compilation.compiler.context, filename);
  return Promise.props({
    size: fs.statAsync(filename),
    source: fs.readFileAsync(filename)
  })
  .catch(function () {
    return Promise.reject(new Error('HtmlWebpackPlugin: could not load file ' + filename));
  })
  .then(function (results) {
    var basename = path.basename(filename);
    // 收集文件依赖
    compilation.fileDependencies.push(filename);
    // 修改compilation
    compilation.assets[basename] = {
      source: function () {
        return results.source;
      },
      size: function () {
        return results.size.size;
      }
    };
    return basename;
  });
};
```

- loader的配置

```javascript
module: {
  // 关于模块配置
  rules: [
    // 模块规则（配置 loader、解析器等选项）
    {
      test: /\.jsx?$/,
      include: [
        path.resolve(__dirname, "app")
      ],
      exclude: [
        path.resolve(__dirname, "app/demo-files")
      ],
      // 这里是匹配条件，每个选项都接收一个正则表达式或字符串
      // test 和 include 具有相同的作用，都是必须匹配选项
      // exclude 是必不匹配选项（优先于 test 和 include）
      // 最佳实践：
      // - 只在 test 和 文件名匹配 中使用正则表达式
      // - 在 include 和 exclude 中使用绝对路径数组
      // - 尽量避免 exclude，更倾向于使用 include
      issuer: { test, include, exclude },
      // issuer 条件（导入源）
      enforce: "pre",
      enforce: "post",
      // 标识应用这些规则，即使规则覆盖（高级选项）
      loader: "babel-loader",
      // 应该应用的 loader，它相对上下文解析
      // 为了更清晰，`-loader` 后缀在 webpack 2 中不再是可选的
      // 查看 webpack 1 升级指南。
      options: {
        presets: ["es2015"]
      },
      // loader 的可选项
    },
    {
      test: /\.html$/,
      use: [
        // 应用多个 loader 和选项
        "htmllint-loader",
        {
          loader: "html-loader",
          options: {
            /* ... */
          }
        }
      ]
    },
    { oneOf: [ /* rules */ ] },
    // 只使用这些嵌套规则之一
    { rules: [ /* rules */ ] },
    // 使用所有这些嵌套规则（合并可用条件）
    { resource: { and: [ /* 条件 */ ] } },
    // 仅当所有条件都匹配时才匹配
    { resource: { or: [ /* 条件 */ ] } },
    { resource: [ /* 条件 */ ] },
    // 任意条件匹配时匹配（默认为数组）
    { resource: { not: /* 条件 */ } }
    // 条件不匹配时匹配
  ],
}
```

## resolve的配置

```javascript
resolve: {
  // 解析模块请求的选项
  // （不适用于对 loader 解析）
  modules: [
    "node_modules",
    path.resolve(__dirname, "app")
  ],
  // 用于查找模块的目录
  extensions: [".js", ".json", ".jsx", ".css"],
  // 使用的扩展名
  alias: {
    // 模块别名列表
    "module": "new-module",
    // 起别名："module" -> "new-module" 和 "module/path/file" -> "new-module/path/file"
    "only-module$": "new-module",
    // 起别名 "only-module" -> "new-module"，但不匹配 "only-module/path/file" -> "new-module/path/file"
    "module": path.resolve(__dirname, "app/third/module.js"),
    // 起别名 "module" -> "./app/third/module.js" 和 "module/file" 会导致错误
    // 模块别名相对于当前上下文导入
  },
  /* 可供选择的别名语法（点击展示） */
  /* 高级解析选项（点击展示） */
},
```
## loader属性
this.context：当前处理文件的所在目录，假如当前 Loader 处理的文件是 /src/main.js，则 this.context 就等于 /src。
this.resource：当前处理文件的完整请求路径，包括 querystring，例如 /src/main.js?name=1。
this.resourcePath：当前处理文件的路径，例如 /src/main.js。
this.resourceQuery：当前处理文件的 querystring。
this.target：等于 Webpack 配置中的 Target。
this.loadModule：但 Loader 在处理一个文件时，如果依赖其它文件的处理结果才能得出当前文件的结果时， 就可以通过 this.loadModule(request: string, callback: function(err, source, sourceMap, module)) 去获得 request 对应文件的处理结果。
this.resolve：像 require 语句一样获得指定文件的完整路径，使用方法为 resolve(context: string, request: string, callback: function(err, result: string))。
this.addDependency：给当前处理文件添加其依赖的文件，以便再其依赖的文件发生变化时，会重新调用 Loader 处理该文件。使用方法为 addDependency(file: string)。
this.addContextDependency：和 addDependency 类似，但 addContextDependency 是把整个目录加入到当前正在处理文件的依赖中。使用方法为 addContextDependency(directory: string)。
this.clearDependencies：清除当前正在处理文件的所有依赖，使用方法为 clearDependencies()。
this.emitFile：输出一个文件，使用方法为 emitFile(name: string, content: Buffer|string, sourceMap: {...})。
