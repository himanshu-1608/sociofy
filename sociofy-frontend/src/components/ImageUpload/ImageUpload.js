import React, {useRef, useState, useEffect, useContext} from 'react';

import './ImageUpload.css';
import AuthContext from '../../context/auth-context';

const ImageUpload = props => {

  const auth = useContext(AuthContext);
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [posted, setPosted] = useState(false);

  useEffect(()=> {
    if(!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.addEventListener("load", function () {
      setPreviewUrl(fileReader.result);
    }, false);
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = event => {
    let pickedFile;
    if(event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      return;
    }
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const submitPostHandler = async(e) => {
    e.preventDefault();
    console.log("working front");
    let postData;
    const formData = new FormData();
    formData.append('image', file);
    try{
      postData = await fetch('http://localhost:5000/api/posts/create',{
                    method: 'POST',
                    headers: { 
                      authorization: auth.token,
                    },
                    body: formData
                });
      const temp = await postData.json();
      console.log(temp);
      setPosted(true);
    } catch(e) {
      console.log("Error occured");
    }
  };

  return (
      <React.Fragment>
      {posted && 
      <h3 className="center-align blue-text">Post Created Successfully!!! <br />Watch your post <a className="purple-text" href={`/profile/${auth.userName}`}>here</a></h3>
      }
      {!posted &&
      <form onSubmit={submitPostHandler}>
      <div>
        <div>
          <input type="file" accept=".jpg,.png,.jpeg" ref={filePickerRef}
          style={{display:"none"}} onChange={pickedHandler} />
        </div>
        <div className="preview-wrapper container">
          {previewUrl &&
          <img src={previewUrl} alt="Preview" width="550px" height="550px" />
          }
          {!previewUrl &&
            <h2 id="preview-text">Preview Here</h2>
          }
          </div>
        <div className="container center-align">
          <button type="button" className="image-picker-btn blue"
          onClick={pickImageHandler} >Pick an Image</button>
          {previewUrl &&
          <button type="submit" className="image-picker-btn blue"
          >Upload</button>
          }
        </div>
      </div>
    </form>
    }
      </React.Fragment>
    );
};

export default ImageUpload;