import React from 'react'
import './CSS/Main.css';
import { Link } from 'react-router-dom'
import FilterListIcon from '@mui/icons-material/FilterList';
import AllQuestion from './AllQuestion';

const Main = ({ questions }) => {
    return (
        <div className="main">
            <div className="main-container">

                <div className="main-top">
                    <h2>All Questions</h2>
                    <Link to='/ask-question'>
                        <button>Ask Question</button>
                    </Link>
                </div>

                <div className="main-desc">
                    <p>{questions?.length} Questions</p>
                    <div className="main-filter">

                        <div className="main-tabs">

                            <div className="main-tab">
                                <Link>Newest</Link>
                            </div>

                            <div className="main-tab">
                                <Link>Active</Link>
                            </div>

                            <div className="main-tab">
                                <Link>More</Link>
                            </div>

                        </div>

                        <div className="main-filter-item">
                            <FilterListIcon />
                            <p>Filter</p>
                        </div>

                    </div>
                </div>

                <div className="questions">
                    {
                        questions.map((que) => (
                            <>
                                <div key={que._id} className="question">
                                    <AllQuestion questions={que} />
                                </div>
                            </>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Main
