import React, {PropTypes} from 'react';
import SonopodosWidget from '../components/SonopodosWidget';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Immutable from 'immutable';
import * as sonopodosActionCreators from '../actions/sonopodosActionCreators';
import { routerActions } from 'react-router-redux'


// pick out the part of the state tree which this component (+children) is interested in
function select(state) {
  return {$$sonopodosStore: state.$$sonopodosStore};
}

class Sonopodos extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    $$sonopodosStore: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  render() {
    const {dispatch, $$sonopodosStore, location} = this.props;
    // bindActionCreators: wraps each action so its return value will be passed to a call of dispatch
    const actions = bindActionCreators(sonopodosActionCreators, dispatch);

    return (
        <SonopodosWidget {...{$$sonopodosStore, actions, location}} />
    );
  }
}

// connect: so this gets notified on store changes
export default connect(select)(Sonopodos);