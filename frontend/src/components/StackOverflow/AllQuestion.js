import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '@mui/material';
import './CSS/AllQuestion.css';

const AllQuestion = () => {
  return (
    <div className="all-questions">
        <div className="all-questions-container">
            <div className="all-questions-left">

                <div className="all-options">

                    <div className="all-option">
                        <p>0</p>
                        <span>Votes</span>
                    </div>
                    
                    <div className="all-option">
                        <p>0</p>
                        <span>Answers</span>
                    </div>

                    <div className="all-option">
                        <p>0</p>
                        <small>0 Views</small>
                    </div>
                </div>

            </div>

            <div className="question-answer">
                <Link to='/question'>This is question Title</Link>

                <div style={{width:"90%"}}>
                    <div>This is Answer.</div>
                </div>

                <div style={{
                    display: 'flex'
                }}>
                    <span className='question-tags'>react</span>
                    <span className='question-tags'>ant</span>
                    <span className='question-tags'>frontend</span>

                </div>

                <div className="author">

                    <small>Timestmp</small>
                    <div className="auth-details">
                        <Avatar/>
                        <p>User name</p>
                    </div>

                </div>

            </div>

        </div>
    </div>
  )
}

export default AllQuestion
