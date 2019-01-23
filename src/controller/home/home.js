import react from 'react';
import propTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './home.less';

class Home extends react.Component{
  // static propTypes = {

  // }
  render(){
    return (
      <div>这是一个测试</div>
    )
  }
}

export default withStyles(s)(Home);
