import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AboutAuthor extends Component {
  constructor(props) {
    super(props);

  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show
  }

  render() {
    return (
      <div>

      </div>
    );
  }
}

AboutAuthor.propTypes = {
  show: PropTypes.bool.isRequired
}

export default AboutAuthor;
