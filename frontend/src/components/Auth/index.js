import React, { useState } from 'react'
import './index.css';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, gitProvider, provider, storage } from '../../firebase'
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import toast from 'react-hot-toast';


const Index = () => {
    const [register, setRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState('');
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [error, setError] = useState("");
    const navi = useNavigate();
    const user = useSelector(selectUser);

    if (user) {
        navi("/");
    }

    function validateEmail(email) {
        const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(email) === false) {
            return false;
        } else return true;
    }

    const handleSignInGoogle = () => {
        signInWithPopup(auth, provider).then(async (res) => {
            const docSnap = await getDoc(doc(db, "users", res.user.uid));
            //console.log(res.user.uid)
            if (docSnap.exists()) {
                navi("/");
            } else {
                const data = {
                    uid: res.user.uid,
                    photo: res.user.photoURL,
                    name: res.user.displayName,
                    email: res.user.email,
                    password: "",
                    isGoogle: true
                };
                const result = await setDoc(doc(collection(db, "users"), res.user.uid), data);
                toast.success('Logedin Successfully !!', { style: { background: '#333', color: '#fff' } });
                navi("/");
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleSignInGithub = () => {
        signInWithPopup(auth, gitProvider).then((res) => {
            toast.success('Logedin Successfully !!', { style: { background: '#333', color: '#fff' } });
            navi("/");
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }

    const hadleRegister = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        if (email == "" || password == "" || username == "" || profile == "") {
            // setError("Required field is missing");
            toast.error('Required field is missing', { style: { background: '#333', color: '#fff' } });
            setTimeout(clearError, 5000);
            setLoading(false);
        } else {
            createUserWithEmailAndPassword(auth, email, password).then(async (res) => {
                setLoading(false);
                const imgRef = ref(storage, `uploads/profilePics/${res.user.uid}-${Date.now()}-${profile.name}`);
                await getDownloadURL(ref(storage, (await uploadBytes(imgRef, profile)).ref.fullPath)).then(async (url) => {
                    const data = {
                        uid: res.user.uid,
                        photo: url,
                        name: username,
                        email: email,
                        password: password,
                        isGoogle: false
                    };
                    await setDoc(doc(collection(db, "users"), res.user.uid), data);
                    toast.success('Registered Successfully !!', { style: { background: '#333', color: '#fff' } });
                    setEmail("");
                    setPassword("");
                    setUsername("");
                    setProfile("");
                    navi("/");

                }).catch((err) => {
                    console.log(err);
                    toast.error(`${err.message}`, { style: { background: '#333', color: '#fff' } });
                    // setError(err.message);
                    setTimeout(clearError, 5000);
                    setLoading(false);
                });
            }).catch((err) => {
                {
                    console.log(err);
                    toast.error(`${err.message}`, { style: { background: '#333', color: '#fff' } });
                    // setError(err.message);
                    setTimeout(clearError, 5000);
                    setLoading(false);
                }
            })
        }
    }

    const handleSignIn = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        if (email == "" || password == "") {
            // setError("Required field is missing");
            toast.error('Required field is missing', { style: { background: '#333', color: '#fff' } });
            setLoading(false);
            setTimeout(clearError, 5000);
        }
        else {
            signInWithEmailAndPassword(auth, email, password).then((res) => {
                // console.log(res);
                toast.success('Logedin Successfully !!', { style: { background: '#333', color: '#fff' } });
                navi("/");
                setLoading(false);
            }).catch((err) => {
                {
                    console.log(err);
                    // setError(err.message);
                    toast.error(`${err.message}`, { style: { background: '#333', color: '#fff' } });
                    setLoading(false);
                    setTimeout(clearError, 5000);
                }
            })
        }
    }

    function clearError() {
        setError("");
    }

    // const handleForgotPassword = () => {
    //     const email = prompt("Please enter your email");
    //     if (email) {
    //         sendPasswordResetEmail(auth, email)
    //             .then(() => {
    //                 alert("Password reset link sent to your email");
    //             })
    //             .catch((error) => {
    //                 alert("Failed to send password reset link");
    //             });
    //     }
    // }

    const handleProfilePicChange = (e) => {
        // Handle file selection and update state
        const selectedFile = e.target.files[0];
        setProfile(selectedFile);
    }
    
    const handleForgotPassword = () => {
        setResetModalOpen(true);
    };

    const closeModal = () => {
        setResetModalOpen(false);
    };

    const handleSendResetLink = () => {
        sendPasswordResetEmail(auth, resetEmail)
            .then(() => {
                toast.success("Password reset link sent to your email", { style: { background: '#333', color: '#fff' } });
                setResetModalOpen(false);
                setResetEmail("");
                // You can provide feedback to the user here
            })
            .catch((error) => {
                toast.error("Failed to send password reset link", { style: { background: '#333', color: '#fff' } });
                setResetModalOpen(false);
                setResetEmail("");
                // Handle error and provide feedback to the user
            });
    }

    return (
        <div className='auth'>
            <div className="auth-container">
                <img className='logo' src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Stack_Overflow_icon.svg/768px-Stack_Overflow_icon.svg.png" alt='logo' />
                {
                    register ? (<h2>Register</h2>) : (<h2>Login</h2>)
                }

                <div className="auth-login">
                    <div className="auth-login-container">
                        {
                            register ? (
                                <>

                                    <div className="input-field">
                                        <p>Name</p>
                                        <input value={username} onChange={(e) => setUsername(e.target.value)} type='text' />
                                    </div>

                                    <div className="input-field">
                                        <p>Email</p>
                                        <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' />
                                    </div>

                                    <div className="input-field">
                                        <p>Password</p>
                                        <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' />
                                    </div>

                                    <div className="input-field">
                                        <p>Profile Pic</p>
                                        <input onChange={handleProfilePicChange} type='file' />
                                    </div>

                                    <button onClick={hadleRegister} disabled={loading}>
                                        {loading ? 'Registering..' : 'Register'}
                                    </button>

                                </>) :

                                (<>

                                    <div className="input-field">
                                        <p>Email</p>
                                        <input value={email} onChange={(e) => setEmail(e.target.value)} type='text' />
                                    </div>

                                    <div className="input-field">
                                        <p>Password</p>
                                        <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' />
                                    </div>

                                    <button onClick={handleSignIn} disabled={loading}>
                                        {loading ? 'Signing In..' : 'Login'}
                                    </button>

                                    <p onClick={handleForgotPassword} style={{ font: 'small-caption', textAlign: 'end', color: "#0095ff", textDecoration: "underline", cursor: "pointer" }}>Forgot Password?</p>

                                </>)
                        }

                        <p onClick={
                            () => setRegister(!register)
                        } style={{ marginTop: "10px", textAlign: "center", color: "#0095ff", textDecoration: "underline", cursor: "pointer" }}>{register ? "Login" : "Register"}</p>
                    </div>
                </div>
                <div className="sign-options">

                    <div onClick={handleSignInGoogle} className="single-option1">
                        <img src="https://www.svgrepo.com/show/303108/google-icon-logo.svg" alt='google' />
                        {/* <p>Log in with Google</p> */}
                    </div>


                    <div onClick={handleSignInGithub} className="single-option2">
                        <img
                            alt="github"
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/800px-GitHub_Invertocat_Logo.svg.png"
                        />
                        {/* <p>Log in with Github</p> */}
                    </div>
                    <div className="single-option3">
                        <img
                            alt="facebook"
                            src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/facebook-app-round-white-icon.png"
                        />
                        {/* <p>Log in with Facebook</p> */}
                    </div>

                    {resetModalOpen && (
                        <>
                            <div className="modal-backdrop fade show"></div>
                            <div className="modal" style={{ width: '400px', marginTop: '150px', display: 'block', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1050' }}>
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Forget Password</h5>
                                            <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
                                        </div>
                                        <div className="modal-body d-flex flex-column justify-content-center" style={{ width: '350px', marginLeft: '20px', marginRight: '10px' }}>
                                            <div className="input-field mb-4">
                                                <p>Email</p>
                                                <input value={resetEmail} type='email' onChange={(e)=>{setResetEmail(e.target.value)}} />
                                            </div>
                                            <button className='btn btn-primary w-100 mb-4' disabled={loading} onClick={() => {handleSendResetLink()  }}>
                                                <p style={{ margin: 'auto' }}>{loading ? "Sending Link..." : "Send Link"}</p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                </div>
                {
                    error !== "" && (<p style={{
                        color: "red",
                        fontSize: "14px",
                        marginTop: "20px"
                    }}>
                        {error}
                    </p>)
                }
            </div>
        </div>
    )
}

export default Index
