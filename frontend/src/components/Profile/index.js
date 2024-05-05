import React from 'react'
import Sidebar from '../StackOverflow/Sidebar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from "../../features/userSlice";
import Profile from './Profile';
import './index.css'

const Index = () => {
    const user = useSelector(selectUser);
    const navi = useNavigate();

    return (
        <>
            {
                user ? 
                (<div className='stack-index'>
                    <div className="stack-index-content">
                        <Sidebar />
                        <Profile />
                    </div>

                </div>) :
                    (navi('/auth'))
            }
        </>
    )
}

export default Index
