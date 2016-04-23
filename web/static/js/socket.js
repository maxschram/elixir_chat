import {Socket} from "phoenix"
let token = document.querySelector('meta[name=channel_token]').getAttribute('content')
let socket = new Socket("/socket", { params: {token: token }})
socket.connect()
export default socket
