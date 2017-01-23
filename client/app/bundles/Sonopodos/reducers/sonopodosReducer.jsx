import Immutable from 'immutable';

import actionTypes from '../constants/sonopodosConstants';

import { UPDATE_LOCATION, LOCATION_CHANGE } from 'react-router-redux'

import ActionCreators from '../actions/sonopodosActionCreators';


export const $$initialState = Immutable.fromJS({
  title: '',
  page_url: '',
  feed_url: '',
  podcast_filter_term: '',
  episodes: [],
  podcasts: [],
  pending: false,
  history_change: false,
  caching: true
});

export default function sonopodosReducer($$state = $$initialState, action) {
  const {type, page_url, feed_url, podcast_filter_term, title, episodes, podcasts, media_url, error, history_change, caching} = action;

  switch(type) {
    case LOCATION_CHANGE: { // triggered by browser url change (via redux-simple-router / react-router
      let extracted_feed_url = action.payload.query.url || '';

      if(extracted_feed_url == '' || extracted_feed_url == 'null') {
        return $$state.merge({feed_url: '', 'episodes': [], 'history_change': false});
      } else {
        let hist_change = (action.payload.action === 'POP');
        return $$state.merge({'feed_url': extracted_feed_url, 'history_change': hist_change});
      }
    }

    case actionTypes.UPDATE_URL: { // triggered by feed_url form field onchange
      return $$state.set('feed_url', feed_url);
    }

    case actionTypes.UPDATE_PODCAST_FILTER_TERM: {
      console.log('in reducer for updatePodcastfilterterm, new podcastfilterterm: ', podcast_filter_term, ', feed_url: ', feed_url);
      return $$state.set('podcast_filter_term', podcast_filter_term);
    }

    case actionTypes.FETCH_FEED_PENDING: {
      return $$state.merge({
        title: '',
        pending: true,
        error: null,
        page_url: '',
        feed_url: feed_url,
        episodes: []
      });
    }

    case actionTypes.FETCH_FEED_SUCCESS: {
      return $$state.merge({
        'title': title,
        pending: false,
        error: error,
        page_url: page_url,
        feed_url: feed_url,
        episodes: episodes,
        podcasts: podcasts,
        history_change: false,
        caching: caching
      });
    }

    case actionTypes.FETCH_FEED_FAILURE: {
      return $$state.merge({
        title: '',
        error: 'error',
        pending: false,
        page_url: '',
        feed_url: feed_url,
        episodes: [],
        history_change: false
      });
    }

    case actionTypes.PLAY_EPISODE_PENDING: {
      return $$state.merge({
        episodes: $$state.get('episodes').map(ep => {
          if(ep.get('media_url') === media_url) {
            return ep.merge({
              play_pending: true
            });
          } else {
            return ep;
          }
        })
      });
    }

    case actionTypes.PLAY_EPISODE_SUCCESS: {
      return $$state.merge({
        episodes: $$state.get('episodes').map(ep => {
          if(ep.get('media_url') === media_url) {
            return ep.merge({
              play_pending: false
            });
          } else {
            return ep;
          }
        })
      });
    }

    case actionTypes.QUEUE_EPISODE_PENDING: {
      return $$state.merge({
        episodes: $$state.get('episodes').map(ep => {
          if(ep.get('media_url') === media_url) {
            return ep.merge({
              queue_pending: true
            });
          } else {
            return ep;
          }
        })
      });
    }

    case actionTypes.QUEUE_EPISODE_SUCCESS: {
      return $$state.merge({
        episodes: $$state.get('episodes').map(ep => {
          if(ep.get('media_url') === media_url) {
            return ep.merge({
              queue_pending: false
            });
          } else {
            return ep;
          }
        })
      });
    }

    case actionTypes.TOGGLE_EPISODE_EXPANDED: {
      return $$state.merge({
        episodes: $$state.get('episodes').map(ep => {
          if(ep.get('media_url') === media_url) {
            return ep.merge({
              details_visible: !ep.get('details_visible')
            });
          } else {
            return ep.merge({
              details_visible: false
            });
          }
        })
      });
    }

    case actionTypes.SHOW_PODCAST_LIST: {
      return $$state.merge({
        'title': 'Podcasts',
        pending: false,
        error: error,
        page_url: '',
        feed_url: '',
        podcast_filter_term: '',
        episodes: []
      });
    }

    case actionTypes.TOGGLE_FEED_CACHING_SUCCESS: {
      return $$state.merge({
        podcasts: $$state.get('podcasts').map(pc => {
          if(pc.get('feed_url') === feed_url) {
            return pc.merge({
              caching: caching,
              toggle_caching_pending: false
            });
          } else {
            return pc;
          }
        })
      });
    }

    case actionTypes.TOGGLE_FEED_CACHING_PENDING: {
      return $$state.merge({
        podcasts: $$state.get('podcasts').map(pc => {
          if(pc.get('feed_url') === feed_url) {
            return pc.merge({
              toggle_caching_pending: true
            });
          } else {
            return pc;
          }
        })
      });
    }

    default: {
      return $$state;
    }
  }
}