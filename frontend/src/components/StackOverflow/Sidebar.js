import React from 'react'
import './CSS/Sidebar.css';
import PublicIcon from '@mui/icons-material/Public';
import StarsIcon from '@mui/icons-material/Stars';
import WorkIcon from '@mui/icons-material/Work';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-container">
                <div className="sidebar-options">
                    <div className="sidebar-option">
                        <Link to='/' >Home</Link>
                    </div>

                    <div className="sidebar-option">
                        <Link>PUBLIC</Link>

                        <div className="link">

                            <div className="link-tag">
                                <PublicIcon />
                                <Link>Questions</Link>
                            </div>

                            <div className="tags">
                                <p>Tags</p>
                                <p>Users</p>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-option">
                        <p>COLLECTIVES</p>
                        <div className="link">
                            <div className="link-tag">
                                <StarsIcon />
                                <Link>Explore Collectives</Link>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-option">
                        <p>FIND A JOB</p>
                        <div className="links">
                            <Link>Jobs</Link>
                            <Link>Compnies</Link>
                        </div>
                    </div>

                    <div className="sidebar-option">
                        <p>Teams</p>
                        <div className="link-tag">
                            <WorkIcon />
                            <Link>Compnies</Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Sidebar
