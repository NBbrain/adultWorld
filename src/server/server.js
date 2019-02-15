import path from 'path';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import PrettyError from 'pretty-error';
import nodeFetch from 'node-fetch';
import react from 'react';
import reactDOM from 'react-dom/server';
import createFetch from '../createFetch';
import config from './config';
import passport from './passport';
import router from '../router'

process.on('onhandleRejection', (reason, p)=>{
  console.error('Unhandled Rejection at:', p, 'reason', reason);
  process.exit(1);
})

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

const app = express();
app.use(compression()) // 请求进行gzip压缩
//todo  set trust proxy

// 连接数据库

// 注: 使用--trace-sync-io命令标记，同步函数时会提出警告
// 日志: 通过管道传到另一个程序，提供DEBUG环境变量来进行console.err()
// try-catch, promise...catch(next)


// 静态资源路径
app.use(express.static(path.resolve(__dirname, 'public')));

// cookie
app.use(cookieParser())

// 请求体
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

// 验证指定http请求的JsonWebTokens的有效性
app.use(expressJwt({
  // secret:
  credentialsRequired: false,
  getToken: req=>req.cookies.id_token,
}));

// 统一错误处理
app.use((err, req, res, next)=>{
  if(err instanceof Jwt401Error){
    console.error('[express-jwt-error]', req.cookies.id_token);
    res.clearCookie('id_token');
  }
});

// 用户登录相关
// app.use(passport.initialize());
// app.use(passport.session());
// app.get('/login/facebook', passport.authenticate('facebook',{
//   scope: ['email', 'user_location'],
//   session: false,
// }),(req, res)=>{

// })

// 注册API中间件
// app.use('/graphql'...)

// 统一渲染处理

app.get('*', async(req, res, next)=>{
  try{
    const css = new Set();

    // css处理函数
    const insertCss = (...styles)=>{
      styles.forEach(style=>CSS.add(style._getCss()))
    }

    // todo 请求封装
    // const fetch = createFetch(nodeFetch, {});

    const context = {
      insertCss,
      pathname: req.path,
      query: req.query,
    }

    // 将参数传入controller的load 与 action方法
    const route = await router.resolve(context);

    const data = {...route};
    // context传入App中的作用？
    data.children = reactDOM.renderToString(
      <App context={context}>{route.component}</App>
    )
    // chunks的作用 ?
    const scripts = new Set();
    const addChunk = chunk => {
      if(chunks[chunk]){
        chunks[chunk].forEach(asset => scripts.add(asset));
      } else if (__DEV__) {
        throw new Error(`Chunk with name '${chunk}' cannot be found`);
      }
    }
    // 添加客户端渲染？收集script?
    addChunk('client');
    if(route.chunk) addChunk(route.chunk);
    if(route.chunks) route.chunks.forEach(addChunk);
    data.scripts = Array.from(scripts);

    data.app = {
      apiUrl: config.api.clientUrl
    }
    // 渲染整个页面HTML{styles, children, scripts}
    const html = reactDOM.renderToStaticMarkup(<Html {...data}/>);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  }catch(err){
    next(err);
  }
});

const pe = new PrettyError();

pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
const promise = models.sync().catch(err => console.error(err.stack));
if (!module.hot) {
  promise.then(() => {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
