import React, { useState } from 'react'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import './Question.css'
import { TagsInput } from "react-tag-input-component";
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { selectUser } from "../../features/userSlice";
import axios from 'axios';
//import { Delta } from 'quill';

const Question = () => {

    const [tag, setTag] = useState([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);
    const user = useSelector(selectUser);
    const navi = useNavigate();

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean'],
            ['code-block']
        ]
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'link', 'image', 'video', 'code-block'
    ];


    const handleQuill = (value) => {
        setBody(value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (title !== '' && body !== '' && user) {
            const data = {
                title: title,
                body: body,
                tag: JSON.stringify(tag),
                user: user,
            }

            await axios.post('/api/question', data).then((res) => {
                alert('Question Added Successfully');
                setLoading(false);
                setTitle('');
                setBody('');
                setTag([]);
                navi('/');
            }).catch((err) => {
                alert('Something went wrong, Please try again later');
                setTitle('');
                setBody('');
                setTag([]);
                setLoading(false);
                console.log(err);
            });
        }
    }


    return (
        <>
            {
                user ? (<div className="add-question">
                    <div className="add-question-container">
                        <div className="head-title">
                            <h1>Ask a public question</h1>
                        </div>
                        <div className="question-container">
                            <div className="question-options">

                                <div className="question-option">
                                    <div className="title" style={{ justifyContent: "space-between" }}>
                                        <h3>Title</h3>
                                        <small>Be specific and imaging you're asking a question to another person</small>
                                        <input value={title} onChange={(e) => { setTitle(e.target.value) }} type='text' placeholder='Add Question Title' />
                                    </div>
                                </div>

                                <div className="question-option">
                                    <div className="title">
                                        <h3>Body</h3>
                                        <small>Include all the information someone would need to answer your question</small>
                                        <ReactQuill value={body} onChange={handleQuill} modules={modules} formats={formats} className='react-quill' theme='snow' />
                                    </div>
                                </div>

                                <div className="question-option">
                                    <div className="title">
                                        <h3>Tags</h3>
                                        <small>Add up to 5 tags to describe what your question is about</small>
                                        <TagsInput value={tag} onChange={setTag} name="fruits" placeHolder="Press enter to add new tag" />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <button type='submitt' onClick={handleSubmit} className='button'>
                            {loading ? 'Adding Qestions...' : 'Add your question'}</button>
                    </div>
                </div>) : (<Navigate to="/auth" replace />)
            }
        </>
    )
}

export default Question;
