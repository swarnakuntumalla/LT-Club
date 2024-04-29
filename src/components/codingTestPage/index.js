import React, { Component } from 'react'
import Editor from "@monaco-editor/react";
import { BsFillPlayFill } from 'react-icons/bs'
import { ThreeDots } from 'react-loader-spinner';

import './index.css'

class CodingTestPage extends Component {
    state = {
        "timer": "",
        "min": "",
        "sec": "",
        "isLoading": true,
        "testDetails": [],
        "qDetails": { "sample_1": "", "sample_2": "" },
        "tcases": [],
        "lang": "python",
        "cin": false,
        "code": "All the best :)",
        "output": "",
        "input": "",
        "submit": false,
        "tcaseOuts": [],
        "tcaseIndex": 0
    }

    componentDidMount() {
        const token = window.localStorage.getItem("token")
        if (token === null) {
            window.location.replace('/login')
        }
        this.fetchTestDetails()
        this.startTimer()
    }

    startTimer = () => {
        const timer = setInterval(() => {
            const { min, sec } = this.state
            if (parseInt(min) === 0 && parseInt(sec) === 0) {
                this.endTest()
                clearInterval(timer)
            } else if (parseInt(sec) === 0) {
                this.setState(prev => ({ "min": parseInt(prev.min) - 1, "sec": "59" }))
            } else {
                this.setState(prev => ({ "sec": parseInt(prev.sec) - 1 }))
            }
        }, 1000);
        this.setState({ timer })
    }

