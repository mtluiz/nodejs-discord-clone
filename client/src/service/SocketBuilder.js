import {io} from "socket.io-client";

export default class SocketBuilder{
  constructor({socketUrl}) {
    this.socketUrl = socketUrl
    this.onUserConnected = () => {}
    this.onUserDisconnected = () => {}
  }

  setUserConnected(fn) {
    this.onUserConnected = fn;
    return this
  }

  setUserDisconnected(fn) {
    this.onUserDisconnected = fn;
    return this
  }

  build(){
    const socket = io.connect(this.socketUrl, {
      withCredentials: false
    })
    socket.on('user-connected', this.onUserConnected)
    socket.on('user-disconnected', this.onUserDisconnected)

    return socket
  }
}