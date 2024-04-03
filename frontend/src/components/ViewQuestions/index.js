import React from 'react'
import '../StackOverflow/CSS/index.css';
import Sidebar from '../StackOverflow/Sidebar';
import MainQuestion from './MainQuestion';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectUser } from "../../features/userSlice";



const Index = () => {
    const user = useSelector(selectUser);

    return (
        <>
        {
            user ? (<div className='stack-index'>
            <div className="stack-index-content">
                <Sidebar />
                <MainQuestion/>
            </div>

        </div>) :
        (<Navigate to="/auth" replace />)
        }
        </>
    )
}

export default Index
