import React, {PropTypes} from 'react';
import Immutable from 'immutable';
import _ from 'lodash';

import SonopodosPodcastListItem from './SonopodosPodcastListItem';
import SonopodosEpisodeListItem from './SonopodosEpisodeListItem';

import DocumentTitle from 'react-document-title';

export default class SonopodosWidget extends React.Component {
  constructor(props, context) {
    super(props, context);
    _.bindAll(this, ['_handleChange', '_handleSubmit', '_handleBack']);
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    $$sonopodosStore: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  componentDidMount() {
    const url = this.props.$$sonopodosStore.get('feed_url');
    if(url != null && url != '') {
      this.props.actions.fetchFeed(url);
    }
  }

  componentWillReceiveProps(nextProps) {
    let url = nextProps.$$sonopodosStore.get('feed_url');

    // only fetching a feed when history_change changes from false to true
    let first_hist_change = !this.props.$$sonopodosStore.get('history_change') && nextProps.$$sonopodosStore.get('history_change');
    if(url != null && url != '' && first_hist_change) {
      this.props.actions.fetchFeed(url);
    }
  }


  _handleSubmit(e) {
    const url = this.props.$$sonopodosStore.get('feed_url');
    if(url != null && url != '') {
      this.props.actions.fetchFeed(url);
    }
    e.preventDefault();
  }

  _handleChange(e) {
    const urlOrPodcastFilterTerm = e.target.value;
    // use to filter list if matching. otherwise, interpret as new feed url to parse and display and add if parsing is successful.
    this.props.actions.updatePodcastFilterTerm(urlOrPodcastFilterTerm);
    this.props.actions.updateUrl(urlOrPodcastFilterTerm);
    // TODO probably merge update call and property for filter and url into one
  }

  _handleBack(e) {
    this.props.actions.showPodcastList();
    e.preventDefault();
  }

  render() {
    const $$sonopodosStore = this.props.$$sonopodosStore;
    const actions = this.props.actions;
    const episodes = $$sonopodosStore.get('episodes');
    const podcasts = $$sonopodosStore.get('podcasts');
    const title = $$sonopodosStore.get('title');
    const feed_url = $$sonopodosStore.get('feed_url');
    const podcast_filter_term = $$sonopodosStore.get('podcast_filter_term');
    const cache = $$sonopodosStore.get('cache');
    const page_url = $$sonopodosStore.get('page_url');
    const pending = $$sonopodosStore.get('pending');
    const error = $$sonopodosStore.get('error');
    const history_change = $$sonopodosStore.get('history_change');
    let titleLinkOrPendingOrError;// = $$sonopodosStore.get('pending') ? 'pending...' : title;
    let titleOrPendingOrError;
    let placeholder_text = "Add a feed URL | Play file";

    let podcast_list;
    let episodes_list;

    if(pending) { // pending state
      // TODO add cancel/back link
      titleLinkOrPendingOrError = <span><a href='#' onClick={this._handleBack}>&#9668;&#9668;</a> pending...</span>;
      titleOrPendingOrError = 'pending...';
    } else if(error) { // error page
      titleLinkOrPendingOrError = <span><a href='#' onClick={this._handleBack}>&#9668;&#9668;</a> {error}</span>;
      titleOrPendingOrError = error;
    } else { // showing podcast list or episodes of one podcast
      titleLinkOrPendingOrError = <span><a href='#' onClick={this._handleBack}>&#9668;&#9668;</a> <a href={page_url}>{title}</a></span>;
      titleOrPendingOrError = title;

      if(episodes.size < 1 && podcasts != null && podcasts.size >= 1) { // showing podcasts
        titleLinkOrPendingOrError = 'Podcasts';
        placeholder_text = "Search your feeds | Add a feed URL | Play file";
        podcast_list = <ul className="list-group">
          {podcasts.filter(function(podcast, i){
            return podcast_filter_term == undefined || podcast_filter_term === '' || podcast.get('title') != null && (podcast.get('title').toLowerCase().indexOf(podcast_filter_term.toLowerCase()) != -1);
          }).map(function(podcast, i){
            return (<SonopodosPodcastListItem {...{podcast, actions}} key={i}/>);
          })}
        </ul>
      }

      if(page_url != null && page_url != '' && episodes != null && episodes.size >=1) { // showing episodes
        episodes_list = <ul className="list-group">
          {episodes.map(function(episode, i){
            return (
              <SonopodosEpisodeListItem {...{episode, actions}} key={i} />
            );
          })}
        </ul>;
      }
    }


    return (
        <DocumentTitle title={titleOrPendingOrError || 'Podcasts'}>
          <div>
            <h3>
              {titleLinkOrPendingOrError}
            </h3>
            <form method="get" onSubmit={this._handleSubmit}>
              <input id="fetch_feed_field" className="form-control" type="text" name="url" value={feed_url ? feed_url : podcast_filter_term} placeholder={placeholder_text} onChange={this._handleChange} />
              <br />
              <input className="form-control btn-info" type="submit" value="Fetch Feed" />
            </form>
            {episodes_list}
            {podcast_list}
            <a href="/podcasts/fetch_all_episode_updates">[click here to update all feeds manually, takes a while and blocks other calls til done]</a>
            <br/>
            <br/>
          </div>
        </DocumentTitle>
    );
  }
}
