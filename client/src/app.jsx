import { useState } from 'preact/hooks'
import Sidebar from './components/sidebar'
import Room from './components/room';
import Router from 'preact-router';
import Home from './components/home';
import './app.css';

export function App() {

  return (
    <main className='discord'>
        <Sidebar />
        <Router>
          <Home path="/" />
          <Room strict path="/room" key={new Date().getTime()} /> 
        </Router>
    </main>
  )
}
