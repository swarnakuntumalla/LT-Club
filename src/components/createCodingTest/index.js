import React, { Component } from "react";
import { BiArrowBack, BiUpload } from 'react-icons/bi'

import '../createMCQ/index.css'

class CreateCodingTest extends Component {
    state = {
        "testName": "",
        "testDesc": "",
        "time": { "min": "", "sec": "" },
        "cq": [{
            "qNo": 1,
            "qHeading": "",
            "qDesc": "",
            "samples": [{ "in": "", "out": "" }, { "in": "", "out": "" }],
            "exp": "",
            "constrs": "",
            "tcaseCount": 2,
            "tcases": [{ "in": "", "out": "" }, { "in": "", "out": "" }],
        }],
    }

    componentDidMount(){
        const token = window.localStorage.getItem("token")
        if (token === null) {
            window.location.replace('/login')
        }
        const tier = window.localStorage.getItem("tier")
        parseInt(tier) === 3 && window.location.replace("/")
    }

    clickBack = () => {
        window.location.replace("/");
    }

    clickClear = () => {
        this.setState({
            "testName": "",
            "testDesc": "",
            "time": { "min": "", "sec": "" },
            "cq": [{
                "qNo": 1,
                "qHeading": "",
                "qDesc": "",
                "samples": [{ "in": "", "out": "" }, { "in": "", "out": "" }],
                "exp": "",
                "constrs": "",
                "tcaseCount": 2,
                "tcases": [{ "in": "", "out": "" }, { "in": "", "out": "" }],
            }],
        }
        )
    }

