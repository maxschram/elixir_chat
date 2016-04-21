defmodule Mychat.ChatController do
  use Mychat.Web, :controller

  def index(conn, __params) do
    render conn, "lobby.html"
  end
end
