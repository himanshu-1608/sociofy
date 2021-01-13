import React, {useState, useContext} from 'react';

import './AuthPage.css';
import AuthContext from '../../context/auth-context';

const AuthPage = props => {
    const [loginMode, setLoginMode] = useState(false);
    const [userName, setUserName] = useState();
    const [userEmail, setUserEmail] = useState();
    const [userPassword, setUserPassword] = useState();
    const [authError, setAuthError] = useState();

    const auth = useContext(AuthContext);
    const submitAuthHandler = async(e) => {
        e.preventDefault();
        let authData;
        try {
            if(loginMode) {
                authData = await fetch('http://localhost:5000/api/auths/login',{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: userEmail,
                        password: userPassword
                    })
                });
                if(authData.ok) {
                    authData = await authData.json();
                    auth.login(authData.token, authData.userName);
                } else {
                    authData = await authData.json();
                    setAuthError(authData.message);
                }
            } else {
                authData = await fetch('http://localhost:5000/api/auths/signup',{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: userName,
                        email: userEmail,
                        password: userPassword
                    })
                });
                if(authData.ok) {
                    authData = await authData.json();
                    auth.login(authData.token, authData.userName);
                } else {
                    authData = await authData.json();
                    setAuthError(authData.message);
                }
            }
        } catch(e) {
            console.log(e);
        }
    };

    const nameChangeHandler = (e) =>{
        setUserName(e.target.value);
    };
    const emailChangeHandler = (e) =>{
        setUserEmail(e.target.value);
    };
    const passwordChangeHandler = (e) =>{
        setUserPassword(e.target.value);
    };

    const flipModes = (e) =>{
        e.preventDefault();
        setLoginMode(!loginMode);
    };
    return (
        <div>
            <h2 className="center-align light-blue-text">Welcome to Sociofy</h2>
            <h5 className="center-align pink-text">Upload photos, follow your inspirational personalities, see what's happenin' in their life and talk to people<br /><br /><strong>Join Today</strong>
            </h5>
            <form onSubmit={submitAuthHandler} className="center-align">
                {!loginMode &&
                <div className="input-field input_wrapper">
                    <i className="material-icons prefix">account_circle</i>
                    <input onChange={nameChangeHandler} id="user_name" type="text"
                    className="cyan-text" required/>
                    <label htmlFor="user_name">User Name</label>
                </div>
                }
                <div className="input-field input_wrapper">
                    <i className="material-icons prefix">email</i>
                    <input onChange={emailChangeHandler} id="user_email" type="email"
                    className="cyan-text" required/>
                    <label htmlFor="user_email">Email</label>
                </div>
                <div className="input-field input_wrapper">
                    <i className="material-icons prefix">lock</i>
                    <input onChange={passwordChangeHandler} id="user_password" type="password" className="cyan-text" required/>
                    <label htmlFor="user_password">Password</label>
                </div>
                {authError && authError.length>0 &&
                <div className="purple darken-4 red-text" id="auth-error">
                    {authError}
                </div>
                }
                {loginMode &&
                <React.Fragment>
                    <button className="cyan" id="submit-auth-btn" type="submit">Log into the virtual world</button>
                    <h6 className="cyan-text">Wanna create a new account?</h6>
                    <div onClick={flipModes} style={{cursor: "pointer"}} className="black-text">
                Sign Up here</div>
                </React.Fragment>
                }
                {!loginMode &&
                <React.Fragment>
                    <button className="cyan" id="submit-auth-btn" type="submit">Start Your Journey</button>
                    <h6 className="cyan-text">Already have an account?</h6>
                    <div onClick={flipModes} style={{cursor: "pointer"}} className="black-text">
                    Login here</div>
                </React.Fragment>
                }
            </form>
        </div>
    );
};

export default AuthPage;