require 'frisky/ssdp'

class PodcastsController < ApplicationController

  @@default_default_volume = 14

  def index
    @feed_url = params[:url]
  end

  def app
    @feed_url = params[:url]
    @podcast = Podcast.new
    @podcasts = Podcast.order('episode_added_at DESC', 'lower(title)').all

    # legacy param processing
    @feed_url = params[:feed] if @feed_url.nil?
  end

  def fetch_feed
    url = URI.unescape(params[:url])
    @error = nil
    @podcast = Podcast.new

    is_media_url = media_url?(url)

    if !is_media_url && url.present?
      @feed_url = url
      begin
        feed = Podcast::fetch_and_parse_with_caching @feed_url
        @items = feed.entries
        if feed.url
          @podcast = Podcast.find_or_initialize_by(feed_url: feed.feed_url)
          @podcast.title = feed.title
          @podcast.page_url = feed.url
          @podcast.caching = true if @podcast.new_record?
          @podcast.update_latest_change_and_save
          @podcast.save!
        end
      rescue Feedjira::NoParserAvailable
        @error = 'Couldn\'t parse content'
      rescue Faraday::ConnectionFailed
        @error = 'Couldn\'t reach anyone at the URL'
      rescue NoMethodError
        @error = 'Couldn\'t make sense of the URL'
      end
    elsif is_media_url
      play_media_file(url)
    else
      @error = 'Please enter a podcast feed URL above'
    end

    @podcasts = Podcast.order('episode_added_at DESC', 'lower(title)').all
  end

  def play_one
    media_url = params[:episode]
    feed = params[:url]

    play_media_file(media_url)

    respond_to do |format|
      format.html { redirect_to action: :index, feed: feed, notice: "Started playing #{media_url} ." }
      format.json { render json: {'success': true, 'media_url': media_url} }
    end
  end

  def play_media_file(media_url)
    volume = default_volume
    system, master = ensure_party
    master.clear_queue
    set_all_volumes volume, system
    master.add_to_queue media_url # we always add to queue and play from there, so that the next title that we add to the queue later will be automatically played after the current title
    master.use_queue
    master.play
  end

  def play_all
    feed_url = params[:url]
    volume = default_volume
    system, master = ensure_party
    feed = Podcast::fetch_and_parse_with_caching feed_url
    master.clear_queue
    first = true
    feed.entries.each do |entry|
      if first
        master.play entry.enclosure_url
        first = false
      else
        master.add_to_queue entry.enclosure_url
      end
    end
    set_all_volumes volume, system
    master.play
    flash.notice = "Added all items of #{feed_url} ."
    redirect_to action: :index, feed: feed_url
  end

  def add_one
    media_url = params[:episode]
    feed = params[:url]
    system, master = ensure_party
    master.add_to_queue media_url

    respond_to do |format|
      format.html { redirect_to action: :index, feed: feed, notice: "Added #{media_url} ." }
      format.json { render json: {'success': true, 'media_url': media_url} }
    end
  end

  def add_all
    feed_url = params[:url]
    system, master = ensure_party
    feed = Podcast::fetch_and_parse_with_caching feed_url
    feed.entries.each do |entry|
      master.add_to_queue entry.enclosure_url
    end
    flash.notice = "Added all items of #{feed_url} ."
    redirect_to action: :index, feed: feed_url
  end


  def destroy
    podcast = Podcast.find(params[:id])
    podcast.destroy if podcast

    respond_to do |format|
      format.json { head :no_content }
    end
  end

  def fetch_all_episode_updates
    Podcast.update_all_latest_changes
    redirect_to action: :app
  end

  def toggle_caching
    podcast = Podcast.find(params[:id])
    podcast.caching = !podcast.caching
    if podcast.save
      logger.debug "Saving podcast succeeeded..caching attr: #{podcast.caching}"
      respond_to do |format|
        format.json { render json: {'feed_url': podcast.feed_url, 'caching': podcast.caching}}
      end
    end
  end

private
  def set_all_volumes vol, system
    system.speakers.each do |p|
      p.volume = vol
    end
  end

  def ensure_party
    system = Sonos::System.new
    # trying out a workaround for discovery problems on raspi
    #system = Sonos::System.new(Sonos::Discovery.new(2, '192.168.178.40').topology)

    master = system.find_party_master

    # system.party_mode is causing problems every other time. so work around this, and only perform grouping operations if needed.

    # check if everything is joined already. if so, we don't have to redo it.
    unless system.groups.length == 1 && system.groups.first.speakers.length == system.speakers.length
      system.party_over

      # system.party_mode master
      slaves = system.speakers.select{|s| s != master}
      slaves.each do |s|
        s.join master
      end
    end

    if master.nil?
      master = system.speakers.last
    end

    return system, master
  end

  def media_url?(url)
    ! (url.strip =~ /.*\.(mp3|aac|wma)$/).nil?
  end

  def default_volume
    @@default_default_volume # TODO take user-settable value here
  end

end
