import sleep from '../utils/sleep';

export default class Video {
  constructor() { }
  createVideoElement({ muted, src, srcObject }) {
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

  renderVideo({ userId, stream = null, url = null, isCurrentId = false}) {
    const video = this.createVideoElement({ src: url, srcObject: stream, muted: isCurrentId })
    this.appendToHtmlTree(userId, video, isCurrentId)
  }

  appendToHtmlTree(userId, video, isCurrentId) {
    const div = document.createElement('div')
    div.id = userId
    div.classList.add('wrapper')
    div.append(video)
    const div2 = document.createElement('div')
    div2.classList.add('title-name') 
    div2.innerText = isCurrentId ? 'Vosse' : userId
    div.append(div2)

    const videoGrid = document.getElementById('videogrid')
    videoGrid.append(div)
  }

  setParticipants(count) {
    const myself = 1
    const participants = document.getElementById('participants')
    participants.innerHTML = count + myself;
  }

  removeVideoElement(id) {
    const element = document.getElementById(id)
    element.remove()
  }
}