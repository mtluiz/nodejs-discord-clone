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
    this.currentStream = await this.media.getCamera(false)
    this.socket = this.socketBuilder
                    .setUserConnected(this.onUserConnected())
                    .setUserDisconnected(this.onUserDisconnected())
                    .build()
    
    this.currentPeer = await this.peerBuilder
        .setOnError(this.onPeerError())
        .setOnConnectionOpened(this.onPeerConnectionOpened())
        .setOnCallReceived(this.onPeerCallReceived())
        .setOnPeerStreamReceived(this.onPeerStreamReceived())
        .build()

    this.addVideoStream('test01')
  }

  addVideoStream(userId, stream = this.currentStream, muted){
    this.video.renderVideo({
      userId,
      stream,
      isCurrentId: false
    })
  }

  onUserConnected = function(){
    return userId => {
      console.log('user connected', userId);
      this.currentPeer.call(userId, this.currentStream)
    }
  }

  onUserDisconnected = function() {
    return userId => {
      console.log('user disconnected', userId);
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
      console.log('peer', peer);
      this.socket.emit('join-room', this.room, id)
    }
  }

  onPeerCallReceived = () => {
    return call => {
      console.log('a');
      console.log('answering call', call);
      call.answer(this.currentStream)
    }
  }

  onPeerStreamReceived = () => {
    return (call, stream) => {
      const callerId = call.peer
      this.addVideoStream(callerId, stream)
      this.peers.set(callerId)
      this.video.setParticipants(this.peers.size)
    }
  }
}