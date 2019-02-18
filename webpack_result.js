
// manifest.js
(function(modules) {
  window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
    var moduleId, result;
    // 将moreModules更新到modules
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        modules[moduleId] = moreModules[moduleId];
      }
    }
    // 执行模块存在，则加载
    if (executeModules) {
      for (i = 0; i < executeModules.length; i++) {
        result = __webpack_require__(executeModules[i]);
      }
    }
    return result;
  };
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
    // 执行当前模块
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    return module.exports;
  }
})([])
// 单个chunk，([chunkId], {modules}, [moduleIds?]
webpackJsonp([0], {
  "JkW7": (function(module, exports, __webpack_require__) {
    const test = __webpack_require__("zFrx");
    console.log(test);
  }),
  "zFrx": (function(module, exports) {
    const str = 'test is loaded';
    module.exports = str;
  })
}, ["JkW7"]);

// 按需加载
// index.js
webpackJsonp([0], {
  "JkW7":
    (function(module, exports, __webpack_require__) {
      const p = document.querySelector('.p');
      const btn = document.querySelector('.btn');

      btn.addEventListener('click', function() {
        __webpack_require__.e(0).then((function() {
          // resolve里，加载相应的模块
          const data = __webpack_require__("zFrx");
          p.innerHTML = data;
        }).bind(null, __webpack_require__)).catch(__webpack_require__.oe)
      })
    })
}, ["JkW7"]);

// 已加载的chunk
var installedChunks = {
  2: 0
};
__webpack_require__.e = function requireEnsure(chunkId) {
  var installedChunkData = installedChunks[chunkId];
  // installedChunkData = [resolve, reject, promise] 根据chunkId，如果是未加载的，则进行resolve
  if (installedChunkData === 0) {
    return new Promise(function(resolve) {
      resolve();
    });

  }
  // 多次请求，返回同一个promise
  if (installedChunkData) {
    return installedChunkData[2];
  }
  var promise = new Promise(function(resolve, reject) {
    installedChunkData = installedChunks[chunkId] = [resolve, reject];
  });
  installedChunkData[2] = promise;
  // 把script添加到页面
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.src = "js/" + chunkId + "." + {
    "0": "7f0a",
    "1": "ad23"
  }[chunkId] + ".js";
  script.onerror = script.onload = onScriptComplete;

  function onScriptComplete() {
    // js文件下载成功后，先执行内容，再执行onload方法
    script.onerror = script.onload = null;
    var chunk = installedChunks[chunkId];
    if (chunk !== 0) {
      if (chunk) {
        chunk[1](new Error('Loading chunk ' + chunkId + ' failed.'));
      }
      installedChunks[chunkId] = undefined;
    }
  };
  head.appendChild(script);
  return promise;
};

// 缓存失效，entry 与 commonsChunkPlugin
