import React from 'react'
import { Button, Modal,ModalBody,ModalHeader,ModalFooter} from 'reactstrap'

const ModelComponent = ({showModel,setShowModel ,handleDelete,delUser,heading}) => {
  return (
    <div>
    
    <Modal
      isOpen={showModel}
      
    >
      <ModalHeader toggle={()=>setShowModel(false)}>
        Delete {heading}
      </ModalHeader>
      <ModalBody>
       Are you sure to delete this {delUser} ?
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={()=>handleDelete()}
        >
          Yes
        </Button>
        {' '}
        <Button onClick={()=>setShowModel(false)}>
          No
        </Button>
      </ModalFooter>
    </Modal>
  </div>
  )
}

export default ModelComponent