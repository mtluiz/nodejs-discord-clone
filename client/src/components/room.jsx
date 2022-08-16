import { useEffect } from 'preact/hooks';
import React from 'react';
import Bussiness from '../service/Bussiness';
import Video from '../service/Video';
import Media from '../service/Media';
import SocketBuilder from '../service/SocketBuilder';
import PeerBuilder from '../service/Peer';

export default function Room({ room }) {

  useEffect(() => {
    if (room) {
      const socketUrl = 'https://stormy-taiga-93430.herokuapp.com/'
      const video = new Video()
      const media = new Media()
      const socketBuilder = new SocketBuilder({socketUrl})
      const peerConfig = Object.values({
        id: undefined,
        config: {
          port: 9000,
          secure: true,
          host: 'aqueous-bastion-00372.herokuapp.com'
        }
      })
      const peerBuilder = new PeerBuilder({peerConfig})

      const deps = {
        video,
        media, 
        socketBuilder,
        peerBuilder,
        room
      }
      Bussiness.initialize(deps)
    }
  }, [room])

  return (
    <div className='room'>

      <header> 
        <div style={{display: 'flex', alignItems: "center"}}><div className='hashtag'>#</div>{room ? `room ID: ${room}` : `Welcome`}</div>
        <h1>Participants: <span id="participants">1</span></h1>
      </header>

      <main className='video-room'>
        <div id='videogrid'></div>
      </main>

      <footer>
        <input type="text" className='chat' placeholder='Message #general' />
      </footer>

    </div>
  )
}
