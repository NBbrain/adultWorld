import react from 'react';
import propTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { hot } from 'react-hot-loader/root';
import s from './about.less';

class Home extends react.Component{
  // static propTypes = {

  // }
  render(){
    return (
      <div>这是about</div>
    )
  }
}
if(__isClient__){
  Home = hot(Home);
}

export default withStyles(s)(Home);
