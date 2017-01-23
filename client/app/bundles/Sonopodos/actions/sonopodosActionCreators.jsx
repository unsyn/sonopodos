import actionTypes from '../constants/sonopodosConstants';
import { routerActions } from 'react-router-redux'


// called on text field updates
export function updateUrl(feed_url) {
  return {
    type: actionTypes.UPDATE_URL,
    feed_url
  };
}

export function updatePodcastFilterTerm(podcast_filter_term) {
  return {
    type: actionTypes.UPDATE_PODCAST_FILTER_TERM,
    podcast_filter_term
  }
}

export function fetchFeed(feed_url) {

  function processAjaxData(response, urlPath){
      document.getElementById("content").innerHTML = response.html;
      document.title = response.pageTitle;
      //window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
  }

  return dispatch => {
    dispatch(fetchFeedPending(feed_url));
    // dispatch(routerActions.push('/pending'));

    let encoded_feed_url = encodeURIComponent(feed_url);
    return fetch('/podcasts/fetch_feed.json?url=' + encoded_feed_url)
        .then(response => response.json()) // chaining, cause json() returns a promise again. TODO detect non-200-responses and error-handle
        .then(json => {
          dispatch(routerActions.push('/?url=' + encodeURIComponent(json.feed_url)));
          return dispatch(fetchFeedSuccess(json));
        });
    //.error(response => dispatch(fetchFeedFailure(response))); TODO clean up failure handling.
  };
}

export function fetchFeedPending(feed_url) {
  return {
    type: actionTypes.FETCH_FEED_PENDING,
    feed_url
  };
}

export function fetchFeedSuccess(response) { // TODO pass in just the title
  return {
    type: actionTypes.FETCH_FEED_SUCCESS,
    title: response.title,
    page_url: response.page_url,
    feed_url: response.feed_url,
    episodes: response.episodes,
    podcasts: response.podcasts,
    error: response.error
  };
}

export function fetchFeedFailure() {
  return {
    type: actionTypes.FETCH_FEED_FAILURE
  }
}
// TODO add isomorphic-fetch dependency or some other fetch polyfill. see f.i. here: http://rackt.org/redux/docs/advanced/AsyncActions.html

export function playEpisode(media_url) {
  return dispatch => {
    dispatch(playEpisodePending(media_url));
    return fetch('/podcasts/play_one.json?episode=' + media_url)
        .then(response => response.json())
        .then(json => dispatch(playEpisodeSuccess(json))); // TODO add error handling
  };
}

export function playEpisodePending(media_url) {
  return {
    type: actionTypes.PLAY_EPISODE_PENDING,
    media_url: media_url
  };
}

export function playEpisodeSuccess(response) {
  return {
    type: actionTypes.PLAY_EPISODE_SUCCESS,
    media_url: response.media_url
  };
}

export function queueEpisode(media_url) {
  return dispatch => {
    dispatch(queueEpisodePending(media_url));
    return fetch('/podcasts/add_one.json?episode=' + media_url)
        .then(response => response.json())
        .then(json => dispatch(queueEpisodeSuccess(json))); // TODO add error handling
  };
}

export function queueEpisodePending(media_url) {
  return {
    type: actionTypes.QUEUE_EPISODE_PENDING,
    media_url: media_url
  };
}

export function queueEpisodeSuccess(response) {
  return {
    type: actionTypes.QUEUE_EPISODE_SUCCESS,
    media_url: response.media_url
  };
}

export function toggle_episode_expanded(media_url) {
  return {
    type: actionTypes.TOGGLE_EPISODE_EXPANDED,
    media_url: media_url
  };
}

export function showPodcastList() {
  return dispatch => {
    dispatch(routerActions.push('/'));
    dispatch({
      type:actionTypes.SHOW_PODCAST_LIST
    });
  };
}

// TODO complete implementation. use fetch
export function deletePodcast(id) {
  $.ajax({
    method: 'delete',
    url: '/podcasts/' + id,
    success: function() {
      location.reload();
    }
  });
  return {
    type: actionTypes.SHOW_PODCAST_LIST
  }
}

export function toggleFeedCaching(id, feed_url) {
  return dispatch => {
    dispatch(toggleFeedCachingPending(feed_url));
    return fetch(new Request('/podcasts/' + id + '/toggle_caching', {method: 'put'}))
        .then(response => response.json())
        .then(json => dispatch(toggleFeedCachingSuccess(json))); // TODO add error handling
  };
}

export function toggleFeedCachingPending(feed_url) {
  return {
    type: actionTypes.TOGGLE_FEED_CACHING_PENDING,
    feed_url: feed_url
  };
}

export function toggleFeedCachingSuccess(response) {
  return {
    type: actionTypes.TOGGLE_FEED_CACHING_SUCCESS,
    feed_url: response.feed_url,
    caching: response.caching
  };
}

