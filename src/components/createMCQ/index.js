import React, { Component } from "react";
import { BiArrowBack, BiUpload } from 'react-icons/bi'

import { TiTick } from 'react-icons/ti'
import { RxCross2 } from 'react-icons/rx'
import { FcAddImage } from 'react-icons/fc'

import './index.css'

class CreateMCQ extends Component {
    state = {
        "testName": "",
        "desc": "",
        "time": { "min": "", "sec": "" },
        "mcq": [{
            "qNo": 1,
            "question": "",
            "optCount": 2,
            "options": ["", ""],
            "crtOpt": 0,
            "image": "",
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
            "desc": "",
            "time": { "min": "", "sec": "" },
            "mcq": [{
                "qNo": 1,
                "question": "",
                "optCount": 2,
                "options": ["", ""],
                "crtOpt": 0,
                "image": "",
            }],
        })
    }

    clickUpload = async e => {
        const { testName, desc, time, mcq } = this.state
        if (testName === "" || desc === "" || time.min === "" || time.sec === "") {
            return
        }
        for (let i = 0; i < mcq.length; i++) {
            if (mcq[i].question === "") {
                return
            }
            for (let o = 0; o < mcq[i].optCount; o++) {
                if (mcq[i].options[o] === "") {
                    return
                }
            }
        }
        e.preventDefault()
        let imageData = new FormData()

        for (let i = 0; i < mcq.length; i++) {
            const element = mcq[i]
            imageData.append("images",element.image)
            
        }

        imageData.append("json_data", JSON.stringify({ testName, desc, time, mcq }))

        let options = {
            method: "POST",
            body: imageData,
        }
        const response = await fetch("http://210.212.217.205:3003/upload-mcq", options)
        const data = await response.json()
        if (response.ok){
            alert(data)
            window.location.replace("/")
        } else {
            alert("Error uploading MCQ!")
            window.location.reload()
        }
    }

    changeTestName = event => {
        this.setState({ "testName": event.target.value })
    }

