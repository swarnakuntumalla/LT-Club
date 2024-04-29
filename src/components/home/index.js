import React from "react"
import { Component } from "react"
import Header from "../header"
import Card from "../card"
import { ThreeDots } from 'react-loader-spinner'

import { TiLocation } from "react-icons/ti";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaMedium } from "react-icons/fa6";
import { FaRegCopyright } from "react-icons/fa6";

import rgukt from "../../imgs/rg.jpeg"
import mcq from '../../imgs/mcq.jpeg'
import coding from '../../imgs/coding.jpeg'

import './index.css'

class Home extends Component {
    state = { "testDetails": [], "track_details": [], "isLoading": false, "tier": 3 }

    componentDidMount() {
        this.setState({ "isLoading": true })
        this.getTier()
        this.fetchAllDetails()
    }

    getTier = async () => {
        const token = window.localStorage.getItem("token");
        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        }
        const response = await fetch("http://210.212.217.205:3003/get-tier", options)
        const data = await response.json()
        this.setState({"tier": data.tier})
    }

    clickPlus = () => {
        let plusContainer = document.getElementById("plus-container")
        let plusBtn = document.getElementById("plus-btn")
        let plusLink = document.getElementById("plus-link")
        plusContainer.classList.toggle('active')
        plusBtn.classList.toggle('active-btn')
        plusLink.classList.toggle('active-link')
    }

    fetchAllDetails = async () => {
        const response = await fetch("http://210.212.217.205:3003/get-details")
        const data = await response.json()
        this.setState({ "testDetails": data[0], "track_details": data[1], "isLoading": false })
    }

    renderTests = () => {
        const { testDetails } = this.state
        const elements = []
        for (let i = 0; i < testDetails.length; i++) {
            const testObj = testDetails[i];
            testObj.type === "mcq" ? elements.push(
                <Card image={mcq} type={testObj.type} heading={testObj.name} desc={testObj.description} unqId={testObj.id} key={testObj.id} />
            ) : elements.push(
                <Card image={coding} type={testObj.type} heading={testObj.name} desc={testObj.description} unqId={testObj.id} key={testObj.id} />
            )
        }
        return elements
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
        const { track_details, isLoading, testDetails, tier } = this.state
        const plusCls = tier === 1 ? "plus-container-1" : ""

        return (
            isLoading ? this.renderLoader() :
                <>
                    <Header />
                    <div className="p-3 d-flex">
                        <div className="m-3">
                            <div className="d-flex">
                                <h1 className="obj-heading">Some things about "this"...</h1>
                                <img className="rgukt-logo-sm" src={rgukt} alt="rgukt" />
                            </div>
                            <ul className="obj-ul p-3">
                                <li><b>Skill Development:</b> Help members improve their coding and programming skills, whether they are beginners or more advanced coders.</li>
                                <li><b>Project-Based Learning:</b> Encourage members to work on coding projects that are of interest to them, allowing them to apply what they've learned in a practical context.</li>
                                <li><b>Collaboration:</b> Foster a sense of community and collaboration among members, providing opportunities for them to work together on projects or solve coding challenges as a team.</li>
                                <li><b>Exploring New Technologies:</b> Introduce members to new programming languages, tools, and technologies, staying current with industry trends and developments.</li>
                                <li><b>Mentorship:</b> Create opportunities for more experienced members to mentor beginners, creating a supportive learning environment.</li>
                                <li><b>Hackathons and Challenges:</b> Organize coding competitions, hackathons, or coding challenges to motivate members and allow them to test their skills.</li>
                            </ul>
                        </div>
                        <img className="rgukt-logo" src={rgukt} alt="rgukt" />
                    </div>

                    {tier === 1 &&
                        <div id="plus-container" className={`plus-container ${plusCls}`}>
                            <div id="plus-link" className="plus-link-container">
                                <a className="plus-link" href="/create-mcq">MCQ Test</a>
                                <hr width="200" />
                                <a className="plus-link" href="/create-coding-test">Coding Test</a>
                                {tier === 1 &&
                                    (<>
                                        <hr width="200" />
                                        <a className="plus-link" href="/edit-track/create">Track</a>
                                    </>)}
                            </div>
                            <div id="plus-btn" className="plus-btn" onClick={this.clickPlus}></div>
                        </div>
                    }

                    {/* {testDetails.length > 0 && <div className="tracks-container">
                    <h1 className="obj-heading">Competitions [Live]</h1>
                    <div className="d-flex cards-container">
                        {this.renderTests()}
                    </div>
                </div>} */}
                    {track_details.length > 0 &&
                        <div className="tracks-container">
                            <h1 className="obj-heading">Tracks</h1>
                            <div className="d-flex cards-container">
                                {track_details.map(eachTrack => {
                                    const arrayBufferView = new Uint8Array(eachTrack.image.data)
                                    const blob = new Blob([arrayBufferView], { type: 'image/png' })
                                    const imageUrl = URL.createObjectURL(blob)
                                    return <Card image={imageUrl} type="tracks" tier={tier} unqId={eachTrack.id} heading={eachTrack.title} desc={eachTrack.description} key={eachTrack.id} />
                                })}
                            </div>
                        </div>
                    }
                    <div className="footer">
                        <div className="container-fluid footer-con">
                            <div className="col-12 col-md-4 f-con-1">
                                <div className="f-logo">
                                    <p className='f-text1'>Learn</p>
                                    <p className='f-text1 f-text2'>Together</p>
                                </div>
                                <p className="f-desc">The club engages its members in a diverse range of activities, from collaborative coding sessions and hackathons to workshops on emerging technologies, fostering a dynamic and learning-oriented environment for passionate programmers.</p>
                            </div>
                            <div className="col-12 col-md-4 f-con-1">
                                <p className="f-title">Location<span className="p-2"><TiLocation /></span></p>
                                <p className="f-ad">CSE Department</p>
                                <p className="f-ad">RGUKT, RK VALLEY</p>
                                <p className="f-ad">IDUPULAPAYA, Y.S.R. KADAPA</p>
                                <p className="f-ad">ANDHRA PRADESH, PIN: 516330</p>
                                <p className="f-ad">BHARAT</p>
                                <br />
                                <p className="f-ad">Email: <a className="td-none" href="mailTo: cslt@rguktrkv.ac.in">cslt@rguktrkv.ac.in</a></p>
                            </div>
                            <div className="col-12 col-md-4 f-con-1">
                                <p className="f-title">For Queries<span className="p-2"><MdOutlineAlternateEmail /></span></p>
                                <br />
                                <p className="f-ad">Contact: <a className="td-none" href="mailTo: klaxminarayana2004@gmail.com">klaxminarayana2004@gmail.com</a></p>
                                <br />
                                <div className="f-smedia-con">
                                    <a href="https://www.instagram.com/learntogether_cse?igshid=YTQwZjQ0NmI0OA==" target="_blank" rel="noreferrer" className="f-smedia insta"><FaInstagram /></a>
                                    <a href="https://medium.com/@cslt" target="_blank" rel="noreferrer" className="f-smedia medium"><FaMedium /></a>
                                    <a href="https://www.linkedin.com/in/learn-together-1ab8492a4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noreferrer" className="f-smedia linked"><FaLinkedin /></a>
                                    <a href="https://x.com/LT_club_CSE?t=4sLCILtT9EbH3a4R5u2Xuw&s=09" target="_blank" rel="noreferrer" className="f-smedia medium"><FaXTwitter /></a>
                                </div>
                            </div>
                        </div>
                        <hr className="f-hr" />
                        <p className="f-end">Learn Together<span className="p-2"><FaRegCopyright /> 2023 - All Rights Reserved</span></p>
                    </div>
                </>
        )
    }
}

export default Home