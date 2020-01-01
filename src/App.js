import React from 'react';
import './App.css';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'
import EventsPage from './pages/events'
import MainNavigation from './components/NavigationBar/mainNavigation'


function App() {
  return (
    <BrowserRouter >
    <MainNavigation/>
    <switch>
    <Redirect path='/' to='/events' exact/>
    <Route path='/events' component={EventsPage}/>
    </switch>
    </BrowserRouter>
  );
}

export default App;
