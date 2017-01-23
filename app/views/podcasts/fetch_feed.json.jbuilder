  json.title @podcast.title
  json.page_url @podcast.page_url
  json.feed_url @podcast.feed_url
  json.error @error
  json.episodes @items do |episode|
    json.title episode.title
    json.media_url media_url(episode)
    json.page_url episode.url
    json.duration episode.itunes_duration if episode.try(:itunes_duration).present?
    json.published_time_ago "#{time_ago_in_words episode.try!(:published)} ago" if episode.try!(:published).present?
    json.queue_pending false
    json.play_pending false
    json.details_visible false
  end

  json.podcasts @podcasts do |podcast|
    json.id podcast.id
    json.title podcast.title
    json.feed_url podcast.feed_url
    json.page_url podcast.page_url
    json.episode_added_at "#{time_ago_in_words podcast.try!(:episode_added_at)} ago" if podcast.try!(:episode_added_at).present?
    json.caching podcast.caching
  end
