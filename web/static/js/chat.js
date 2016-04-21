class Chat {
  static init(socket) {
    var status = document.querySelector("#status")
    var messages = document.querySelector("#messages")
    var input = document.querySelector("#message-input")
    var username = document.querySelector("#username")

    socket.onOpen( ev => console.log("OPEN", ev))
    socket.onError( ev => console.log("OPEN", ev))
    socket.onClose( e => console.log("CLOSE", e))

    var chan = socket.channel("rooms:lobby", {})
    chan.join()
        .receive("ignore", () => console.log("auth error"))
        .receive("ok", () => console.log("join ok"))
        .receive("timeout", () => console.log("Connection interruption"))
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))

    input.addEventListener("keypress", e => {
      if (e.keyCode == 13) {
        chan.push("new:msg", {user: username.value, body: input.value}, 1000)
        input.value = ""
      }
    })

    chan.on("new:msg", msg => {
      messages.appendChild(this.messageTemplate(msg))
      scrollTo(0, document.body.scrollHeight)
    })

    chan.on("user:entered", msg => {
      var username = msg.user || "anonymous"
      var message = document.createTextNode(`[${username} entered]`)
      messages.appendChild(document.createElement("br"))
      messages.appendChild(message)
     })
  }

  static messageTemplate(msg) {
    let username = msg.user || "anonymous"
    let body = msg.body
    let message = document.createElement("p")
    let usernameNode = document.createElement("a")

    usernameNode.innerText = username
    message.appendChild(usernameNode)
    message.appendChild(document.createTextNode(` ${msg.body}`))

    return message
  }
}

export default Chat
