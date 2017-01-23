module PodcastsHelper

  def media_url(episode)
    # this f. i. shows up in image property, so fix it: http://damals-tm-podcast.de/feed/damalstm-mp3/
    episode.try(:enclosure_url) || ((episode.respond_to?(:image) && !episode.image.nil? && episode.image[-4, 4] == '.mp3') && episode.image)
  end

end
