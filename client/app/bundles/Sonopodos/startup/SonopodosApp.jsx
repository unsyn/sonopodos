import React from 'react';
import {Provider} from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import createHistory from 'history/lib/createBrowserHistory';

//import createStore from '../store/sonopodosStore';

import Sonopodos from '../containers/Sonopodos';

import { syncReduxAndRouter, syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'

//---store-dependencies
import {compose, createStore, applyMiddleware, combineReducers} from 'redux';

import thunkMiddleware from 'redux-thunk';

import loggerMiddleware from '../../../lib/middlewares/loggerMiddleware';

import reducers from '../reducers';
import { initialStates } from '../reducers';
//---



const SonopodosApp = (props, location) => {
  // const history = createHistory();

  // this function was in stores/sonopodosStore, moved it here to get a better overview of data flow of redux-simple-router
  const createSonopodosStore = props => {

    const {title, page_url, feed_url, podcast_filter_term, pending, error, episodes, podcasts, history_change} = props;
    const {$$sonopodosState} = initialStates;

    const initialState = {
      $$sonopodosStore: $$sonopodosState.merge({
        title: title,
        page_url: page_url,
        feed_url: feed_url,
        podcast_filter_term: podcast_filter_term,
        episodes: [],
        podcasts: podcasts || [],
        pending: pending,
        error: error,
        history_change: false
      })
    };

    const reducer = combineReducers(Object.assign({}, reducers, {
      routing: routerReducer
    }));

    // Sync dispatched route actions to the history
    // const reduxRouterMiddleware = syncHistory(history);

    const routerMiddlewareWithHistory = routerMiddleware(browserHistory)


    // add any middlewares to store, so they get called on store modifications/dispatch, before the reducres modify the store
    const composedStore = compose(
        applyMiddleware(thunkMiddleware, loggerMiddleware, routerMiddlewareWithHistory)
    );
    const storeCreator = composedStore(createStore);
    const store = storeCreator(reducer, initialState);

    return store;
  };

  const store = createSonopodosStore(props);

  // Create an enhanced history that syncs navigation events with the store
  const history = syncHistoryWithStore(
    browserHistory,
    store
  );

  const reactComponent = (
      <Provider store={store}>
        <Router history={history}>
          <Route path="/" component={Sonopodos}/>
        </Router>
      </Provider>
  );
  return reactComponent;
};

export default SonopodosApp;
