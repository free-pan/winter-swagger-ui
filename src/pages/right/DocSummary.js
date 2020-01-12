import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DocSummary extends Component {
  constructor(props) {
    super(props);

  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show
  }

  render() {
    console.log('DocSummary')
    return (
      <div>

      </div>
    );
  }
}

DocSummary.propTypes = {
  show: PropTypes.bool.isRequired
}

export default DocSummary;