    clickUpload = async e => {
        const { testName, testDesc, time, cq } = this.state
        if (testName === "" || testDesc === "" || time.min === "" || time.sec === "") {
            return
        }
        for (let i = 0; i < cq.length; i++) {
            if (cq[i].qHeading === "" || cq[i].qDesc === "" || cq[i].exp === "" || cq[i].constrs === "") {
                return
            } if (cq[i].samples[0][0] === "" || cq[i].samples[0][1] === "" || cq[i].samples[1][0] === "" || cq[i].samples[1][1] === "") {
                return
            }
            for (let o = 0; o < cq[i].tcaseCount; o++) {
                if (cq[i].tcases[o].in === "" || cq[i].tcases[o].out === "") {
                    return
                }
            }
        }
        e.preventDefault()
        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ testName, testDesc, time, cq })
        }
        const response = await fetch("http://210.212.217.205:3003/upload-cq", options)
        const data = await response.json()
        console.log(data)
        alert(data)
        if (response.ok) {
            window.location.replace("/")
        } else {
            window.location.reload()
        }
    }

    changeTestName = event => {
        this.setState({ "testName": event.target.value })
    }

    changeTestDesc = event => {
        this.setState({ "testDesc": event.target.value })
    }

    changeTimeMin = event => {
        const { time } = this.state
        time.min = event.target.value
        this.setState({ time })
    }

    changeTimeSec = event => {
        const { time } = this.state
        time.sec = event.target.value
        this.setState({ time })
    }

    changeQHead = (e, i) => {
        const { cq } = this.state
        cq[i].qHeading = e.target.value
        this.setState({ cq })
    }

    changeQDesc = (e, i) => {
        const { cq } = this.state
        cq[i].qDesc = e.target.value
        this.setState({ cq })
    }

    changeSin1 = (e, i) => {
        const { cq } = this.state
        cq[i].samples[0].in = e.target.value
        this.setState({cq})
    }
    changeSout1 = (e, i) => {
        const { cq } = this.state
        cq[i].samples[0].out = e.target.value
        this.setState({cq})
    }
    changeSin2 = (e, i) => {
        const { cq } = this.state
        cq[i].samples[1].in = e.target.value
        this.setState({cq})
    }
    changeSout2= (e, i) => {
        const { cq } = this.state
        cq[i].samples[1].out = e.target.value
        this.setState({cq})
    }
    changeExp = (e, i) => {
        const {cq} = this.state
        cq[i].exp = e.target.value
        this.setState({cq})
    }
    changeConstrs = (e, i) => {
        const {cq} = this.state
        cq[i].constrs = e.target.value
        this.setState({cq})
    }
    changeTcaseIn = (event, qNo, i) => {
        const { cq } = this.state
        cq[qNo - 1].tcases[i].in = event.target.value
        this.setState({ cq })
    }
    changeTcaseOut = (event, qNo, i) => {
        const { cq } = this.state
        cq[qNo - 1].tcases[i].out = event.target.value
        this.setState({ cq })
    }

    addQue = () => {
        this.setState(prev => ({
            "cq": [...prev.cq, {
                "qNo": prev.cq.qNo + 1,
                "qHeading": "",
                "qDesc": "",
                "samples": [{ "in": "", "out": "" }, { "in": "", "out": "" }],
                "exp": "",
                "constrs": "",
                "tcaseCount": 2,
                "tcases": [{ "in": "", "out": "" }, { "in": "", "out": "" }],
            }]
        }))
    }
    rmQue = () => {
        const { cq } = this.state
        if (cq.length > 1) {
            cq.pop()
            this.setState({ cq })
        }
    }

    addTcase = i => {
        const { cq } = this.state
        cq[i].tcaseCount += 1
        cq[i].tcases.push({ "in": "", "out": "" })
        this.setState({ cq })
    }

    removeTestcase = i => {
        const { cq } = this.state
        if (cq[i].tcaseCount > 2) {
            cq[i].tcaseCount -= 1
            cq[i].tcases.pop()
            this.setState({ cq })
        }
    }

    renderQuestions = (cq) => {
        let elements = []
        for (let i = 0; i < cq.length; i++) {
            elements.push(<div className="d-flex flex-column flex-lg-row">
                <div className="p-5">
                    <div className="d-flex">
                        <p className="que-no">{i + 1}. Heading of the Question: </p>
                        <input value={cq[i].qHeading} type="text" onChange={e => this.changeQHead(e, i)} className="mcq-input mcq-opt" required />
                    </div>
                    <div className="p-3">
                        <p className="que-no">Description: </p>
                        <textarea value={cq[i].qDesc} onChange={e => this.changeQDesc(e, i)} className="mcq-input cq-que code-exp" required></textarea>
                    </div>
                    <div className="d-flex" >
                        <div className="opt-list">
                            <p>Sample input - 1</p>
                            <textarea value={cq[i].samples[0].in} onChange={e => this.changeSin1(e, i)} className="mcq-input mcq-opt c-in" required></textarea>
                        </div>
                        <div className="opt-list">
                            <p>Sample output - 1</p>
                            <textarea value={cq[i].samples[0].out} onChange={e => this.changeSout1(e, i)} className="mcq-input mcq-opt c-in" required></textarea>
                        </div>
                    </div>
                    <div className="d-flex mt-3" >
                        <div className="opt-list">
                            <p>Sample input - 2</p>
                            <textarea value={cq[i].samples[1].in} onChange={e => this.changeSin2(e, i)} className="mcq-input mcq-opt c-in" required></textarea>
                        </div>
                        <div className="opt-list">
                            <p>Sample output - 2</p>
                            <textarea value={cq[i].samples[1].out} onChange={e => this.changeSout2(e, i)} className="mcq-input mcq-opt c-in" required></textarea>
                        </div>
                    </div>
                    <div className="opt-list mt-5">
                        <p>Explanation : </p>
                        <textarea value={cq[i].exp} onChange={e => this.changeExp(e, i)} className="mcq-input mcq-opt" required></textarea>
                    </div>
                    <div className="opt-list mt-5">
                        <p>Constraints : </p>
                        <textarea value={cq[i].constrs} onChange={e => this.changeConstrs(e, i)} className="mcq-input mcq-opt" required></textarea>
                    </div>
                    <div className="tcases-list">
                        {this.renderTcases(cq[i])}
                    </div>
                    <button className="back-btn add-btn" type="button" onClick={e => this.addTcase(i)}>+ Add Testcase</button>
                    {(cq[i].tcaseCount > 2) && <button className="back-btn add-btn trash-btn" type="button" onClick={e => this.removeTestcase(i)}>- Remove Testcase</button>}
                </div>
            </div>)
        }
        return elements
    }

    renderTcases = question => {
        let elements = []
        for (let i = 0; i < question.tcaseCount; i++) {
            elements.push(
                <>
                    <p className="tcase">Test Case - {i + 1}</p>
                    <div className="d-flex" >
                        <div className="opt-list">
                            <p>Input :</p>
                            <textarea value={question.tcases[i].in} onChange={e => this.changeTcaseIn(e, question.qNo, i)} className="mcq-input mcq-opt c-in" required></textarea>
                        </div>
                        <div className="opt-list">
                            <p>Output :</p>
                            <textarea value={question.tcases[i].out} onChange={e => this.changeTcaseOut(e, question.qNo, i)} className="mcq-input mcq-opt c-in" required></textarea>
                        </div>
                    </div>
                </>
            )
        }
        return elements
    }

    render() {
        const { cq, testName, time, testDesc } = this.state
        return (
            <div>
                <div className="mcq-header">
                    <button onClick={this.clickBack} className="back-btn" type="button">
                        <BiArrowBack />
                    </button>
                    <div className="d-flex">
                        <button onClick={this.clickClear} className="back-btn clear-btn" type="button">
                            Clear
                        </button>
                        <button form="cq-form" onClick={this.clickUpload} className="back-btn" type="submit">
                            <BiUpload />
                        </button>
                    </div>
                </div>
                <form id="cq-form" className="m-3">
                    <div className="d-flex">
                        <p className="test-name">Name of the test : </p>
                        <input type="text" value={testName} onChange={this.changeTestName} className="mcq-input mcq-opt" required />
                    </div>
                    <div className="d-flex mt-3">
                        <p className="test-name">Some Description: </p>
                        <textarea value={testDesc} onChange={this.changeTestDesc} className="mcq-input mcq-que mt-2" required></textarea>
                    </div>
                    <div className="d-flex mt-3 mb-3">
                        <p className="test-name">Time :</p>
                        <input type="number" placeholder="min" min="0" max="59" value={time.min} onChange={this.changeTimeMin} className="time-input" required />
                        <p className="test-name">:</p>
                        <input type="number" placeholder="sec" min="0" max="59" value={time.sec} onChange={this.changeTimeSec} className="time-input" required />

                    </div>
                    <p className="test-name mt-5">Enter details of each question: </p>
                    {this.renderQuestions(cq)}
                </form>
                <div className="d-flex que-controls">
                    <button className="back-btn add-btn" type="button" onClick={this.addQue}>+ Add Question</button>
                    {(cq.length > 1) && <button className="back-btn add-btn trash-btn" type="button" onClick={this.rmQue}>- Remove Question</button>}
                </div>

            </div>
        )
    }
}

export default CreateCodingTest