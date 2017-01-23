class AddCachingToPodcasts < ActiveRecord::Migration
  def change
    add_column :podcasts, :caching, :boolean
  end
end
