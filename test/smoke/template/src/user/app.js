import React from 'react';

class App extends React.Component {
  render() {
    return (<div className={'user'}>{this.props.context}</div>);
  }
}

export default App;
