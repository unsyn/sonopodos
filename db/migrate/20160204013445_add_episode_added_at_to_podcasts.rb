class AddEpisodeAddedAtToPodcasts < ActiveRecord::Migration
  def change
    add_column :podcasts, :episode_added_at, :datetime
  end
end
