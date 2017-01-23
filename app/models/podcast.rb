class Podcast < ActiveRecord::Base

  def self.update_all_latest_changes
    start = Time.now
    logger.debug 'starting to update all feeds'
    Podcast.all.each do |podcast|
      podcast.update_latest_change_and_save
    end
    logger.debug "updated all latest changes (#{Podcast.count} podcasts) in #{Time.now - start}"
  end

  def update_latest_change_and_save
    begin
      if self.caching?
        logger.debug "get cached: #{self.feed_url}"
        feed = Podcast::fetch_and_parse_with_caching self.feed_url
      else
        logger.debug "get (no caching): #{self.feed_url}"
        feed = Feedjira::Feed.fetch_and_parse self.feed_url
      end

      latest_episode = feed.entries.first
      pub_date = latest_episode.try!(:published)
      self.episode_added_at = pub_date || 10.years.ago
      self.save
      logger.debug 'updated ' + self.feed_url
    rescue
      logger.debug 'error updating ' + self.feed_url
    end
  end

  # patched version of this method from Feedjira::Feed, allowing to add headers for conditional get
  def self.fetch_and_parse_with_caching feed_url
    connection = caching_connection(feed_url)

    response = connection.get do |req|
      req.options[:timeout] = 10           # open/read timeout in seconds
      req.options[:open_timeout] = 4      # connection open timeout in seconds
    end

    raise Feedjira::FetchFailure.new("Fetch failed - #{response.status}") unless response.success?
    xml = response.body
    parser_klass = Feedjira::Feed::determine_feed_parser_for_xml xml
    raise Feedjira::NoParserAvailable.new("No valid parser for XML.") unless parser_klass

    feed = Feedjira::Feed::parse_with parser_klass, xml
    feed.feed_url = feed_url
    feed
  end

  def self.caching_connection(url)
    Faraday.new(url: url) do |conn|
      conn.use FaradayMiddleware::FollowRedirects, limit: 3
      conn.use :http_cache, store: Rails.cache
      conn.response :encoding
      conn.adapter Faraday.default_adapter
    end
  end

end

