import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HistoryIcon from '@mui/icons-material/History';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Avatar } from '@mui/material';
import './index.css'
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import { useSelector } from 'react-redux';
import { selectUser } from "../../features/userSlice";

const MainQuestion = () => {
  const [show, setShow] = useState(false);
  const [questionDetails, setQuestionDetails] = useState({});
  const [body, setBody] = useState('');
  const [comments, setComments] = useState("");
  const user = useSelector(selectUser);

  let search = window.location.search;
  const params = new URLSearchParams(search);
  const id = params.get('q');

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`/api/question/${id}`)
        .then((res) => {
          setQuestionDetails(res.data[0])
        }).catch(err => {
          console.log(err)
        });

        await axios.put(`api/question/${id}/view`)
        .then((res) => {
            console.log(res);
        }).catch(err => {
            console.log(err)
        });
    }
    fetchData();
  }, [id]);


  const getUpdatedAnswer = async () => {
    await axios.get(`/api/question/${id}`)
      .then((res) => {
        setQuestionDetails(res.data[0])
      }).catch(err => {
        console.log(err)
      })
  }

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (body !== '') {
      const data = {
        answer: body,
        question_id: id,
        user: user,
      }
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      await axios.post('/api/answer', data, config).then((res) => {
        console.log(res.data)
        alert('Answer Added Successfully');
        setBody('');
        getUpdatedAnswer();
      }).catch(err => {
        console.log(err)
      })
    }
  };

  const handleComment = async () => {
    if (comments !== '') {
      const data = {
        comment: comments,
        question_id: id,
        user: user,
      }
      await axios.post(`/api/comment/${id}`, data).then((res) => {
        console.log(res.data)
        alert('Comment Added Successfully');
        setComments('');
        setShow(false);
        getUpdatedAnswer();
      }).catch(err => {
        console.log(err)
      })
    }
  }

  const handleVote = async (vote) => {
    const data = {
      vote: vote
    }
    await axios.put(`/api/question/${id}/vote`, data).then((res) => {
      console.log(res.data)
      getUpdatedAnswer();
    }).catch(err => {
      console.log(err)
    })
  }

  const handleAnswerVote = async (vote, id) => {
    const data = {
      vote: vote
    }
    await axios.put(`/api/answer/${id}/vote`, data).then((res) => {
      console.log(res.data)
      getUpdatedAnswer();
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div className="main">
      <div className="main-container">

        <div className="main-top">
          <h2 className='main-question'>{questionDetails?.title}</h2>
          <Link to='/ask-question'>
            <button>Ask Question</button>
          </Link>
        </div>

        <div className="main-desc">
          <div className="info">
            <p>{new Date(questionDetails.created_at).toLocaleString()}</p>
            <p>Active<span>today</span></p>
            <p>Viewd<span>{questionDetails?.views > 1000 ? `${(questionDetails?.views / 1000).toFixed(1)}k` : questionDetails?.views} times</span></p>
          </div>
        </div>

        <div className="all-questions">
          <div className="all-questions-container">
            <div className="all-questions-left">
              <div className="all-options">

                <p className="arrow" onClick={()=> {handleVote(1)}}>▲</p>
                <p className="votes">{questionDetails?.votes}</p>
                <p className="arrow" onClick={() => {handleVote(-1)}}>▼</p>

                <BookmarkIcon />
                <HistoryIcon />

              </div>
            </div>

            <div className="question-answer">
              <p>{ReactHtmlParser(questionDetails?.body)}</p>

              <div className="author">
                <small>
                  asked {new Date(questionDetails?.created_at).toLocaleString()}
                </small>

                <div className="auth-details">
                  <Avatar src={questionDetails?.user?.photo} />
                  <p>{questionDetails?.user?.displayName ? questionDetails?.user?.displayName : String(questionDetails?.user?.email).split('@')[0]}</p>
                </div>

              </div>

              <div className="comments">
                <div className="comment">
                  {
                    questionDetails?.comments && questionDetails?.comments?.map((comment) => (
                      <p>{comment?.comment} - <span>{comment?.user?.displayName ? comment?.user?.displayName : String(comment?.user?.email).split('@')[0]}</span> <small>{new Date(comment?.created_at).toLocaleString()}</small></p>
                    ))
                  }
                </div>

                <p onClick={() => setShow(!show)}>Add Comment</p>
                {
                  show && (<div className='title'>
                    <textarea value={comments}
                      onChange={(e) => { setComments(e.target.value) }}
                      type='text'
                      placeholder='Add your comment'
                      rows={5}
                      style={{
                        margin: "5px 0px",
                        padding: "10px",
                        border: "1px solid rgba(0,0,0,0.2)",
                        borderRadius: "3px",
                        outline: "none",
                      }}></textarea>
                    <button
                      onClick={handleComment}
                      style={{
                        maxWidth: 'fit-content'
                      }}>Add Comment</button>
                  </div>)
                }

              </div>

            </div>
          </div>
        </div>
        <div style={{
          flexDirection: "column"
        }} className="all-questions">
          <p style={{ marginBottom: "20px", fontSize: "1.3rem", fontWeight: "300" }}>
            {questionDetails?.answerDetails?.length} Answers
          </p>
          {
            questionDetails?.answerDetails?.map((answer) => (
              <>
                <div key={answer?._id} className="all-questions-container">

                  <div className="all-questions-left">
                    <div className="all-options">

                      <p className="arrow" onClick={() => {handleAnswerVote(1,answer._id)}} >▲</p>
                      <p className="votes">{answer?.votes}</p>
                      <p className="arrow" onClick={() => {handleAnswerVote(-1,answer._id)}}>▼</p>

                      <BookmarkIcon />
                      <HistoryIcon />

                    </div>
                  </div>

                  <div className="question-answer">
                    <p>{ReactHtmlParser(answer?.answer)}</p>

                    <div className="author">
                      <small>
                        asked {new Date(answer?.created_at).toLocaleString()}
                      </small>

                      <div className="auth-details">
                        <Avatar src={answer?.user.photo} />
                        <p>{answer?.user?.displayName ? answer?.user?.displayName : String(answer?.user?.email).split('@')[0]}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <hr style={{marginTop:"7px",marginBottom:"7px",color:"#c9cacfa2",filter: "brightness(1)"}} />
              </>
            ))
          }


        </div>
      </div>
      <div className="main-answer">
        <h3 style={{ fontSize: "22px", margin: "10px 0", fontWeight: "400" }}>Your answer</h3>
        <ReactQuill value={body} onChange={handleQuill} modules={modules} formats={formats} className='react-quill' theme='snow' style={{ height: "200px" }} />
      </div>
      <button type="submit" onClick={handleSubmit} style={{ maxWidth: 'fit-content', marginTop: "40px" }}>Post your answer</button>
    </div>
  )
}

export default MainQuestion
