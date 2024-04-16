import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '@mui/material';
import './CSS/AllQuestion.css';
import ReactHtmlParser from 'react-html-parser';

const AllQuestion = (question) => {
    let tags = JSON.parse(question.questions?.tags[0]);

    function truncate(str, n) {
        return str?.length > n ? str.substr(0, n - 1) + "..." : str;
      }

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
                            <p>{question?.questions?.answerDetails.length}</p>
                            <span>Answers</span>
                        </div>

                        <div className="all-option">
                            <p>0</p>
                            <small>0 Views</small>
                        </div>
                    </div>

                </div>

                <div className="question-answer">
                    <Link to={`/question?q=${question?.questions._id}`}>{question.questions?.title}</Link>

                    <div style={{ width: "90%" }}>
                        <div>{ReactHtmlParser(truncate(question.questions?.body,200)) }</div>
                    </div>

                    <div style={{
                        display: 'flex'
                    }}>
                        {tags.map((_tag) => (
                            <p
                                style={{
                                    margin: "10px 5px",
                                    padding: "5px 10px",
                                    backgroundColor: "#007cd446",
                                    borderRadius: "3px",
                                }}
                            >
                                {_tag}
                            </p>
                        ))}
                    </div>

                    <div className="author">
                        <small>{new Date(question.questions.created_at).toLocaleString()}</small>
                        <div className="auth-details">
                            <Avatar src={question?.questions?.user?.photo} />
                            <p>{question?.questions?.user?.displayName ? question?.questions?.user?.displayName : String(question?.questions?.user?.email).split('@')[0]}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllQuestion
