import { useEffect } from 'preact/hooks';
import React from 'react'

export default function Room({ room }) {

  useEffect(() => {
    if (room) {
      const video = new Video()
      const media = new Media()
      const deps = {
        video,
        media, 
        room
      }
      Bussiness.initialize(deps)
    }
  }, [])

  return (
    <div className='room'>
      <header> <div className='hashtag'>#</div>{room ? `room ${room}` : `general`}</header>

      <main>
        <h1>cam space</h1>
        <div id='videogrid'></div>
      </main>

      <footer>
        <input type="text" className='chat' placeholder='Message #general' />
      </footer>
    </div>
  )
}

class Video {
  constructor() { }
  createVideoElement({ muted = true, src, srcObject }) {
    const video = document.createElement('video');
    video.muted = muted
    video.src = src
    video.srcObject = srcObject
    if (src) {
      video.controls = true
      video.loop = true
      sleep(200).then(() => video.play());
    }
    if (srcObject) {
      video.addEventListener('loadedmetadata', () => video.play());
    }
    return video
  }

  renderVideo({ userId, stream = null, url = null, isCurrentId = false }) {
    const video = this.createVideoElement({ src: url, srcObject: stream })
    this.appendToHtmlTree(userId, video, isCurrentId)
  }

  appendToHtmlTree(userId, video, isCurrentId) {
    const div = document.createElement('div')
    div.id = userId
    div.classList.add('wrapper')
    div.append(video)
    const div2 = document.createElement('div')
    div2.innerText = isCurrentId ? '' : userId
    div.append(div2)

    const videoGrid = document.getElementById('videogrid')
    videoGrid.append(div)
  }
}

class Media {
  async getCamera(audio = false, video = true) {
    return navigator.mediaDevices.getUserMedia({
      video,
      audio
    })
  }
}

class Bussiness {
  constructor({ room, media, video }) {
    this.media = media
    this.room = room
    this.video = video

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
}

const sleep = (time) => {
  return new Promise(r => setTimeout(r, time))
}