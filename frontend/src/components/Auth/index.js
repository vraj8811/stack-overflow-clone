import React, { useState } from 'react'
import './index.css';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase'
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import { Navigate, useNavigate } from 'react-router-dom';



const Index = () => {
    const [register, setRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
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
        signInWithPopup(auth, provider).then((res) => {
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
        if (email == "" || password == "" || username == "") {
            setError("Required field is missing");
            setTimeout(clearError, 5000);
            setLoading(false);
        } else {
            createUserWithEmailAndPassword(auth, email, password).then((res) => {
                setLoading(false);
                navi("/");
                console.log(res);
            }).catch((err) => {
                {
                    console.log(err);
                    setError(err.message);
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
            setError("Required field is missing");
            setLoading(false);
            setTimeout(clearError, 5000);
        }
        else {
            signInWithEmailAndPassword(auth, email, password).then((res) => {
                console.log(res);
                navi("/");
                setLoading(false);
            }).catch((err) => {
                {
                    console.log(err);
                    setError(err.message);
                    setLoading(false);
                    setTimeout(clearError, 5000);
                }
            })
        }
    }

    function clearError() {
        setError("");
    }

    const handleForgotPassword = () => {
        const email = prompt("Please enter your email");
        if (email) {
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    alert("Password reset link sent to your email");
                })
                .catch((error) => {
                    alert("Failed to send password reset link");
                });
        }
    }

    // const handleSendResetLink = () => {
    //     sendPasswordResetEmail(auth, resetEmail)
    //         .then(() => {
    //             console.log("Password reset email sent successfully");
    //             setResetModalOpen(false);
    //             // You can provide feedback to the user here
    //         })
    //         .catch((error) => {
    //             console.error("Error sending password reset email:", error);
    //             setResetModalOpen(false);
    //             // Handle error and provide feedback to the user
    //         });
    // }

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
                                        <p>Username</p>
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

                                    <p onClick={handleForgotPassword} style={{ font:'small-caption',textAlign: 'end', color: "#0095ff", textDecoration: "underline", cursor: "pointer" }}>Forgot Password?</p>

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


                    <div className="single-option2">
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
