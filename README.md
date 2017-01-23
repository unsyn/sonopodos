# Sonopodos
Sonopodos is a podcast launcher for sonos. They get streamed directly, without the need for iTunes or some such.
It also stores the podcast feeds you have used, so you can update all the feeds on the push of a button, or automatically.
Technically it's just a rails/react app you can run on anything in your local network. Also, it plays any playable audio
file that is reachable from the network. Instead of playing, you can also add podcasts and files to the current sonos playlist.

Sonopodos is currently set up to join all available players on the network ("party mode") and set them to a fairly low volume
when you play anything.

At this stage it is a dead-simple single-purpose thingy that should be pretty much self explanatory once it's running.
But feel free to tell me I'm wrong!

Importantly, there is no security or authentication in place, which is fine for the typical home network behind a router.
However, this is not meant to be run on a public network.

## Setup
This is the most straightforward variant for your laptop etc. Please ask for details for Synology or RaspberryPi.
* You need to have [Ruby](https://www.ruby-lang.org/en/documentation/installation/) 2.3.1, [RubyGems](https://rubygems.org/pages/download)
and the [Bundler](https://bundler.io/) gem installed.
* Then, clone or download+unpack this project and navigate to the project directory on your computer.
* Get some needed ruby libraries: `bundle install`
* Get some needed javascript libraries: `npm install`
* Create a database file: `bundle exec rake db:create RAILS_ENV=production`
* Configure the database: `bundle exec rake db:migrate RAILS_ENV=production`
* Optional: if you want some (mostly German) podcasts added to the db, run `bundle exec rake db:data:load RAILS_ENV=production`
* Generate some files to run inside the browser: `bundle exec rake assets:precompile RAILS_ENV=production`
* Run the app: `rails s -e production`
* Open your browser at [http://localhost:3000](http://localhost:3000)

## Updating Podcasts
* Hit the URL: [http://localhost:3000/podcasts/fetch_all_episode_updates](http://localhost:3000/podcasts/fetch_all_episode_updates)
(takes a few minutes if you have a lot of podcasts.
* There's a [whenever](https://github.com/javan/whenever) configuration under config/schedule` that creates a conjob to update episodes every 3 hours.
This works for standard linux systems, a few tweaks may be needed on more exotic environments.

## Background: React and Rails
This is based on the cool react-webpack-rails-tutorial using the react_on_on_rails gem.
For more info see their detailed [readme](https://github.com/shakacode/react-webpack-rails-tutorial/blob/master/README.md).

## Current State
This is a work in progress. Lots of loose ends, but as it is, it has been working fine for me for a few months,
running on a RaspberryPI2 and a Synology DS216play, among others. If there is interest in installing instructions I'm happy to include this here.

## Plans and Ideas
* Adjustable default volume and sonos grouping behavior.
* Play/Pause for the current file
* Some kind of playing progress tracking would be nice. This would enable you to interrupt one
podcast for another one, and resume the first one from where you stopped later.
