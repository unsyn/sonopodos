import React, {PropTypes} from 'react';
import _ from 'lodash';


export default class SonopodosPodcastListItem extends React.Component {
  constructor(props, context) {
    super(props, context);
    _.bindAll(this, ['_handleShowEpisodes', '_handleDeletePodcast', '_handleToggleCaching']);
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    podcast: PropTypes.object.isRequired
  }

  _handleShowEpisodes(e) {
    const url = this.props.podcast.get('feed_url');
    this.props.actions.fetchFeed(url);
    e.preventDefault();
  }

  _handleDeletePodcast(e) {
    if(confirm('Delete "' + this.props.podcast.get('title') + '"?')) {
      const id = this.props.podcast.get('id');
      this.props.actions.deletePodcast(id);
    }
    e.preventDefault();
  }

  _handleToggleCaching(e) {
    console.log('toggle caching');
    const id = this.props.podcast.get('id');
    const feed_url = this.props.podcast.get('feed_url');
    this.props.actions.toggleFeedCaching(id, feed_url)
    e.preventDefault();
  }

  render() {
    const podcast = this.props.podcast;
    const title = podcast.get('title');
    const page_url = podcast.get('page_url');
    const feed_url = podcast.get('feed_url');
    const cachingStatus = podcast.get('caching') ? 'caching: yes' : 'caching: no';
    const toggle_caching_pending = podcast.get('toggle_caching_pending');
    const caching_fragment = toggle_caching_pending ? 'caching: ..' : (<a href='#' onClick={this._handleToggleCaching} title='toggle caching'>{cachingStatus}</a>)
    return (
        <li className="list-group-item">
          <a href='#' onClick={this._handleShowEpisodes}>{podcast.get('title')} ({podcast.get('episode_added_at')})</a> | {caching_fragment} | <a href='#' onClick={this._handleDeletePodcast}>(x)</a>
        </li>
    );
  }
}
