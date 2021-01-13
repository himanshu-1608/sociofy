import React, { useContext } from 'react';

import './NavBar.css';
import AuthContext from './../../../context/auth-context';

const NavBar = props => {

  const auth = useContext(AuthContext);

    return (
        <nav className="light-blue darken-4">
        <div className="nav-wrapper container">
          <a href="/" className="brand-logo">
            <i id="app-icon" className="large material-icons left">face</i>
            <strong>Sociofy</strong>
            <span id="sub-title">where destinations meet...</span>
          </a>
          {auth.isLoggedIn &&
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><a href="/"><i className="material-icons">home</i></a></li>
            <li><a href="/addPost"><i className="material-icons">add_a_photo</i></a></li>
            <li><a href={`/profile/${auth.userName}`}><i className="material-icons">account_circle</i></a></li>
          </ul>
          }
        </div>
      </nav>
    )
};

export default NavBar;