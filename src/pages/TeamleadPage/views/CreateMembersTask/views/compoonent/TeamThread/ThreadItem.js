import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { FaRegComments } from 'react-icons/fa';
import { testThreadsToWorkWith } from "../../../../../../../utils/testData";
import Comment from '../../../../../../CandidatePage/views/TeamsScreen/components/addComment';
import ThreadComment from './ThreadComment';
import Modal from './Modal';
import { featchAllComment } from '../../../../../../../services/teamleadServices';
import { useParams } from 'react-router-dom';

const Wrapper = styled.div`
display: flex;
flex-direction: column;
align-items: left !important;


.outside-containre{
    width: 80%;
    margin: auto;
}
.header-items {
    display: flex;
    width: 20rem;
    justify-content: space-around;
    margin-top: 1rem;
}

.team-screen-threads {
    width: 80%;
    margin: auto;
    padding: 50px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  
  .team-screen-threads-card {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
  }
  
  .team-screen-threads-details {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2% 3%;
  }
  
  .team-screen-threads-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    line-height: 2rem;
  }
  
  .team-screen-threads-container p {
    font-size: 1rem;
    /* font-weight: 600; */
    color: #000;
  }
  
  .team-screen-threads-progress {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 1rem;
  }
  
  .progress {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0.3rem;
  }
  
  .progress p {
    font-size: 0.8rem;
    font-weight: 600;
  }

  .threads-created{
    background-color: #005734;
    width: 50%;
    height: 50%;
    padding: 1rem;
    border-radius: 50%;
    cursor: pointer;

  }
  
  .threads-progress {
    width: 40%;
    height: 40%;
    background-color: red;
    padding: 1rem;
    border-radius: 50%;
    cursor:pointer;
  }
  
  .comments-section {
    cursor: pointer;
  }
  
  .comments {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .comments span {
    font-size: 0.8rem;
    font-weight: 600;
    color: #838383;
  }
  
  .comments-section svg {
    font-size: 1.8rem;
  }

  /* Styling for the image hover effect */
.image-container {
  position: relative;
  cursor: pointer;
}

.image-container img {
  width: 100%;
  height: auto;
}

.view-btn-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.image-container:hover .view-btn-container {
  opacity: 1;
}

.view-btn {
  padding: 8px 16px;
  background-color: #005734;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

// /* Styling for the modal */
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  position: relative;
  max-width: 80%;
  max-height: 80%;
}

.modal-content img {
  width: 100%;
  height: auto;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px;
  background-color: #005734;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

  
`

const ThreadItem = () => {
  const { id } = useParams();
  console.log(id);
  const [threads, setThreads] = useState([]);
  const [showComment, setShowComment] = useState(false);
  const [showModalStates, setShowModalStates] = useState({});

  // Function to handle opening the modal for a specific thread
  const handleImageClick = (threadId) => {
    setShowModalStates((prevShowModalStates) => ({
      ...prevShowModalStates,
      [threadId]: true,
    }));
  };

  // Function to handle opening the modal for a specific thread
  const handlCommentClick = (threadId) => {
    setShowComment((prevShowModalStates) => ({
      ...prevShowModalStates,
      [threadId]: !prevShowModalStates[threadId], // Toggle the value for the specific threadId
    }));
  };

  // Function to handle closing the modal for a specific thread
  const handleClose = (threadId) => {
    setShowModalStates((prevShowModalStates) => ({
      ...prevShowModalStates,
      [threadId]: false,
    }));
  };

  //Fetch all comments
  const fetchComment = async (id) => {
    try {
      const response = await featchAllComment(id);
      console.log(response);
      console.log('Comment created successfully:', response.data);
      // Do something with the responseData if needed.
    } catch (error) {
      console.error('Failed to create comment:', error.message);
      // Handle the error or display an error message to the user.
    }
  }

  useEffect(() => {
    fetchComment();
  }, [id])

  const handleSubmit = () => { };

  return (
    <Wrapper>
      <div className="team-screen-threads">
        <div className="team-screen-thread-container">
          {testThreadsToWorkWith.map((thread) => (
            <div className="team-screen-threads-card" key={thread._id}>
              <div className="thread-card">
                {console.log(thread)}
                {showModalStates[thread._id] && (
                  <Modal imageUrl={thread.image} handleClose={() => handleClose(thread._id)} />
                )}
                <div className="image-container">
                  {thread.image && (
                    <img src={thread.image} alt="thread" onClick={() => handleImageClick(thread._id)} />
                  )}
                  {thread.image && (
                    <div className="view-btn-container">
                      <button className="view-btn" onClick={() => handleImageClick(thread._id)}>
                        View
                      </button>
                    </div>
                  )}
                </div>

                <div className="team-screen-threads-container">
                  <p>{thread.thread}</p>
                  <div>
                    <p>Assigned to : Team Development A</p>
                    <p>Raised by : {thread.created_by}</p>
                  </div>
                  <div className="team-screen-threads-progress">
                    <div className="progress">
                      <p>Created</p>
                      <div className="threads-progress"></div>
                    </div>
                    <div className="progress">
                      <p>In progress</p>
                      <div className="threads-progress"></div>
                    </div>
                    <div className="progress">
                      <p>Completed</p>
                      <div className="threads-progress"></div>
                    </div>
                    <div className="progress">
                      <p>Resolved</p>
                      <div className="threads-progress"></div>
                    </div>
                  </div>
                  <div className="comments-section">
                    <p className="comments">
                      <FaRegComments onClick={handleSubmit} />
                      &bull;
                      <span onClick={() => handlCommentClick(thread._id)}>10 Comments</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="comment-action">
                {
                  showComment[thread._id] && (
                    <ThreadComment
                      comments={thread.comments[0].comment}
                      user={thread.comments[0].user}
                      threadId={thread._id}
                      document_id={id}
                      commentInput="comment-input"
                    />
                  )
                }

                {/* <ThreadComment
                  text={text}
                  handleChange={handleChange}
                  comments={thread.comments[0].comment}
                  user={thread.comments[0].user}
                  commentInput="comment-input"
                /> */}
              </div>
            </div>

          ))}
        </div>
      </div>
    </Wrapper>


  )
}

export default ThreadItem;
