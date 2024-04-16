import React from 'react'
import './CSS/index.css';
import Sidebar from './Sidebar';
import Main from './Main';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from "../../features/userSlice";
import axios from 'axios';

const Index = () => {

    const [questions, setQuestions] = useState([]);
    const user = useSelector(selectUser);
    const navi = useNavigate();

    const fetchData = async () => {
        await axios.get('/api/question')
            .then((res) => {
                setQuestions(res.data.reverse())
            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        fetchData();
    }, []) 

    return (
        <div className='stack-index'>
            <div className="stack-index-content">
                <Sidebar />
                <Main questions={questions} />
            </div>

        </div>
    )
}

export default Index
