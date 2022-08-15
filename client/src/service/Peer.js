export default class PeerBuilder{
  constructor({peerConfig}){
      this.peerConfig = peerConfig;
      const defaultFn = () => {}
      this.onError = defaultFn
      this.onCallReceived = defaultFn
      this.onConnectionOpened = defaultFn
      this.onPeerStreamReceived = defaultFn
      this.OnCallError = defaultFn
      this.onCallClose = defaultFn
  }

  setOnCallError(fn){
    this.OnCallError = fn;
    return this
  }

  setOnCallClose(fn) {
    this.onCallClose = fn
    return this
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
    call.on('error', error => this.onCallReceived(call, error))
    call.on('close', error => this.onCallClose(call, error))
    this.onCallReceived(call)
  }

  #preparePeerInstanceFunction(peerModule) {
    class PeerCustomModule extends peerModule{}

    const peerCall = PeerCustomModule.prototype.call
    const context = this
    PeerCustomModule.prototype.call = function (id, stream) {
      const call = peerCall.apply(this, [id, stream])
      context.#prepareCallEvent(call)
      return call
    }
    return PeerCustomModule
  }

  build(){
    const PeerCustomInstance = this.#preparePeerInstanceFunction(Peer)
    const peer = new PeerCustomInstance(undefined, {
      key: "peerjs",
      debug: 2
    })
    peer.on('error', this.onError)
    peer.on('call', this.#prepareCallEvent.bind(this))

    return new Promise(resolve => peer.on('open', id => {
      this.onConnectionOpened(peer)
      return resolve(peer);
    }))
  }

}