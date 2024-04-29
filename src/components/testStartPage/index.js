import React, { Component } from "react"
import Header from "../header"

import './index.css'

class TestStartPage extends Component {
    state = { "testDetails": [] }

    componentDidMount() {
        this.fetchTestDetails()
        const token = window.localStorage.getItem("token")
        if (token === null) {
            window.location.replace('/login')
        }
    }

    fetchTestDetails = async () => {
        const testId = window.location.pathname.split("/")[2].split("_")[1]

        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ test_id: testId })
        };

        const response = await fetch("http://210.212.217.205:3003/get-test-details", options)
        const data = await response.json()
        this.setState({ "testDetails": data[0] })
    }

    render() {
        const { testDetails } = this.state
        const {id, name, type, minutes } = testDetails
        return (
            <>
                <Header />
                <div id="con" className="mcq-container">
                    <h1 className="mcq-heading">{name}</h1>
                    <p className="mcq-ins">Instructions:</p>
                    <ul className="obj-ul-mcq">
                        <li><b>Read Instructions Carefully: </b>Start by carefully reading any instructions provided at the beginning of the test. This may include information about the number of questions, time limits, and how to submit your answers.</li>
                        <li><b>Time Management: </b>You have {minutes} minutes to complete this test, with a total of 20 marks available. Allocate your time wisely to answer all questions within the given time frame.</li>
                        <li><b>Answer Every Question: </b>There is no penalty for guessing, so make sure to provide an answer for every question, even if you're unsure. It's better to guess than to leave a question unanswered. </li>
                        <li><b>Read Each Question Carefully: </b>Ensure you understand the question before choosing an answer. Be attentive to any negative phrasing or tricky wording.</li>
                        <li><b>Double-Check Your Work: </b>If time allows, review your answers before the {minutes} minutes are up. Look for any mistakes or overlooked questions.</li>
                        <li><b>Submit Your Test: </b>Ensure you submit your test within the allocated 20 minutes. Do not wait until the last minute, as technical issues or other unforeseen problems could prevent you from submitting on time.</li>

                    </ul>
                    <div className="st-container"><button className="st-btn" type="button" onClick={() => {
                        window.location.replace(`/${type}-test/${id}`)
                    }}>Start Test</button></div>
                </div>
            </>
        )
    }
}

export default TestStartPage