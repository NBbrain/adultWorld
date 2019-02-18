// 没有依赖模块
(function(modules) {
  //  缓存已经加载过的module的exports
  //  module在exports之前还是有js需要执行的，缓存的目的就是优化这一过程
  // The module cache
  var installedModules = {};

  function __webpack_require__(moduleId) {
  if (installedModules[moduleId]) {
    return installedModules[moduleId].exports;
  }
  var module = installedModules[moduleId] = {
    i: moduleId,
    l: false,
    exports: {}
  };
  // 执行单个module JS Function并填充installedModules与module
  modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  module.l = true;
  return module.exports;
  }
  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;
  // expose the module cache
  __webpack_require__.c = installedModules;...
  // __webpack_public_path__
  __webpack_require__.p = "";
  // 加载Entry并返回Entry的exports
  return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
// modules其实就是一个对象，键是模块的路径，值就是模块的JS Function
({
  "./src/index.js": function(module, __webpack_exports__, __webpack_require__) {
  "use strict";
  eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _module_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module.js */ \"./src/module.js\");\n/* harmony import */ var _module_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_module_js__WEBPACK_IMPORTED_MODULE_0__);\n{};\nconsole.log(_module_js__WEBPACK_IMPORTED_MODULE_0___default.a.s);\n\n//# sourceURL=webpack:///./src/index.js?");
  },
  "./src/module.js": function(module, exports) {
  eval("{};var s = 123;\nconsole.log(s);\nmodule.exports = {\n  s: s\n};\n\n//# sourceURL=webpack:///./src/module.js?");
  }
});

//当配置了splitChunk之后，此时IIFE的形参modules就成了摆设，
// 真正的module还有chunk都被存放在了一个挂载在window上的全局数组`webpackJsonp`上了
(function(modules) {
  function webpackJsonpCallback(data) {
    // chunk的名称，如果是entry chunk也就是我们entry的key
    var chunkIds = data[0];
    var moreModules = data[1];
    var executeModules = data[2];

    var moduleId, chunkId, i = 0,
      resolves = [];
    // installedChunks[chunkId], resolves存储加载了的chunk
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (installedChunks[chunkId]) {
        resolves.push(installedChunks[chunkId][0]);
      }
      installedChunks[chunkId] = 0;
    }
    // module
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
      modules[moduleId] = moreModules[moduleId];
      }
    }
    if (parentJsonpFunction) parentJsonpFunction(data);
    // 取resolves第一个，并执行
    while (resolves.length) {
      resolves.shift()();
    }
    // add entry modules from loaded chunk to deferred list
    deferredModules.push.apply(deferredModules, executeModules || []);
    // run deferred modules when all chunks ready
    return checkDeferredModules();
  };

  function checkDeferredModules() {
    var result;
    for (var i = 0; i < deferredModules.length; i++) {
      var deferredModule = deferredModules[i];
      var fulfilled = true;
      for (var j = 1; j < deferredModule.length; j++) {
        var depId = deferredModule[j];
        if (installedChunks[depId] !== 0) fulfilled = false;
      }
      if (fulfilled) {
        deferredModules.splice(i--, 1);
        result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
      }
    }
    return result;
  }
  // The module cache
  var installedModules = {};
  // object to store loaded CSS chunks
  var installedCssChunks = {
    "app": 0
  }
  // object to store loaded and loading chunks
  // undefined = chunk not loaded, null = chunk preloaded/prefetched
  // Promise = chunk loading, 0 = chunk loaded
  var installedChunks = {
    "app": 0
  };
  var deferredModules = [];
  // script path function

  function jsonpScriptSrc(chunkId) {
    return __webpack_require__.p + "static/js/" + ({
      "About-vue-0": "About-vue-0",
      "Aboutus-vue-1": "Aboutus-vue-1",
    }[chunkId] || chunkId) + "." + {
      "About-vue-0": "8568b63a",
      "Aboutus-vue-1": "fd9595cb",
    }[chunkId] + ".js"
  }
  // The require function

  function __webpack_require__(moduleId) {
    // 加载模块
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };
    // 执行模块
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    // 标记已加载
    module.l = true;
    // Return the exports of the module
    return module.exports;
  }
  // 异步加载模块
  __webpack_require__.e = function requireEnsure(chunkId) {
    var promises = [];
    // mini-css-extract-plugin CSS loading
    var cssChunks = {
      "About-vue-0": 1,
      "Aboutus-vue-1": 1,
    };
    // 异步加载css chunk
    if (installedCssChunks[chunkId]) promises.push(installedCssChunks[chunkId]);
    else if (installedCssChunks[chunkId] !== 0 && cssChunks[chunkId]) {
      promises.push(installedCssChunks[chunkId] = new Promise(function(resolve, reject) {
        var href = "static/css/" + ({
          "About-vue-0": "About-vue-0",
          "Aboutus-vue-1": "Aboutus-vue-1",
        }[chunkId] || chunkId) + "." + {
          "About-vue-0": "99c94237",
          "Aboutus-vue-1": "0c283982",
        }[chunkId] + ".css";
        var fullhref = __webpack_require__.p + href;
        var existingLinkTags = document.getElementsByTagName("link");
        for (var i = 0; i < existingLinkTags.length; i++) {
          var tag = existingLinkTags[i];
          var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
          if (tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return resolve();
        }
        var existingStyleTags = document.getElementsByTagName("style");
        for (var i = 0; i < existingStyleTags.length; i++) {
          var tag = existingStyleTags[i];
          var dataHref = tag.getAttribute("data-href");
          if (dataHref === href || dataHref === fullhref) return resolve();
        }
        var linkTag = document.createElement("link");
        linkTag.rel = "stylesheet";
        linkTag.type = "text/css";
        linkTag.onload = resolve;
        linkTag.onerror = function(event) {
          var request = event && event.target && event.target.src || fullhref;
          var err = new Error("Loading CSS chunk " + chunkId + " failed.\n(" + request + ")");
          err.request = request;
          delete installedCssChunks[chunkId]
          linkTag.parentNode.removeChild(linkTag)
          reject(err);
        };
        linkTag.href = fullhref;
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(linkTag);
      }).then(function() {
        installedCssChunks[chunkId] = 0;
      }));
    }
    // JSONP chunk loading for javascript
    var installedChunkData = installedChunks[chunkId];
      if (installedChunkData !== 0) { // 0 means "already installed".
        // a Promise means "currently loading".
        if (installedChunkData) {
          promises.push(installedChunkData[2]);
        } else {
          // setup Promise in chunk cache
          var promise = new Promise(function(resolve, reject) {
            installedChunkData = installedChunks[chunkId] = [resolve, reject];
          });
          promises.push(installedChunkData[2] = promise);
          // start chunk loading
          var script = document.createElement('script');
          var onScriptComplete;
          script.charset = 'utf-8';
          script.timeout = 120;
          if (__webpack_require__.nc) {
            script.setAttribute("nonce", __webpack_require__.nc);
          }
          script.src = jsonpScriptSrc(chunkId);
          onScriptComplete = function(event) {
            // avoid mem leaks in IE.
            script.onerror = script.onload = null;
            clearTimeout(timeout);
            var chunk = installedChunks[chunkId];
            if (chunk !== 0) {
              if (chunk) {
                var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                var realSrc = event && event.target && event.target.src;
                var error = new Error('Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')');
                error.type = errorType;
                error.request = realSrc;
                chunk[1](error);
              }
              installedChunks[chunkId] = undefined;
            }
          };
          var timeout = setTimeout(function() {
            onScriptComplete({
            type: 'timeout',
            target: script
            });
          }, 120000);
          script.onerror = script.onload = onScriptComplete;
          document.head.appendChild(script);
        }
      }
      return Promise.all(promises);
  };
  // 抛出 modules
  __webpack_require__.m = modules;
  // 抛出 已加载的modules缓存
  __webpack_require__.c = installedModules;
  // define getter function for harmony exports
  __webpack_require__.d = function(exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, {
      enumerable: true,
      get: getter
      });
    }
  };
  // 支持es6 的 export
  __webpack_require__.r = function(exports) {
  if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {
    value: 'Module'
    });
  }
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  };
  // create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
  __webpack_require__.t = function(value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', {
      enumerable: true,
      value: value
    });
    if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function(key) {
      return value[key];
    }.bind(null, key));
    return ns;
  };
  // 获取默认模块或特定模块
  __webpack_require__.n = function(module) {
    var getter = module && module.__esModule ?
    function getDefault() {
      return module['default'];
    } : function getModuleExports() {
      return module;
    };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };
  // Object.prototype.hasOwnProperty.call
  __webpack_require__.o = function(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
  };
  // __webpack_public_path__
  __webpack_require__.p = "https://img1.haoshiqi.net/";
  // 异步加载错误处理
  __webpack_require__.oe = function(err) {
    console.error(err);
    throw err;
  };
  // 加载模块的数组容器 webpackJsonp，加载所有模块
  var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
  jsonpArray.push = webpackJsonpCallback;
  jsonpArray = jsonpArray.slice();
  for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
  var parentJsonpFunction = oldJsonpFunction;
  // add entry module to deferred list
  deferredModules.push([0, "chunk-vendors"]); // run deferred modules when ready
  return checkDeferredModules();
})
// 文件依赖的模块
({
  0: (function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__("56d7");
  }),
  "0141": (function(module, exports, __webpack_require__) {
    // extracted by mini-css-extract-plugin
  }),
  "0257": (function(module, exports, __webpack_require__) {
    module.exports = __webpack_require__.p + "static/img/rule-icon.e19f270b.png";
  })
}]
//@file: dist/chunk-vendors.js  通过push[path, {module}] 传入
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["chunk-vendors"],
  {
  "00fd": (function(module, exports, __webpack_require__) {
    var Symbol = __webpack_require__("9e69");
    // 函数体
    module.exports = getRawTag;
  }),
  ...
  }
])
// 异步解决方案
module.exports = async
function(content) {
  function timeout(delay) {
    return new Promise((resolve, reject) = > {
    setTimeout(() = > {
      resolve("{};" + content)
    }, delay)
    })
  }
  const data = await timeout(1000)
  return data
}