    changeDesc = event => {
        this.setState({ "desc": event.target.value })
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

    addQue = () => {
        this.setState(prev => ({
            "mcq": [...prev.mcq, {
                "qNo": prev.mcq.length + 1,
                "question": "",
                "optCount": 2,
                "options": ["", ""],
                "crtOpt": 0,
                "image": "",
            }]
        }))
    }
    rmQue = () => {
        const { mcq } = this.state
        if (mcq.length > 1) {
            mcq.pop()
            this.setState({ mcq })
        }
    }

    changeQuestion = (event, i) => {
        const { mcq } = this.state
        mcq[i].question = event.target.value
        this.setState({ mcq })
    }

    changeOption = (event, qNo, i) => {
        const { mcq } = this.state
        mcq[qNo - 1].options[i] = event.target.value
        this.setState({ mcq })
    }

    clickCrtOpt = (qNo, crtOpt) => {
        const { mcq } = this.state
        mcq[qNo - 1].crtOpt = crtOpt
        this.setState({ mcq })
    }

    addOption = i => {
        const { mcq } = this.state
        mcq[i].optCount += 1
        mcq[i].options.push("")
        this.setState({ mcq })
    }

    removeOption = i => {
        const { mcq } = this.state
        if (mcq[i].optCount > 2) {
            mcq[i].optCount -= 1
            mcq[i].options.pop()
            if (mcq[i].crtOpt >= mcq[i].optCount) {
                mcq[i].crtOpt = 0;
            }
            this.setState({ mcq })
        }
    }

    selectImage = (imgId, i) => {
        let imgInput = document.getElementById(imgId)
        let imgErr = document.getElementById(`img-err${i + 1}`)
        const { mcq } = this.state
        if (imgInput.files[0] !== undefined) {
            if (imgInput.files[0].size < 999999) {
                imgErr.classList.add("d-none")
                mcq[i].image = imgInput.files[0]
                this.setState(mcq)
            } else {
                imgErr.classList.remove("d-none")
            }
        }
    }

    deleteImg = i => {
        const { mcq } = this.state
        mcq[i].image = ""
        this.setState(mcq)
    }

    renderQuestions = (mcq) => {
        let elements = []
        for (let i = 0; i < mcq.length; i++) {
            elements.push(<div className="d-flex flex-column flex-lg-row">
                <div>
                    <div className="p-3 d-flex">
                        <p className="que-no">{i + 1}.</p>
                        <textarea value={mcq[i].question} onChange={e => this.changeQuestion(e, i)} className="mcq-input mcq-que" required></textarea>
                    </div>
                    <ol className="opt-list">
                        {this.renderOptions(mcq[i])}
                    </ol>
                    <button className="back-btn add-btn" type="button" onClick={e => this.addOption(i)}>+ Add Option</button>
                    {(mcq[i].optCount > 2) && <button className="back-btn add-btn trash-btn" type="button" onClick={e => this.removeOption(i)}>- Remove Option</button>}
                </div>
                <div className="d-flex flex-lg-column text-center">
                    <div className="img-input-div d-flex flex-column">
                        {mcq[i].image === "" ? <FcAddImage className="img-icon" /> :
                            <img src={URL.createObjectURL(mcq[i].image)} className="mcq-img" alt={`img${i + 1}`} />}
                        <input id={`img${i + 1}`} onChange={e => this.selectImage(`img${i + 1}`, i)} type="file" className="img-file" accept="image/png, image/jpeg, image/jpg" />
                    </div>
                    {mcq[i].image !== "" && <button onClick={e => this.deleteImg(i)} className="back-btn trash-btn" type="button">
                        <RxCross2 />
                    </button>}
                    <p id={`img-err${i + 1}`} className="img-limit-err d-none">Image size exceed limit of 1MB</p>
                </div>
            </div>)
        }
        return elements

    }

    renderOptions = question => {
        let elements = []
        for (let i = 0; i < question.optCount; i++) {
            elements.push(
                <>
                    <li><input value={question.options[i]} onChange={e => this.changeOption(e, question.qNo, i)} type="text" className="mcq-input mcq-opt" required />
                        {question.crtOpt === i ? (<button onClick={e => this.clickCrtOpt(question.qNo, i)} className="back-btn" type="button">
                            <TiTick />
                        </button>) : (<button onClick={e => this.clickCrtOpt(question.qNo, i)} className="back-btn trash-btn" type="button">
                            <RxCross2 />
                        </button>)}
                    </li>
                </>
            )
        }
        return elements
    }


    render() {
        const { mcq, testName, time, desc } = this.state
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
                        <button form="mcq-form" onClick={this.clickUpload} className="back-btn" type="submit">
                            <BiUpload />
                        </button>
                    </div>
                </div>
                <form id="mcq-form" className="m-3">
                    <div className="d-flex">
                        <p className="test-name">Name of the test : </p>
                        <input type="text" value={testName} onChange={this.changeTestName} className="mcq-input mcq-opt" required />
                    </div>
                    <div className="d-flex mt-3">
                        <p className="test-name">Some Description: </p>
                        <textarea value={desc} onChange={this.changeDesc} className="mcq-input mcq-que mt-2" required></textarea>
                    </div>
                    <div className="d-flex mt-3 mb-3">
                        <p className="test-name">Time :</p>
                        <input type="number" placeholder="min" min="0" max="59" value={time.min} onChange={this.changeTimeMin} className="time-input" required />
                        <p className="test-name">:</p>
                        <input type="number" placeholder="sec" min="0" max="59" value={time.sec} onChange={this.changeTimeSec} className="time-input" required />

                    </div>
                    {this.renderQuestions(mcq)}
                </form>
                <div className="d-flex que-controls">
                    <button className="back-btn add-btn" type="button" onClick={this.addQue}>+ Add Question</button>
                    {(mcq.length > 1) && <button className="back-btn add-btn trash-btn" type="button" onClick={this.rmQue}>- Remove Question</button>}
                </div>

            </div>
        )
    }
}

export default CreateMCQ