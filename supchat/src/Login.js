import React from 'react'
import "./Login.css"
import { auth, provider } from "./firebase"

export default function Login() {

    const signIn = () => {
        auth.signInWithPopup(provider).then(res => { }).catch((e) => alert(e.message))
    }


    return (
        <div className="login">
            <div className="login-container">
                <img src="https://www.loginradius.com/blog/start-with-identity/static/3b4c33cef1861297f7da778dff9074a7/a3513/login-security.png" />
                <div className="login-text">
                    <h2>Sign in with us</h2>
                </div>
                <button onClick={signIn} >SignIn With Google</button>
            </div>

        </div>
    )
}