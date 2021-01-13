import React, {useState, useEffect, useContext} from 'react';

import './InfScroll.css';
import Post from "../Post/Post";
import CommentModal from "../CommentModal/CommentModal";
import AuthContext from '../../context/auth-context';

const InfScroll = props => {

    const auth = useContext(AuthContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [getCurrentPost, setCurrentPost] = useState(-1);
    const [isPost, setIsPost] = useState();
    const [posts, setPosts] = useState();

    const showComments = (index) => {
        setCurrentPost(index);
        setIsModalOpen(true);
        //console.log("showComments",getCurrentPost,isModalOpen);
    };

    const closeModal = () => {
        setCurrentPost(-1);
        setIsModalOpen(false);
    };

    let tempArray, postsArray;
    useEffect(() => {
      const doWork = async () => {
        tempArray = await fetch(`http://localhost:5000/api/posts/all`,{
            method: "GET",
            headers: {
              authorization: auth.token,
            }
          });
    
        postsArray = await tempArray.json();
        postsArray = postsArray.posts;
        setIsPost(true);
        console.log(postsArray);
        if(postsArray && postsArray.length>0) {
          const tempPost = postsArray.map((object,i) => <Post showComments={showComments} postData={object} index={i} key={i}/>);
          setPosts(tempPost);
        }
      }
      doWork();
    },[]);

    return (
        <div id="InfScroll" className="container">
        {isModalOpen && isPost &&
            <CommentModal postId={posts[getCurrentPost].props.postData._id} commentArray={posts[getCurrentPost].props.postData.comments} mainPic={posts[getCurrentPost].props.postData.image} closeModal={closeModal}/>
        }
        <div>
          {posts}
        </div>
        </div>
    );
};

export default InfScroll;