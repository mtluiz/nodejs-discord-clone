import Peer from "peerjs-client";

export default class PeerBuilder{
  constructor({peerConfig}){
      this.peerConfig = peerConfig;
      const defaultFn = () => {}
      this.onError = defaultFn
      this.onCallReceived = defaultFn
      this.onConnectionOpened = defaultFn
      this.onPeerStreamReceived = defaultFn
  }

  setOnError(fn) {
    this.onError = fn
    return this
  }

  setOnCallReceived(fn) {
    this.onCallReceived = fn
    return this
  }

  setOnConnectionOpened(fn) {
    this.onConnectionOpened = fn
    return this
  }

  setOnPeerStreamReceived(fn){
    this.onPeerStreamReceived = fn
    return this
  }

  #prepareCallEvent(call) {
    call.on('stream', stream => this.onPeerStreamReceived(call, stream))

    try{
      this.onCallReceived(call)
    }catch(err) {
      console.log("deu erro porra");
    }
  }

  build(){
    const peer = new Peer(...this.peerConfig)

    peer.on('error', this.onError)
    peer.on('call', this.#prepareCallEvent.bind(this))

    return new Promise(resolve => peer.on('open', id => {
      this.onConnectionOpened(peer)
      return resolve(peer);
    }))
  }

}