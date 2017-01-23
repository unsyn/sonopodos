import {compose, createStore, applyMiddleware, combineReducers} from 'redux';

import thunkMiddleware from 'redux-thunk';

import loggerMiddleware from 'lib/middlewares/loggerMiddleware';

import reducers from '../reducers';
import {initialStates} from '../reducers';

export default props => {
  // TODO add more props as needed
  const {title, page_url, feed_url, podcast_filter_term, pending, error, episodes, podcasts, history_change} = props;
  const {$$sonopodosState} = initialStates;

  const initialState = {
    $$sonopodosStore: $$sonopodosState.merge({
      title: title, // TODO check: why are we declaring defaults again here? they are already coming from the reducers. << yea, but initially, we might pass in something w/o going thru reducers. so its needed.
      page_url: page_url,
      feed_url: feed_url,
      podcast_filter_term: podcast_filter_term,
      episodes: [],
      podcasts: podcasts,
      pending: pending,
      error: error,
      history_change: history_change,
      caching: true
    })
  };

  // combineReducers: TODO
  const reducer = combineReducers(reducers);
  // add any middlewares to store, so they get called on store modifications/dispatch, before the reducres modify the store
  const composedStore = compose(
      applyMiddleware(thunkMiddleware, loggerMiddleware)
  );
  // storeCreator: TODO
  const storeCreator = composedStore(createStore);
  const store = storeCreator(reducer, initialState);

  return store;
};
