import React from 'react';
import { Tag, Button } from 'antd';

import Truncate from './Truncate';

import './App.css';

class App extends React.Component {
  state = {
    truncate: false,
    expand: false
  };
  toggleTruncate = () => {
    this.setState(state => ({
      expand: !state.expand
    }));
  }
  onTruncate = (isTruncated) => {
    this.setState({
      truncate: isTruncated,
      expand: false
    });
  }
  render() {
    return (
      <div>
        <Truncate
          truncate={!this.state.expand}
          countLines="4"
          onResult={this.onTruncate}>
          Lorem <Tag type='red'>ipsum</Tag>dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, <Tag type='red'>sunt in culpa qui officia</Tag> deserunt mollit anim id est laborum.
        </Truncate>
        {
          this.state.truncate && (
            <Button onClick={this.toggleTruncate}>Show/hide</Button>  
          )
        }
      </div>
    );
  }
}

export default App;
