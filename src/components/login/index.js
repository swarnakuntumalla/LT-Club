import React from 'react';
import { Component } from 'react';
import { ThreeDots } from 'react-loader-spinner'

import './index.css';
import logo from "../../imgs/logo.jpeg";
import wcloud from '../../imgs/wcloud.jpg';

class LoginPage extends Component {
    state = {
        loginState: "login",
        isLoading: false,
        email: "",
        code: "",
        mcode: "",
        signupErr: "",
        verErr: ""
    }

    componentDidMount(){
        const token = window.localStorage.getItem("token")
        if(token !== null){
            window.location.replace('/')
        }
    }

    renderForm = () => {
        const { loginState } = this.state
        if (loginState === "login") {
            return this.renderSignupForm()
        } else {
            return this.renderVerifyForm()
        }
    }


    renderSignupForm = () => {
        const { email, signupErr } = this.state

        return (
            <form id="signup-form" className="login-form"  onSubmit={this.signup}>
                <h1 className="login-form-heading">Login</h1>
                <label htmlFor="signup-email" className="d-block login-label">Email</label>
                <input name="email" type="email" className="login-input" id="signup-email" value={email} onChange={this.changeEmail} onBlur={() => this.reqFunc('signup-email', 'email-req')} />
                <p id="email-req" className="req d-none">*required</p>
                <div className="text-center">
                    <button className="login-btn" type="submit">Send Code</button>
                </div>
                <p id="signup-err" className="req">{signupErr}</p>
            </form>
        )
    }

    renderVerifyForm = () => {
        const { code, verErr } = this.state

        return (
            <form id="verify-form" className="login-form" onSubmit={this.verify}>
                <h1 className="login-form-heading">Verification</h1>
                <label htmlFor="verify" className="d-block login-label">Enter Verification Code</label>
                <input type="text" className="login-input" id="verify" value={code} onChange={this.changeCode} onBlur={() => this.reqFunc('verify', 'verify-req')} />
                <p id="verify-req" className="req d-none">*required</p>
                <div className="text-center">
                    <button className="login-btn" type="submit">Verify</button>
                </div>
                <p id="verify-err" className="req">{verErr}</p>
            </form>
        )
    }

    reqFunc = (e, r) => {
        let elem = document.getElementById(e);
        let reqtext = document.getElementById(r);
        if (elem.value === "") {
            elem.style.borderColor = "red";
            reqtext.classList.remove("d-none");
        }
        else {
            elem.style.borderColor = "#034C03";
            reqtext.classList.add("d-none");
        }
    }

    changeEmail = event => {
        this.setState({ email: event.target.value })
    }

    changeCode = event => {
        this.setState({ code: event.target.value })
    }

    signup = async (event) => {
        event.preventDefault()
        const { email } = this.state

        if (email === "") {
            this.reqFunc("signup-email", "email-req");
        }
        else {
            let regex = /^[a-z0-9]+@rguktrkv\.ac+\.in$/
            if (regex.test(email)) {
                this.setState({ signupErr: "" })
                this.setState({ isLoading: true })
                let options = {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                };
                const response = await fetch("http://210.212.217.205:3003/signup", options)
                const data = await response.json()
                if (response.ok) {
                    this.setState({ loginState: "verify", signupErr: "", mcode: data })
                    alert("A verification code has been sent to given mail...")
                }
            } else {
                this.setState({ signupErr: "Invalid Email" });
            }
        }
        this.setState({ isLoading: false })
    }

    verify = async (event) => {
        event.preventDefault()
        const { email, code, mcode } = this.state

        if (parseInt(code) === mcode) {
            this.setState({ isLoading: true })
            let options = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            };
            const response = await fetch("http://210.212.217.205:3003/verify", options)
            const data = await response.json()

            window.localStorage.setItem('token', data["jwtToken"])
            window.location.replace('/')

        } else {
            this.setState({ verErr: "Invalid Code" })
        }
    }

    renderLoader = () => {
        return (
            <div className='d-flex justify-content-center m-5'>
                <ThreeDots
                    height="80vh"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="threedots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                />
            </div>
        )
    }


    render() {
        const { isLoading } = this.state;
        
        return (
            <div className="container-fluid">
                <div className="d-flex order-last flex-column flex-lg-row order-lg-first">
                    <div className="col-12 col-lg-6 login-container-1">
                        <div className="text-center mt-5 d-none d-lg-block">
                            <img className="login-logo" src={logo} alt="logo" />
                        </div>
                        {isLoading ? this.renderLoader() : this.renderForm()}
                    </div>
                    <div className="order-first col-12 col-lg-6 login-container-2 order-lg-last mt-lg-5">
                        <div className="text-center d-lg-none">
                            <img className="login-logo" src={logo} alt='logo' />
                        </div>
                        <h1 className="login-desciption">Let's <span className="login-highlight">Learn</span> and Grow <span className="login-highlight1">Together</span></h1>
                        <img className='wc-img' src={wcloud} alt='wc' />

                    </div>

                </div>
            </div>
        );
    }
}

export default LoginPage;