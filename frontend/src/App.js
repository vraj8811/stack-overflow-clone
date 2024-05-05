import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Auth from "./components/Auth";
import StackOverflow from "./components/StackOverflow";
import Profile from "./components/Profile";
import ViewQustion from "./components/ViewQuestions";
import Question from './components/Add-Question/Question';
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./features/userSlice";
import { useEffect } from "react";
import { auth } from "./firebase";
import { Toaster } from 'react-hot-toast';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          displayName: authUser.displayName,
          email: authUser.email
        }));
      }
      else {
        dispatch(logout());
      }
    })
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <Header />
        <Toaster/>
        <Routes>
          <Route exact path='/auth' Component={Auth} />
          <Route exact path='/' Component={StackOverflow} />
          <Route exact path='/ask-question' Component={Question} />
          <Route exact path='/question' Component={ViewQustion} />
          <Route exact path='/profile' Component={Profile} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