    fetchTestDetails = async () => {
        const testId = window.location.pathname.split("/")[2]

        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ test_id: testId })
        };

        const response = await fetch("http://210.212.217.205:3003/get-test-details", options)
        const data = await response.json()
        const response1 = await fetch("http://210.212.217.205:3003/get-coding-question-details", options)
        const data1 = await response1.json()
        this.setState({ "testDetails": data[0], "qDetails": data1[0], "isLoading": false, "min": data[0].minutes, "sec": data[0].seconds })
    }

    changeLang = event => {
        this.setState({ "lang": event.target.value })
    }
    changeCode = event => {
        this.setState({ "code": event })
    }
    changeInput = event => {
        this.setState({ "input": event.target.value })
    }
    customInput = () => {
        this.setState(prev => ({ "cin": !prev.cin, "submit": false }))
        window.scrollTo(0, 900)
    }
    changeTcase = (e, i) => {
        this.setState({"tcaseIndex": i})
    }

    runCode = async () => {
        const { code, input, lang } = this.state
        this.setState({ 'submit': false })

        const apiCode = {
            code: code,
            input: input,
            lang: lang
        }
        var oData = await fetch("http://210.212.217.205:3003/compile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiCode)
        })
        var d = await oData.json()
        if (d.output !== undefined) {
            this.setState({ "output": d.output })
        } else {
            this.setState({ "output": d.error })
        }

        window.scrollTo(0, 1000);
    }

    submitCode = async () => {
        const { qDetails, code } = this.state
        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q_id: qDetails.id })
        };

        const response = await fetch("http://210.212.217.205:3003/get-testcases", options)
        const data = await response.json()

        for (let i = 0; i < data.length; i++) {
            const tcase = data[i];
            const { tcaseOuts, lang } = this.state
            const apiCode = {
                code: code,
                input: tcase.tcase.split("~")[0].replace(/\\n/g, "\n"),
                lang: lang
            }
            var oData = await fetch("http://210.212.217.205:3003/compile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiCode)
            })
            var d = await oData.json()
            d.error === undefined ? tcaseOuts.push({ "expOut": tcase.tcase.split("~")[1].replace(/\\n/g, "\n"), "yourOut": d.output }) :
                tcaseOuts.push({ "expOut": tcase.tcase.split("~")[1].replace(/\\n/g, "\n"), "yourOut": d.error })
            this.setState({ tcaseOuts })
        }
        this.setState({"submit": true})
        window.scrollTo(0, 1000);

    }

    endTest = async () => {
        const st_id = window.localStorage.getItem("st_id")
        const {qDetails, code} = this.state
        const testId = window.location.pathname.split("/")[2]
        const {id} = qDetails

        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({st_id, test_id: testId, q_id: id, code })
        };

        const response = await fetch("http://210.212.217.205:3003/submit-coding-test", options)
        const data = await response.json()
        alert(data)
        if (response.ok){
            window.location.replace("/")
        }
    }

    renderLoader = () => {
        return (
            <div className='d-flex justify-content-center m-5'>
                <ThreeDots
                    height="80"
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

    renderTcases = () => {
        const {tcaseOuts, tcaseIndex} = this.state
        const elements = []
        for (let i = 0; i < tcaseOuts.length; i++) {
            elements.push(
                <p onClick={(e) => this.changeTcase(e, i)} key={i} className={`tcase-sel ${i === tcaseIndex && "sel-tcase"}`}>Test Case - {i+1}</p>
            )
        }
        return elements
    }

    renderTest = () => {
        const { testDetails, lang, cin, input, output, submit, qDetails, min, sec, tcaseOuts, tcaseIndex } = this.state
        const { name } = testDetails
        const { q_heading, q_description, sample_1, sample_2, explanation, constrs } = qDetails
        const options = {
            "quickSuggestions": false,
        }
        return (
            <div id='testEle'>
                <nav className="ct-navbar fixed-top bg-light">
                    <div className='ct-nav-header'>
                        <h1 className='ct-name'>{name}</h1>
                        <div className='timer-con'>
                            <p>{parseInt(min) < 10 && 0}{min} : {parseInt(sec) < 10 && 0}{sec}</p>
                        </div>
                        <button onClick={this.endTest} className='et-btn'>End Test</button>
                    </div>
                </nav>
                <div className='cq-con'>
                    <div className='desc-con'>
                        <h1 className='qhead'>{q_heading}</h1>
                        <h1 className='desc-heading'>Description:</h1>
                        <textarea rows={Math.ceil(q_description.length / 21)} className='cq-desc' value={q_description.replace(/\\n/g, "\n")} readOnly ></textarea>
                        <p className='sample-heading'>Sample Input-1</p>
                        <textarea value={sample_1.split("~")[0].replace(/\\n/g, "\n")} className='sinput' readOnly></textarea>
                        <p className='sample-heading'>Sample Output-1</p>
                        <textarea value={sample_1.split("~")[1].replace(/\\n/g, "\n")} className='sinput' readOnly></textarea>
                        <p className='sample-heading'>Sample Input-2</p>
                        <textarea value={sample_2.split("~")[0].replace(/\\n/g, "\n")} className='sinput' readOnly></textarea>
                        <p className='sample-heading'>Sample Output-2</p>
                        <textarea value={sample_2.split("~")[1].replace(/\\n/g, "\n")} className='sinput' readOnly></textarea>
                        <p className='sample-heading'>Explanation:</p>
                        <textarea rows={Math.ceil(explanation.length / 21)} className='cq-desc' value={explanation.replace(/\\n/g, "\n")} readOnly ></textarea>
                        <p className='sample-heading'>Constraints:</p>
                        <textarea rows={Math.ceil(constrs.length / 21)} className='cq-desc' value={constrs.replace(/\\n/g, "\n")} readOnly ></textarea>
                    </div>
                    <div className='coding-con'>
                        <div className="ct-select-con">
                            <select className="form-select ct-select-lang" onChange={this.changeLang}>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="javascript">Javascript</option>
                                <option value="c">C</option>
                                <option value="cpp">Cpp</option>
                            </select>
                        </div>
                        <div className='ce-con'>
                            <Editor
                                height="65vh"
                                width={`100%`}
                                language={lang}
                                theme="vs-light"
                                defaultValue={"All the best :)"}
                                options={options}
                                onChange={this.changeCode}
                            />
                        </div>
                        <div className='run-btn-con'>
                            <label className="ct-switch">
                                <input id='input-check' type="checkbox" onChange={this.customInput} />
                                <span className="ct-slider ct-round"></span>
                            </label>
                            <label className='ct-check-label' htmlFor='input-check'>Custom Input</label>
                            <button onClick={this.runCode} className='ct-run-btn'><BsFillPlayFill /></button>
                            <button onClick={this.submitCode} className='ct-run-btn ct-sub-btn'>Submit</button>
                        </div>

                    </div>

                </div>
                <div className='outputs-con'>
                    {!submit ? (<div className='d-flex'>
                        {cin && (
                            <div className='m-3 col-3'>
                                <h4 className='ct-in-text'>Input</h4>
                                <textarea value={input} className='ct-in-tarea' rows={10} onChange={this.changeInput} ></textarea>
                            </div>
                        )}
                        <div id="o-div" className={`m-3 ${cin ? 'col-8' : "col-11"}`}>
                            <h4 className='ct-in-text'>Output</h4>
                            <textarea className='ct-in-tarea' rows={10} value={output} readOnly></textarea>
                        </div>
                    </div>) :
                        (<div>
                            <div className='tcase-container'>
                            {this.renderTcases()}
                            </div>
                            <div className='d-flex'>
                                <div className='m-3'>
                                    <h4 className='ct-in-text'>Expected Output</h4>
                                    <textarea className='ct-in-tarea ct-tcase-tarea' rows={10} value={tcaseOuts[tcaseIndex].expOut} readOnly></textarea>
                                </div>
                                <div className='m-3'>
                                    <h4 className='ct-in-text'>Your Output</h4>
                                    <textarea className='ct-in-tarea ct-tcase-tarea' rows={10} value={tcaseOuts[tcaseIndex].yourOut} readOnly></textarea>
                                </div>
                            </div>
                        </div>)}
                </div>
            </div>
            
        )
    }

    render() {
        const { isLoading } = this.state

        return (
            isLoading ? this.renderLoader() : this.renderTest()

        )
    }
}

export default CodingTestPage