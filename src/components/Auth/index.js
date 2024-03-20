import React, { useState } from 'react'
import './index.css';

const Index = () => {
    const [register, setRegister] = useState(false);
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
                                        <input type='text' />
                                    </div>

                                    <div className="input-field">
                                        <p>Email</p>
                                        <input type='text' />
                                    </div>

                                    <div className="input-field">
                                        <p>Password</p>
                                        <input type='password' />
                                    </div>

                                    <button>Register</button>

                                </>) :

                                (<>

                                    <div className="input-field">
                                        <p>Email</p>
                                        <input type='text' />
                                    </div>

                                    <div className="input-field">
                                        <p>Password</p>
                                        <input type='password' />
                                    </div>

                                    <button>Login</button>

                                </>)
                        }

                        <p onClick={
                            () => setRegister(!register)
                        } style={{ marginTop: "10px", textAlign: "center", color: "#0095ff", textDecoration: "underline", cursor: "pointer" }}>{register ? "Login" : "Register"}</p>
                    </div>
                </div>
                <div className="sign-options">

                    <div className="single-option1">
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
            </div>
        </div>
    )
}

export default Index
