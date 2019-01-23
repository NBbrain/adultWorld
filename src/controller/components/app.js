import react from 'react';
import propTypes from 'prop-types';

const contextType = {
  insertCss: propTypes.func.isRequired,
  fetch: propTypes.func.isRequired,
  pathname: propTypes.string.isRequired,
  query: propTypes.object
}

class App extends react.PureComponent {
  static propTypes = {
    context: propTypes.shape(contextType).isRequired,
    children: propTypes.element.isRequired,
  };
  static childContextTypes = contextType;

  getChildContext(){
    return this.props.context;
  }
  // 渲染其中的一个子组件
  render(){
    return react.children.only(this.props.children);
  }
}
export default App;
