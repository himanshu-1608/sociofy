import React, {useState, useContext} from 'react';

import './Post.css';
import AuthContext from '../../context/auth-context';

const Post = props => {

    const [isLiked, setIsLiked] = useState(false);
    const auth = useContext(AuthContext);

    const addLike = async() => {
        console.log("adding like");
        const tempLike = await fetch(`http://localhost:5000/api/posts/like`,{
            method: "POST",
            headers: {
                authorization: auth.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pid: props.postData._id
            })
        });
        const tempStatus = await tempLike.json();
        console.log(tempStatus);
        setIsLiked(true);
    }

    const removeLike = async() => {
        console.log("removing like");
        const tempLike = await fetch(`http://localhost:5000/api/posts/like`,{
            method: "POST",
            headers: {
                authorization: auth.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pid: props.postData._id
            })
        });
        const tempStatus = await tempLike.json();
        console.log(tempStatus);
        setIsLiked(false);
    }

    return (
    <div id="Post">
        <div className="row">
            <div className="col l1">
                <img className="left circle center-align valign-wrapper" src={`${props.postData.creator.image}`} width="30px" height="30px" alt=""/>
            </div>
            <div className="col">
                <span id="post-user">
                    <strong>{props.postData.creator.name}</strong>
                </span>
            </div>
        </div>
        <div className="center-align">
            <img width="400px" height="400px"
            src={`http://localhost:5000/${props.postData.image}`} alt=""/>
        </div>
        <div className="row container">
            {!isLiked &&
            <div>
            <div className="col l1 left">
                <i onClick={addLike} className="like-btn red-text material-icons">favorite_border</i>
            </div>
            <div className="like-btn col l4 left"><strong>{props.postData.likers.length}</strong></div>
            </div>
            }
            {isLiked &&
            <div>
            <div onClick={removeLike} className="col l1 left">
                <i className="like-btn red-text material-icons">favorite</i>
            </div>
            <div className="like-btn col l4 left"><strong>{props.postData.likers.length+1}</strong></div>
            </div>
            }
            <div onClick={() => {
                props.showComments(props.index)}}>
                <div className="comment-btn col l4 right">
                    <strong>Comments</strong>
                </div>
                <div className="col l1 right offset-l1">
                    <i className="comment-btn black-text material-icons">comment</i>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Post;

/* */