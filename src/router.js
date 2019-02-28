import UniversalRouter from 'universal-router'



// 定义路由并设置统一的动作，添加title与description
const routes = [{
  path: '',
  children: [
    {
      path: '/',
      action: () => {
        if (__isClient__) {
          return import(/* webpackChunkName: 'home' */ './controller/home')
        } else {
          return require('./controller/home')
        }
      }
    },
    {
      path: '/about',
      action: () => {
        if (__isClient__) {
          return import(/* webpackChunkName: 'about' */ './controller/about')
        } else {
          return require('./controller/about')
        }
      }
    }
  ],
  async action({next}){
    const route = await next();
    route.title = `${route.title || 'Untitled page'} - www.host.com`;
    route.description = route.description || '';
  }
}]

//
export default new UniversalRouter(routes, {
  resolveRoute(context, params){
    // 路由匹配成功，则执行routes中的load方法，
    // 成功后执行controller中的action方法
    if(typeof context.route.load === 'function'){
      return context.route.load().then(action=>action.default(context, params));
    }
    // 再执行匹配到的路由中的action
    if(typeof context.route.action === 'function'){
      return context.route.action(context, params);
    }
    return undefined;
  }
})
