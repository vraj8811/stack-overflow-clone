import React from 'react'
import '../StackOverflow/CSS/index.css';
import Sidebar from '../StackOverflow/Sidebar';
import MainQuestion from './MainQuestion';


const index = () => {
    return (
        <div className='stack-index'>
            <div className="stack-index-content">
                <Sidebar />
                <MainQuestion/>
            </div>

        </div>
    )
}

export default index
