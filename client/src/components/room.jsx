import { useEffect } from 'preact/hooks';
import React from 'react';
import Bussiness from '../service/Bussiness';
import Video from '../service/Video';
import Media from '../service/Media';
import SocketBuilder from '../service/SocketBuilder';

export default function Room({ room }) {

  useEffect(() => {
    if (room) {
      const socketUrl = 'http://localhost:3000'
      const video = new Video()
      const media = new Media()
      const socket = new SocketBuilder({socketUrl})

      const deps = {
        video,
        media, 
        socket,
        room
      }
      Bussiness.initialize(deps)
    }
  }, [room])

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
