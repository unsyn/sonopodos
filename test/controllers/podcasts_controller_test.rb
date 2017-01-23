require 'test_helper'

class PodcastsControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

  test "should get play_one" do
    get :play_one
    assert_response :success
  end

  test "should get play_all" do
    get :play_all
    assert_response :success
  end

  test "should get add_one" do
    get :add_one
    assert_response :success
  end

  test "should get add_all" do
    get :add_all
    assert_response :success
  end

end
