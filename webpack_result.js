
// manifest.js
(function(modules) {
  // 根据moduleId, 将moreModules更新到modules
  window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules, executeModules) {
    var moduleId, result;
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        modules[moduleId] = moreModules[moduleId];
      }
    }
    //
    if (executeModules) {
      for (i = 0; i < executeModules.length; i++) {
        result = __webpack_require__(executeModules[i]);
      }
    }
    return result;
  };
  // 缓存容器
  var installedModules = {};

  function __webpack_require__(moduleId) {
    // 缓存中存在，则直接返回它的exports
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
      exports: {}
    };
    // 调用该module，参数与每个module的相对应
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    return module.exports;
  }
})([]);
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
webpackJsonp([1], {
  "JkW7":
    (function(module, exports, __webpack_require__) {
      const p = document.querySelector('.p');
      const btn = document.querySelector('.btn');

      btn.addEventListener('click', function() {
        __webpack_require__.e(0).then((function() {
          const data = __webpack_require__("zFrx");
          p.innerHTML = data;
        }).bind(null, __webpack_require__)).catch(__webpack_require__.oe)
      })
    })
}, ["JkW7"]);

// 已加载的chunk，key---moduleId, value---chunkId
var installedChunks = {
  2: 0
};
__webpack_require__.e = function requireEnsure(chunkId) {
  var installedChunkData = installedChunks[chunkId];
  if (installedChunkData === 0) {
    return new Promise(function(resolve) {
      resolve();
    });

  }
  if (installedChunkData) {
    return installedChunkData[2];
  }

  var promise = new Promise(function(resolve, reject) {
    installedChunkData = installedChunks[chunkId] = [resolve, reject];
  });
  installedChunkData[2] = promise;
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.src = "js/" + chunkId + "." + {
    "0": "7f0a",
    "1": "ad23"
  }[chunkId] + ".js";
  script.onerror = script.onload = onScriptComplete;

  function onScriptComplete() {
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


