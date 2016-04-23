defmodule Mychat.RoomChannel do
  use Mychat.Web, :channel
  alias Mychat.ChannelMonitor

  def join("rooms:lobby", message, socket) do
    current_user = socket.assigns.current_user
    users = ChannelMonitor.user_joined("game:lobby", current_user)["game:lobby"]
    Process.flag(:trap_exit, true)
    send(self, {:after_join, users})
    {:ok, socket}
  end

  def join("rooms:" <> something_else, _msg, _socket) do
    {:error, %{reason: "You can't do this"}}
  end

  def handle_info({:after_join, users}, socket) do
    # broadcast! socket, "user:entered", %{user: msg["user"]}
    # push socket, "join", %{status: "connected"}
    lobby_update(socket, users)
    {:noreply, socket}
  end

  def terminate(_reason, socket) do
    user = socket.assigns.current_user
    users = ChannelMonitor.user_left("game:lobby", user)["game:lobby"]
    lobby_update(socket, users)
    :ok
  end

  def handle_in("new:msg", msg, socket) do
    broadcast! socket, "new:msg", %{user: msg["user"], body: msg["body"]}
    {:reply, {:ok, %{msg: msg["body"]}}, assign(socket, :user, msg["user"])}
  end

  defp lobby_update(socket, users) do
    broadcast! socket, "lobby_update", %{ users: users}
  end

end
