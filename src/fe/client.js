import react from 'react';
import reactDOM from 'react-dom';
import deepForceUpdate from 'react-deep-force-update';
import queryString from 'query-string';
import {createPath} from 'history/PathUtils';

// client端需要完成的任务
// 前后端路由为同一个文件，createFetch也为同一个文件
import App from '../controller/components/app';  // 定义组件的基础属性与方法
import createFetch from '../createFetch';
import history from './history';
import {updateMeta} from './DOMUtils';
import router from '../router'

const context = {
  insertCss: (...styles)=>{
    const removeCss = style.map(x=>x._insertCss());
    return ()=>{
      removeCss.forEach(f => f());
    }
  },
  fetch: createFetch(fetch, {
    baseUrl: window.App.apiUrl
  })
}

const container = document.getElementById('app');
let currentLocation = history.location;
let appInstance;

const scrollPositionHistory = {};

// 路由发生改变时的回调
async function onLocationChange(location, action){
  // 记录该页面的视窗位置, location与currentLocation的区别？
  scrollPositionHistory[currentLocation.key] = {
    scrollX: window.pageXOffset,
    scrollY: window.pageYOffset,
  }
  // 重新打开该页面，则删除其位置
  if(action === 'PUSH'){
    delete scrollPositionHistory[location.key];
  }
  currentLocation = location;
  const isInitialRender = !action;

  try{
    context.pathname = location.pathname;
    context.query = queryString.parse(location.search);
    // ???
    const route = await router.resolve(context);
    // ???
    if(currentLocation.key !== location.key){
      return;
    }
    // 重定向
    if(route.redirect){
      history.replace(route.redirect);
    }

    const renderReactApp = isInitialRender ? reactDOM.hydrate : reactDOM.render;
    // app 渲染到container内
    appInstance = renderReactApp(
      <App context={context}>{route.component}</App>,
      container,
      () => {
        if(isInitialRender){
          if(window.history && 'scrollRestoration' in window.history){
            window.history.scrollRestoration = 'manual';
          }
          // 清除样式
          const elem = document.getElementById('css');
          if(elem) elem.parentNode.removeChild(elem);
          // 添加meta标签
          updateMeta('description', route.description);

          let scrollX = 0;
          let scrollY = 0;
          const pos = scrollPositionHistory[location.key];
          if(pos){
            scrollX = pos.scrollX;
            scrollY = pos.scrollY;
          }else{
            const targetHash = location.hash.substr(1);
            if(targetHash){
              const target = document.getElementById(targetHash);
              if(target){
                scrollY = window.pageYOffset + target.getBoundingClientRect().top;
              }
            }
          }
          window.scrollTo(scrollX, scrollY);
        }
      }
    )
  }catch(error){
    if(__DEV__ ){
      throw error;
    }
    console.error(error);
    if(!isInitialRender && currentLocation.key === location.key){
      console.error('RSK will reload your page after error');
      window.location.reload();
    }
  }
}

history.listen(onLocationChange); // 启动监听
onLocationChange(currentLocation);

if(module.hot){

}
