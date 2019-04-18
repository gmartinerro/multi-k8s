import React, { Component } from 'react';
import {BrowserRouter, Route, Link} from 'react-router-dom';
import logo from './logo.svg';
import Fib from './Fib';
import OtherPage from './OtherPage';
import './App.css';

class App extends Component {
  render() {
    return (

      <div className="App">
        <BrowserRouter>
          <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo'/>
          <h1 className='App-title'>Fib calculator V3</h1>
          <Link className='App-link' to='/'>Home</Link>
          <Link className='App-link' to='/otherpage'>Other Page</Link>
          </header>
          <Route exact path='/' component={Fib}></Route>
          <Route path='/otherpage' component={OtherPage}></Route>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
