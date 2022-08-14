import { useState } from 'preact/hooks'
import Sidebar from './components/sidebar'
import Room from './components/room';
import Router from 'preact-router';
import './app.css';

export function App() {

  return (
    <main className='discord'>
        <Sidebar />
        <Router>
          <Room path="/" />  
        </Router>
    </main>
  )
}
