import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import './App.css';
import NavBar from "./components/shared/NavBar/NavBar";
import InfScroll from "./components/InfScroll/InfScroll";
import UserProfile from "./components/UserProfile/UserProfile";
import ImageUpload from "./components/ImageUpload/ImageUpload";
import AuthContext from './context/auth-context';
import AuthPage from './components/AuthPage/AuthPage';

const App = () => {

  const [isLoggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState();
  const [userName, setUserName] = useState();
  
  let checkToken, checkUserName;
  useEffect(() => {
    checkToken = localStorage.getItem('userToken');
    checkUserName = localStorage.getItem('userName');
    if(checkToken && checkToken.length > 0) {
      login(checkToken, checkUserName);
    }
  },[]);

  const login = useCallback((token, userName) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userName', userName);
    setLoggedIn(true);
    setToken(token);
    setUserName(userName);
  },[]);

  const logout = useCallback(() => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    setLoggedIn(false);
    setToken();
    setUserName();
  },[]);

  const loggedRoutes = (
    <Switch>
      <Route path="/" exact>
        {isLoggedIn && <InfScroll /> }
        {!isLoggedIn && <AuthPage /> }
      </Route>
      <Route path="/addPost" exact>
        <ImageUpload />
      </Route>
      <Route path="/profile/:userName">
        <UserProfile />
      </Route>
      <Route path="/signout" exact>
        <a href="#" onClick={logout} >Log out </a>
      </Route>
      <Redirect to="/" />
    </Switch>
  );

  return (
    <AuthContext.Provider value={{
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
        token: token,
        userName: userName}}>
      <div>
        <NavBar />
        <div id="content-router">
          <Router>
            <main>
              {isLoggedIn && loggedRoutes}
              {!isLoggedIn && <AuthPage />}
            </main>
          </Router>
        </div>
      </div>
      </AuthContext.Provider>
  );
}

export default App;