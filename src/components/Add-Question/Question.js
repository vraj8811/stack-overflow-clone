import React, { useState } from 'react'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import './Question.css'
import { TagsInput } from "react-tag-input-component";

const Question = () => {
    
    const [tag, setTag] = useState([]);
    return (
        <div className="add-question">
            <div className="add-question-container">
                <div className="head-title">
                    <h1>Ask a public question</h1>
                </div>
                <div className="question-container">
                    <div className="question-options">

                        <div className="question-option">
                            <div className="title">
                                <h3>Title</h3>
                                <small>Be specific and imaging you're asking a question to another person</small>
                                <input type='text' placeholder='Add Question Title' />
                            </div>
                        </div>

                        <div className="question-option">
                            <div className="title">
                                <h3>Body</h3>
                                <small>Include all the information someone would need to answer your question</small>
                                <ReactQuill className='react-quill' theme='snow'/>
                            </div>
                        </div>

                        <div className="question-option">
                        <div className="title">
                                <h3>Tags</h3>
                                <small>Add up to 5 tags to describe what your question is about</small>
                                <TagsInput value={tag} onChange={setTag} name="fruits" placeHolder="Press enter to add new tag"/>
                            </div>
                        </div>

                    </div>
                </div>
                <button className='button'>Add your question</button>
            </div>
        </div>
    )
}

export default Question;
