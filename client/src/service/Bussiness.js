export default class Bussiness {
  constructor({ room, media, video, socketBuilder, peerBuilder }) {
    this.media = media
    this.room = room
    this.video = video

    this.socketBuilder = socketBuilder
    this.peerBuilder = peerBuilder

    this.currentStream = {}
    this.socket = {}
    this.currentPeer = {}

    this.peers = new Map()
  }

  static initialize(deps) {
    const instance = new Bussiness(deps)
    return instance.#init()
  }

  async #init() {
    this.currentStream = await this.media.getCamera()
    this.socket = this.socketBuilder
                    .setUserConnected(this.onUserConnected())
                    .setUserDisconnected(this.onUserDisconnected())
                    .build()
    
    this.currentPeer = await this.peerBuilder
        .setOnError(this.onPeerError())
        .setOnConnectionOpened(this.onPeerConnectionOpened())
        .setOnCallReceived(this.onPeerCallReceived())
        .setOnPeerStreamReceived(this.onPeerStreamReceived())
        .setOnCallError(this.onPeerCallError())
        .setOnCallClose(this.onPeerCallClose())
        .build()

    this.addVideoStream(this.currentPeer.id)
  }

  addVideoStream(userId, stream = this.currentStream, muted){
    this.video.renderVideo({
      userId,
      stream,
      isCurrentId: userId === this.currentPeer.id
    })
  }

  onUserConnected = function(){
    return userId => {
      this.currentPeer.call(userId, this.currentStream)
    }
  }

  onUserDisconnected = function() {
    return userId => {
      console.log('user disconnected', userId);
      if(this.peers.has(userId)){
        this.peers.get(userId).close()
        this.peers.delete(userId)
      }
      this.video.setParticipants(this.peers.size)
      this.video.removeVideoElement(userId)
    }
  }

  onPeerError = () => {
    return error => {
      console.error('error on peer!', error)
    }
  }

  onPeerConnectionOpened = () => {
    return (peer) => {
      const id = peer.id
      this.socket.emit('join-room', this.room, id)
    }
  }

  onPeerCallReceived = () => {
    return call => {
      call.answer(this.currentStream)
    }
  }

  onPeerStreamReceived = () => {
    return (call, stream) => {
      const callerId = call.peer
      if(this.peers.has(callerId)){
        return;
      }
      this.addVideoStream(callerId, stream)
      this.peers.set(callerId, call)
      this.video.setParticipants(this.peers.size)
    }
  }

  onPeerCallError = () => {
    return (call, error)=> {
      console.log('an call error ocurred', error);
      this.video.removeVideoElement(call.peer)
    }
  }

  onPeerCallClose = () => {
    return (call, error)=> {
      console.log('call closed', call.peer);
    }
  }
}