import React, {PropTypes} from 'react';
import _ from 'lodash';


export default class SonopodosEpisodeListItem extends React.Component {
  constructor(props, context) {
    super(props, context);
    _.bindAll(this, ['_handlePlay', '_handleQueue', '_handleToggleDetailsVisibility']);
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    episode: PropTypes.object.isRequired
  }

  _handlePlay(e) {
    const url = this.props.episode.get('media_url');
    this.props.actions.playEpisode(url);
    e.preventDefault();
  }

  _handleQueue(e) {
    const url = this.props.episode.get('media_url');
    this.props.actions.queueEpisode(url);
    e.preventDefault();
  }

  _handleToggleDetailsVisibility(e) {
    //$(e.target.parentNode).find('.details').toggle();
    this.props.actions.toggle_episode_expanded(this.props.episode.get('media_url'));
    e.preventDefault();
  }

  render() {
    const episode = this.props.episode;
    const title = episode.get('title');
    const duration = episode.get('duration');
    const published_time_ago = episode.get('published_time_ago');
    const page_url = episode.get('page_url');
    const queue_pending = episode.get('queue_pending');
    const play_pending = episode.get('play_pending');
    const expanded = episode.get('details_visible');
    const media_url = episode.get('media_url');

    let play_button;
    if(play_pending) {
      play_button = <a onClick={this._handlePlay} title="Play, replacing any current playlist" className="btn btn-default">..</a>;
    } else {
      play_button = <a onClick={this._handlePlay} title="Play, replacing any current playlist" className="btn btn-default">&#9654;</a>;
    }

    let queue_button;
    if(queue_pending) {
      queue_button = <a onClick={this._handleQueue} title="Queue to play later" className="btn btn-default">..</a>;
    } else {
      queue_button = <a onClick={this._handleQueue} title="Queue to play later" className="btn btn-default">(+)</a>;
    }

    let item_details;
    if(expanded) {
      item_details = (<div className="details">
        <p className="text-muted">{duration}{duration && published_time_ago ? ' / ' : ''}{published_time_ago}</p>
        <div className="btn-group">
          <a href={page_url} className="btn btn-default">info</a>
          <a href={media_url} className="btn btn-default">pre</a>
          {play_button}
          {queue_button}
        </div>
      </div>);
    } else {
      item_details = '';
    }

    return (
        <li className="list-group-item">
          <a href='#' onClick={this._handleToggleDetailsVisibility} style={{display:'block',width:'100%'}}>{title}</a>
          {item_details}
        </li>
    );
  }
}
