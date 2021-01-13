import React, {useState, useContext, useEffect} from 'react';

import './CommentModal.css';
import AuthContext from '../../context/auth-context';

const CommentModal = props => {

  const auth = useContext(AuthContext);
  const [comments, setComments] = useState();
  const [isComment, setComment] = useState(false); 
  const [message, setMessage] = useState();
  const [btnClass, setbtnClass] = useState('red');

  const messageChangeHandler = (e) => {
    setMessage(e.target.value);
    if(e.target.value.trim().length===0) {
      setbtnClass('red');
    } else {
      setbtnClass('blue');
    }
  }

  let tempReply;
  const submitCommentHandler = async() => {
    if(message && message.length>0) {
      tempReply = await fetch('http://localhost:5000/api/comments/add',{
        method: "POST",
        headers: {
          authorization: auth.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          pid: props.postId
        })
      });
      const tempo = await tempReply.json();
      console.log(tempo);
      
    } else return;
  }

  useEffect(()=>{
    if(props.commentArray.length>0) {
      const tempComments = props.commentArray.map((comment, i)=>{
        console.log(comment);
        return(
        <div className="grey darken-4" id="comment" key={i}>
          <div className="grey-text">
            <strong>{comment.creatorName}</strong>
          </div>
          <div className="grey-text">
            {comment.message}
          </div>
        </div>
      )});
      setComments(tempComments);
      setComment(true);
    }
  },[]);

    return (
      <div id="comment-modal">
        <i onClick={props.closeModal} className="material-icons white-text small" id="modal-close">close</i>
        <div className="center-align">
        <img height="400px" src={`http://localhost:5000/${props.mainPic}`} alt="Main Post Pic"></img>
        </div>
        <div className="row" id="parent-comment-post">
          <div className="col l10" >
            <input onChange={messageChangeHandler} type="text" className="blue-text"/>
          </div>
          <div>
            <button onClick={submitCommentHandler} className={`black-text darken ${btnClass}`} id="post-comment-btn"><strong>POST</strong></button>
          </div>
        </div>
        {isComment &&
        <div>
          {comments}
        </div>
        }

      </div>
    );
};

export default CommentModal;