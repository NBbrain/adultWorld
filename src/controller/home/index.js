import react from 'react';
import Home from './home';
// import Layout from '../components/layout';

async function action(){
  // 获取数据
  return {
    title: 'adult world',
    chunks: ['home'],
    component: (
      // <Layout>
        <Home/>
      // </Layout>
    )
  }
}
