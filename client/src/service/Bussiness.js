export default class Bussiness {
  constructor({ room, media, video, socket }) {
    this.media = media
    this.room = room
    this.video = video
    this.socket = socket
                    .setUserConnected(this.onUserConnected())
                    .setUserDisconnected(this.onUserDisconnected())
                    .build()

    this.socket.emit('join-room', this.room, 'teste-01')
    this.currentStream = {}
  }

  static initialize(deps) {
    const instance = new Bussiness(deps)
    return instance.#init()
  }

  async #init() {
    this.currentStream = await this.media.getCamera()
    this.addVideoStream('test01')
  }

  addVideoStream(userId, stream = this.currentStream){
    this.video.renderVideo({
      userId,
      stream,
      isCurrentId: false
    })
  }

  onUserConnected = function(){
    return userId => {
      console.log('user connected', userId);
    }
  }

  onUserDisconnected = function() {
    return userId => {
      console.log('user disconnected', userId);
    }
  }
}