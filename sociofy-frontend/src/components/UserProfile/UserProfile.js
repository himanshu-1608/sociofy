import React, {useState, useContext, useEffect } from 'react';
import { useParams} from 'react-router-dom';

import './UserProfile.css';

import AuthContext from '../../context/auth-context';

const UserProfile = props => {
  const auth = useContext(AuthContext);
  
  const [authError, setAuthError] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [userPosts, setUserPosts] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [myProfile, setMyProfile] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [userSuggests, setUserSuggests] = useState(false);

  const user_param = useParams().userName;

  let tempFriend, suggestArray;

  const addFriendHandler = async() => {
    tempFriend = await fetch(`http://localhost:5000/api/users/friends/change`,{
            method: "POST",
            headers: {
              authorization: auth.token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              friendId : userId,
              decision: "add"
            })
          });
    
    const val = await tempFriend.json();
    setIsFriend(true);
  };

  const removeFriendHandler = async() => {
    tempFriend = await fetch(`http://localhost:5000/api/users/friends/change`,{
            method: "POST",
            headers: {
              authorization: auth.token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              friendId : userId,
              decision: "remove"
            })
          });
    
    const val = await tempFriend.json();
    setIsFriend(false);
  };

  let userData;
  useEffect(()=>{
    const findUserData = async() =>{
      userData = await fetch(`http://localhost:5000/api/users/${user_param}`,{
        headers:{
          authorization: auth.token
        }
      });
      if(userData.ok) {
        const userJson = await userData.json();
        //console.log(userJson);
        setUserName(userJson.user.name);
        setUserId(userJson.user.id);
        if(userJson.user.id===userJson.myId) {
          setMyProfile(true);
        } else {
          setMyProfile(false);
          const tempFriend = await fetch(`http://localhost:5000/api/users/friends/check`,{
            method: "POST",
            headers: {
              authorization: auth.token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              friendId : userJson.user.id
            })
          })
          const val = await tempFriend.json();
          setIsFriend(val.val);
        }
        setUserPosts(userJson.user.posts);
        setUserFriends(userJson.user.friends);
      } else {
        userData = await userData.json();
        setAuthError(userData.message);
      }
    };
    const findFriendSuggestions = async() => {
      const friendSuggestions = await fetch('http://localhost:5000/api/users/friends/suggestion',{
        method: "GET",
        headers: {
          authorization: auth.token
        }
      });
      let tempFriendList = await friendSuggestions.json();
      tempFriendList = tempFriendList.suggestedUsers;
      suggestArray = tempFriendList.map((object, i)=> {
        return ( 
        <div className="col l4" key={i}>
          <div className="card">
            <div className="card-image">
              <img src={object.image}/>
              <a className="btn-floating halfway-fab waves-effect waves-light red"><i className="material-icons">add</i></a>
            </div>
        <div className="card-content blue lighten-2">
        <a href={`/profile/${object.name}`} className="black-text card-title center-align">{object.name}
        </a>
          <p>Random Description of every user</p>
        </div>
      </div>
        </div>
        )
      });
      setUserSuggests(suggestArray);
    }
    findUserData();
    findFriendSuggestions();
  },[]);
    return (
      <div>
      <div id="user-profile">
        <img id="usr-img" src="https://cdn.auth0.com/blog/react-js/react.png" className="circle" height="300px" alt="User Profile"/>
        <h4 className="center-align blue-text">
          <strong>{userName}</strong>
        </h4>
        {myProfile &&
          <div className="blue"
            style={{padding: '10px', borderRadius: '10px'}}>
            <p>Super simple bio with some random words. Super simple bio with some other words</p>
            <a href="#" className="purple-text  text-darken-4 left-align"><i className="material-icons black-text left">edit</i><strong>Edit Profile</strong></a>
            <a href="/" onClick={auth.logout} className="purple-text  text-darken-4  right"><i className="material-icons black-text right">exit_to_app</i><strong>Sign Out</strong></a>
          </div>
        }
        <h6 className="white-text center-align">
          {userFriends.length} friend(s) right now
        </h6>
        {!myProfile && isFriend &&
          <div onClick={removeFriendHandler} className="center-align red lighten-2" id="friend-btn">
            <strong>Remove Friend</strong>
          </div>
        }
        {!myProfile && !isFriend &&
          <div onClick={addFriendHandler} className="center-align green lighten-2" id="foe-btn">
            <strong>Add Friend</strong>
          </div>
        }
      </div>
      <div className="container blue-text">
        <h3>Friend Recommendations</h3>
      </div>
      <div className="container row">
        {userSuggests}
      </div>
      </div>   
    )
};

export default UserProfile;