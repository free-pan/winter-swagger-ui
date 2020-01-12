import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GlobalHeader extends Component {
  constructor(props) {
    super(props);

  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show
  }

  render() {
    console.log('GlobalHeader')
    const { globalHeaderArr } = this.props
    return (
      <div>

      </div>
    );
  }
}

GlobalHeader.propTypes = {
  globalHeaderArr: PropTypes.array.isRequired,
  show: PropTypes.bool.isRequired,
  globalHeaderCount: PropTypes.number.isRequired
}

export default GlobalHeader;
