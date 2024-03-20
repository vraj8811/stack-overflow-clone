import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
} from "react-router-dom";
import Auth from "./components/Auth";
import StackOverflow from "./components/StackOverflow";
import ViewQustion from "./components/ViewQuestions";
import Question from './components/Add-Question/Question';

function App() {
  return (
    <div className="App">
      <Router>
        <Header/>
        <Routes>
          <Route exact path='/auth' Component={Auth}/>
          <Route exact path='/' Component={StackOverflow}/>
          <Route exact path='/ask-question' Component={Question}/>
          <Route exact path='/question' Component={ViewQustion}/>
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
