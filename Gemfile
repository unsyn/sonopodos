source "https://rubygems.org"
ruby "2.3.1"

#
# Bundle edge Rails instead: gem "rails", github: "rails/rails"
gem "rails", "5.0.1"
gem "listen"

# Note: We're using sqllite3 for development and testing
gem "sqlite3"#, group: [:development, :test]

group :production do
  # Pg is used for Heroku
  # gem "pg"
  gem "rails_12factor" # Never include this for development or tests
end

gem "puma"

# Use SCSS for stylesheets
# gem "sass-rails"
# Use Uglifier as compressor for JavaScript assets
gem "uglifier"
# Use CoffeeScript for .js.coffee assets and views
gem "coffee-rails"

# Turbolinks makes following links in your web application faster.
# Read more: https://github.com/turbolinks/turbolinks
# Get turbolinks from npm!
# gem 'turbolinks', '>= 5.0.0.beta2'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem "jbuilder"

# bundle exec rake doc:rails generates the API under doc/api.
gem "sdoc", group: :doc

# Use ActiveModel has_secure_password
# gem "bcrypt", "~> 3.1.7"

# Use Rails Html Sanitizer for HTML sanitization
gem "rails-html-sanitizer"

gem "react_on_rails", "~> 6.0.2"

# See https://github.com/sstephenson/execjs#readme for more supported runtimes
#gem "therubyracer" # disabled for arm, make sure js runtime (like node) is present on system


gem 'bootstrap-sass' # disable this on raspi
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
gem 'autoprefixer-rails'

# gem "autoprefixer-rails"

gem "awesome_print"

# jquery as the JavaScript library has been moved under /client and managed by npm.
# It is critical to not include any of the jquery gems when following this pattern or
# else you might have multiple jQuery versions.

gem 'sonos', git: 'https://github.com/unsyn/sonos.git', branch: 'switch_ssdp_lib'
gem 'feedjira'

# allowing for etag/last_modified based caching/ conditional requests
gem 'faraday-http-cache', git: 'https://github.com/unsyn/faraday-http-cache.git'
# setting body encoding according to response header
gem 'faraday-encoding'

gem 'yaml_db'

gem 'whenever', :require => false

# testing if this ssdp lib works on raspi
gem 'frisky'

group :development do
  # Access an IRB console on exceptions page and /console in development
  gem "web-console"
end

group :development, :test do
  ################################################################################
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem "spring"
  gem "spring-commands-rspec"

  ################################################################################
  # Manage application processes
  gem "foreman"
  gem "factory_girl_rails"

  ################################################################################
  # Linters and Security
  gem "rubocop", require: false
  gem "ruby-lint", require: false
  # Critical that require: false be set! https://github.com/brigade/scss-lint/issues/278
  gem "scss_lint", require: false
  gem "brakeman", require: false
  gem "bundler-audit", require: false

  ################################################################################
  # Favorite debugging gems
  gem "pry"
  gem "pry-doc"
  gem "pry-rails"
  gem "pry-stack_explorer"
  gem "pry-rescue"
  gem "pry-byebug"

  ################################################################################
  # Color console output
  gem "rainbow"
end

group :test  do
  gem "coveralls", require: false
  gem "capybara"
  gem "capybara-screenshot"
  gem "capybara-webkit"
  gem "chromedriver-helper", require: ["selenium_chrome"].include?(ENV["DRIVER"])
  gem "database_cleaner"
  gem "generator_spec"
  gem "launchy"
  gem "poltergeist"
  gem "rspec-rails", "3.5.0.beta3"
  gem "rspec-retry"
  gem "selenium-webdriver", require: !["poltergeist", "poltergeist_errors_ok", "webkit"].include?(ENV["DRIVER"])
end
