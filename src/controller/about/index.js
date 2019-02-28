import react from 'react';
import About from './about';
// import Layout from '../components/layout';

async function action(){
  // 获取数据
  return {
    title: 'adult world',
    chunks: ['about'],
    component: (
      // <Layout>
        <About/>
      // </Layout>
    )
  }
}

export default action;
