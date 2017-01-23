class CreatePodcasts < ActiveRecord::Migration
  def change
    create_table :podcasts do |t|
      t.string :title
      t.string :feed_url
      t.string :page_url
      t.datetime :content_updated_at

      t.timestamps null: false
    end
  end
end
