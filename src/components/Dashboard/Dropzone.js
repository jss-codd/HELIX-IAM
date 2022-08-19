import React, {useCallback,useState} from 'react'

import ImageUploading from 'react-images-uploading';
import './dropzone.css'
import { Button, Modal,ModalBody,ModalHeader,ModalFooter} from 'reactstrap'


// import ModelComponent from '../Model'


function Dropzone({visible,setVisible}) {
 

  const [image, setImage] = useState(null);

  const onChangeImage = (imageList) => {
    setImage(imageList[0]);
  };

  const handleUploadImage = () => {
    const formData = new FormData();
    formData.append("file", image.file);
    const accessToken = localStorage.getItem("accessToken");
    fetch(`${process.env.REACT_APP_HELIX_SERVER_URL}/user/logo`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        console.log("------response----",response);
        if(response.status===200){
          window.location.reload()
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
    
    <Modal
      isOpen={visible}
      
    >
      <ModalHeader toggle={()=>setVisible(false)}>
       Upload Logo
      </ModalHeader>
      <ModalBody>
      <div >
        <div className="col-md-12">
          <ImageUploading
            value={image ? [image] : []}
            onChange={(e)=>onChangeImage(e)}
            maxNumber={1}
            dataURLKey="url"
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              // write your building UI
              <div
                style={{
                  width: "100%",
                  display:"flex",justifyContent:"center",alignItems:'center'
                }}
              >
                <button
                  className="p-2 image-button"
                  style={isDragging ? { color: "red" } : null}
                  onClick={() => onImageUpdate(0)}
                  {...dragProps}
                >
                  {imageList.length > 0 ? (
                    <img
                      src={imageList[0].url}
                      style={{ height: "100%", maxHeight: 150 }}
                      alt=""
                    />
                  ) : (
                    "Click or Drop here"
                  )}
                </button>
              </div>
            )}
          </ImageUploading>
        </div>
       
      </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={(e)=>handleUploadImage(e)}
        >
          Upload
        </Button>
        {' '}
        {/* <Button onClick={()=>setShowModel(false)}>
          No
        </Button> */}
      </ModalFooter>
    </Modal>
  </div>
  )
}

export default Dropzone