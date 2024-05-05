import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectUser } from "../../features/userSlice";
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [userQuestions, setUserQuestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [profile, setProfile] = useState('');
    let user = useSelector(selectUser);
    const navigate = useNavigate();

    const fetchUserData = async () => {
        try {
            const docSnap = await getDoc(doc(db, 'users', user.uid));
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting document: ", error);
            return error.message;
        }
    }

    const fetchUserQuestions = async () => {
        try {
            const response = await axios.get(`/api/question/user/getque/${user.uid}`);
            // console.log(response.data);
            setUserQuestions(response.data);
        } catch (error) {
            console.error("Error getting user questions: ", error);
        }
    }

    useEffect(() => {
        fetchUserData();
        fetchUserQuestions();
    }, []);

    const openModal = () => {
        setUsername(userData?.name);
        setEmail(userData?.email);
        setPassword(userData?.password);
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const handleProfilePicChange = (e) => {
        const selectedFile = e.target.files[0];
        setProfile(selectedFile);
    }

    const handleChangePassword = () => {
        if (userData.email) {
            sendPasswordResetEmail(auth, userData.email)
                .then(() => {
                    toast.success('Password reset link sent to your email', { style: { background: '#333', color: '#fff' } });
                    // alert("Password reset link sent to your email");
                })
                .catch((error) => {
                    // alert("Failed to send password reset link");
                    toast.error('Failed to send password reset link', { style: { background: '#333', color: '#fff' } });
                });
        }
    }

    const handelupadte = async () => {
        setLoading(true);
        await updateProfile().then(setLoading(false));
    }

    const updateProfile = async () => {
        if (username && email && profile) {
            const imgRef = ref(storage, `uploads/profilePics/${user.uid}-${Date.now()}-${profile.name}`);
            await getDownloadURL(ref(storage, (await uploadBytes(imgRef, profile)).ref.fullPath)).then(async (url) => {
                const data = {
                    uid: user.uid,
                    photo: url,
                    name: username,
                    email: email,
                    password: password,
                    isGoogle: false
                };
                await setDoc(doc(db, "users", data.uid), data).then(
                    () => {
                        setLoading(false);
                        toast.success('Profile Updated Successfully !!', { style: { background: '#333', color: '#fff' } });
                        fetchUserData()
                    });
            }).catch((error) => {
                // console.log(error);
            });
            closeModal();
        }
        else {
            const data = {
                uid: user.uid,
                photo: userData?.photo,
                name: username,
                email: userData?.email,
                password: password,
                isGoogle: false
            };
            await setDoc(doc(db, "users", user.uid), data).then(fetchUserData());
            toast.success('Profile Updated Successfully !!', { style: { background: '#333', color: '#fff' } });
            closeModal();
        }
    }

    // console.log(userData);

    return (
        <>
            <div className="main" style={{ width: "100%", display: 'flex', flexDirection: 'row', alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{ display: 'flex', alignItems: "flex-start" }}>
                    {userData?.isGoogle===true ? (
                        <div className="img-container" style={{ width: 'fit-content', height: 'fit-content' }}>
                            <img src={userData?.photo} alt="profile" style={{ overflow: 'hidden', width: 'fit-content', height: 'fit-content' }} />
                        </div>
                    ) : (
                        <div className="img-container" style={{ width: '150px', height: '150px' }}>
                            <img src={userData?.photo} alt="profile" style={{ overflow: 'hidden', width: 'fit-content', height: 'fit-content' }} />
                        </div>
                    )}

                    <p className='name'>{userData?.name}</p>
                </div>
                <div className='d-flex flex-row'>
                    {!userData?.isGoogle ? (<button className='btn btn-outline-secondary' onClick={() => { openModal() }} style={{ marginRight: '20px' }}>
                        <span style={{ cursor: 'pointer' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                                <path d="M 36 5.0097656 C 34.205301 5.0097656 32.410791 5.6901377 31.050781 7.0507812 L 8.9160156 29.183594 C 8.4960384 29.603571 8.1884588 30.12585 8.0253906 30.699219 L 5.0585938 41.087891 A 1.50015 1.50015 0 0 0 6.9121094 42.941406 L 17.302734 39.974609 A 1.50015 1.50015 0 0 0 17.304688 39.972656 C 17.874212 39.808939 18.39521 39.50518 18.816406 39.083984 L 40.949219 16.949219 C 43.670344 14.228094 43.670344 9.7719064 40.949219 7.0507812 C 39.589209 5.6901377 37.794699 5.0097656 36 5.0097656 z M 36 7.9921875 C 37.020801 7.9921875 38.040182 8.3855186 38.826172 9.171875 A 1.50015 1.50015 0 0 0 38.828125 9.171875 C 40.403 10.74675 40.403 13.25325 38.828125 14.828125 L 36.888672 16.767578 L 31.232422 11.111328 L 33.171875 9.171875 C 33.957865 8.3855186 34.979199 7.9921875 36 7.9921875 z M 29.111328 13.232422 L 34.767578 18.888672 L 16.693359 36.962891 C 16.634729 37.021121 16.560472 37.065723 16.476562 37.089844 L 8.6835938 39.316406 L 10.910156 31.521484 A 1.50015 1.50015 0 0 0 10.910156 31.519531 C 10.933086 31.438901 10.975086 31.366709 11.037109 31.304688 L 29.111328 13.232422 z"></path>
                            </svg>
                        </span>
                        <p style={{ color: 'black', fontSize: '15px', marginLeft: '5px' }}>Edit Profile</p>
                    </button>) : (<></>)}


                    <button className='btn btn-outline-secondary' onClick={() => { handleChangePassword() }}>
                        <p style={{ color: 'black', fontSize: '15px', marginLeft: '5px' }}>Change Password</p>
                    </button>
                </div>
            </div>



            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal" style={{ width: '400px', marginTop: '150px', display: 'block', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1050' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Update Profile</h5>
                                    <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
                                </div>
                                <div className="modal-body d-flex flex-column justify-content-center" style={{ width: '350px', marginLeft: '20px', marginRight: '10px' }}>
                                    <div className="input-field">
                                        <p>Name</p>
                                        <input value={username} onChange={(e) => setUsername(e.target.value)} type='text' />
                                    </div>

                                    <div className="input-field">
                                        <p>Email</p>
                                        <input value={email} disabled='true' type='email' />
                                    </div>

                                    {/* <div className="input-field">
                                        <p>Password</p>
                                        <div className='input-field d-flex flex-row'>
                                        <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} style={{width:'300px'}}  />
                                        <span className="toggle-password" onClick={() => setShowPassword(!showPassword)} style={{cursor:'pointer',marginLeft:'5px',marginTop:'7px'}}>
                                            {showPassword ?
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                                    <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                                                </svg> :
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                </svg>}
                                        </span>
                                        </div>
                                    </div> */}

                                    <div className="input-field mb-4">
                                        <p>Profile Pic</p>
                                        <input onChange={handleProfilePicChange} type='file' />
                                        {console.log(loading)}
                                    </div>

                                    <button className='btn btn-primary w-100 mb-4' disabled={loading} onClick={() => { handelupadte() }}>
                                        <p style={{ margin: 'auto' }}>{loading ? "Updating..." : "Update"}</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="extra" style={{
                position: "absolute",
                left: "450px",
                marginTop: "250px",
                width: "1000px",
            }}>
                <div style={{ width: '50%' }}>
                    <h3>Questions Asked</h3>
                    {userQuestions.length === 0 ? <p>No questions asked</p> : (
                        <div className="questions">
                            {
                                userQuestions.map((que) => (
                                    <>
                                        <div key={que._id} className="question">
                                            <div className="question-answer">
                                                <Link to={`/question?q=${que._id}`}>{que.title}</Link>
                                            </div>
                                        </div>

                                    </>
                                ))
                            }
                        </div>
                    )}
                </div >
            </div >
        </>
    );
};

export default Profile;
