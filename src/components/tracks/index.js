import React, { Component } from "react"
import Header from "../header"
import Modal from 'react-modal'
import { MdModeEdit } from "react-icons/md"
import { FaPlus, FaTrash } from "react-icons/fa"
import { TiTick } from "react-icons/ti"
import { FcAddImage } from 'react-icons/fc'
import { ThreeDots } from 'react-loader-spinner'
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb"
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb"

import Editor from "@monaco-editor/react"

import './index.css'

class Track extends Component {
    state = {
        "topics": [], "modalIsOpen": false, "smodalIsOpen": false, "delTopic": "", "delSTopic": "", "delStField": "", "stEditMode": false, "sfmodalIsOpen": false,
        "subTopicDetails": [], "delStDetails": [], "isLoadingTDetails": true, "isLoadingStDetails": true, "slide": false, "tier": 3
    }

    componentDidMount() {
        this.setState({"isLoadingTDetails": true, "isLoadingStDetails": true})
        this.getTier()
        this.fetchTopicDetails()
        this.fetchSubTopicDetails()
    }

    componentDidUpdate(){
        const {topics} = this.state
        const renderedTopics = this.renderTopics(topics)
        document.getElementById(renderedTopics[1]) !== null && document.getElementById(renderedTopics[1]).scrollIntoView({
            block: 'center'
        })
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

    fetchTopicDetails = async () => {
        const trackId = window.location.pathname.split("/")[2]
        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "track_id": trackId })
        }
        const response = await fetch("http://210.212.217.205:3003/get-topic-details", options)
        const data = response.json()
        data.then((result) => {
            this.setState({ "topics": result, "isLoadingTDetails": false })
        })
    }

    fetchSubTopicDetails = async () => {
        const stId = window.location.pathname.split("/")[3]
        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "st_id": stId })
        }
        const response = await fetch("http://210.212.217.205:3003/get-subtopic-details", options)
        const data = response.json()
        data.then((result) => {
            this.setState({ "subTopicDetails": result, "isLoadingStDetails": false  })
        })
    }

    clickSubTopic = (e, i, j) => {
        const { topics } = this.state
        const trackId = window.location.pathname.split("/")[2]
        window.location.assign(`/tracks/${trackId}/${topics[i].subTopics[j].id}`)
    }

    clickAddStopic = async (e, i) => {
        this.setState({"isLoadingTDetails": true })
        const { topics } = this.state
        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "topic_id": topics[i].id, "title": "New Sub Topic" })
        }
        await fetch("http://210.212.217.205:3003/add-new-stopic", options).then(() => {
            this.fetchTopicDetails()
        })
    }

    clickTopicEdit = (e, i) => {
        const mtConEle = document.getElementById(`mt-con-${i}`)
        const emtConEle = document.getElementById(`mt-con-${i}-e`)
        mtConEle.classList.add("d-none")
        emtConEle.classList.remove("d-none")
    }

    clickTopicOk = async (e, i) => {
        const { topics } = this.state
        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "topic": topics[i] })
        }
        await fetch("http://210.212.217.205:3003/edit-topic", options).then(() => {
            this.fetchTopicDetails()
            const mtConEle = document.getElementById(`mt-con-${i}`)
            const emtConEle = document.getElementById(`mt-con-${i}-e`)
            mtConEle.classList.remove("d-none")
            emtConEle.classList.add("d-none")
        })
    }

    changeTopic = (e, i) => {
        const { topics } = this.state
        topics[i].title = e.target.value
        this.setState({ topics })
    }

    clickTopicDel = async () => {
        const { topics, delTopic } = this.state
        this.setState({"isLoadingTDetails": true })

        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "topic_id": topics[delTopic].id })
        }
        await fetch("http://210.212.217.205:3003/del-topic", options).then(() => {
            this.fetchTopicDetails()
            this.setState({ "modalIsOpen": false, "delTopic": "" })
        })
    }

    clickSTopicEdit = (e, i, j) => {
        const stConEle = document.getElementById(`st-con-${i}${j}`)
        const estConEle = document.getElementById(`st-con-${i}${j}-e`)
        stConEle.classList.add("d-none")
        estConEle.classList.remove("d-none")
    }

    changeSTopic = (e, i, j) => {
        const { topics } = this.state
        topics[i].subTopics[j].title = e.target.value
        this.setState({ topics })
    }

    clickSTopicOk = async (e, i, j) => {
        const { topics } = this.state
        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "stopic": topics[i].subTopics[j] })
        }
        await fetch("http://210.212.217.205:3003/edit-stopic", options).then(() => {
            this.fetchTopicDetails()
            const stConEle = document.getElementById(`st-con-${i}${j}`)
            const estConEle = document.getElementById(`st-con-${i}${j}-e`)
            stConEle.classList.remove("d-none")
            estConEle.classList.add("d-none")
        })
    }

    clickSTopicDel = async () => {
        const { topics, delSTopic } = this.state
        this.setState({"isLoadingTDetails": true })

        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "stopic_id": topics[delSTopic[0]].subTopics[delSTopic[1]].id })
        }
        await fetch("http://210.212.217.205:3003/del-stopic", options).then(() => {
            this.fetchTopicDetails()
            this.setState({ "smodalIsOpen": false, "delSTopic": "" })
        })
    }

    clickAddtopic = async () => {
        const trackId = window.location.pathname.split("/")[2]
        this.setState({"isLoadingTDetails": true })

        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "title": "New Topic", "track_id": trackId })
        }
        await fetch("http://210.212.217.205:3003/add-new-topic", options).then(() => {
            this.fetchTopicDetails()
        })
    }

    renderTopics = topics => {
        const selStopicId = window.location.pathname.split("/")[3]
        const elements = []
        const {tier} = this.state
        let selSubTopicId = ""

        for (let i = 0; i < topics.length; i++) {
            const name = topics[i].title
            const subTopics = topics[i].subTopics
            const subElements = []
            for (let j = 0; j < subTopics.length; j++) {
                let selst = ""
                if (selStopicId === subTopics[j].id){
                    selst = "sel-st"
                    selSubTopicId = `s-topic-${i}${j}`
                }

                subElements.push(
                    <div key={`stopic-${i}${j}`}>
                        <div id={`st-con-${i}${j}`} className="main-topic-con">
                            <p id={`s-topic-${i}${j}`} onClick={e => (this.clickSubTopic(e, i, j))} className={`s-topic-name ${selst}`}>{subTopics[j].title}</p>
                            {tier < 3 && <>
                                <button onClick={e => (this.clickSTopicEdit(e, i, j))} type="button" className="mod-btn p-2"><MdModeEdit /></button>
                                <button onClick={e => this.openSModal(e, i, j)} type="button" className="mod-btn p-2"><FaTrash /></button>
                            </>}
                        </div>
                        <div id={`st-con-${i}${j}-e`} className="main-topic-con d-none">
                            <input onChange={e => (this.changeSTopic(e, i, j))} value={subTopics[j].title} className="s-topic-name st-in" />
                            <div>
                                <button onClick={e => (this.clickSTopicOk(e, i, j))} type="button" className="mod-btn p-2"><TiTick /></button>
                            </div>
                        </div>
                    </div>)
            }
            elements.push(
                <div key={`topic-${i}`}>
                    <div id={`mt-con-${i}`} className="main-topic-con">
                        <h1 className="main-topic">{name}</h1>
                        {tier < 3 && <div>
                            <button onClick={e => (this.clickAddStopic(e, i))} type="button" className="mod-btn"><FaPlus /></button>
                            <button onClick={e => (this.clickTopicEdit(e, i))} type="button" className="mod-btn"><MdModeEdit /></button>
                            <button onClick={e => this.openModal(e, i)} type="button" className="mod-btn"><FaTrash /></button>
                        </div>}
                    </div>
                    <div id={`mt-con-${i}-e`} className="main-topic-con d-none">
                        <input onChange={e => (this.changeTopic(e, i))} value={name} className="main-topic mt-in" />
                        <div>
                            <button onClick={e => (this.clickTopicOk(e, i))} type="button" className="mod-btn"><TiTick /></button>
                        </div>
                    </div>
                    <div className="sub-topics">
                        {subElements}
                    </div>
                </div>
            )
        }

        return [elements, selSubTopicId]
    }

    openModal = (e, i) => {
        this.setState({ "modalIsOpen": true, "delTopic": i })
    }
    closeModal = () => {
        this.setState({ "modalIsOpen": false })
    }
    openSModal = (e, i, j) => {
        this.setState({ "smodalIsOpen": true, "delSTopic": [i, j] })
    }
    closeSModal = () => {
        this.setState({ "smodalIsOpen": false })
    }
    changeStTitle = (e, i) => {
        const { subTopicDetails } = this.state
        subTopicDetails[i].value = e.target.value
        subTopicDetails[i].changed = true
        this.setState({ subTopicDetails })
    }
    changeStDesc = (e, i) => {
        const { subTopicDetails } = this.state
        subTopicDetails[i].value = e.target.value
        subTopicDetails[i].changed = true
        this.setState({ subTopicDetails })
    }
    selectImage = (imgId, i) => {
        let imgInput = document.getElementById(imgId)
        let imgErr = document.getElementById(`img-err${i + 1}`)
        const { subTopicDetails } = this.state
        if (imgInput.files[0] !== undefined) {
            if (imgInput.files[0].size < 999999) {
                imgErr.classList.add("d-none")
                subTopicDetails[i].value = imgInput.files[0]
                subTopicDetails[i].changed = true
                this.setState({ subTopicDetails })
            } else {
                imgErr.classList.remove("d-none")
            }
        }
    }
    changeStCode = (e, i) => {
        const { subTopicDetails } = this.state
        subTopicDetails[i].value = e
        subTopicDetails[i].changed = true
        this.setState({ subTopicDetails })
    }
    changeLang = (e, i) => {
        const { subTopicDetails } = this.state
        subTopicDetails[i].lang = e.target.value
        subTopicDetails[i].changed = true
        this.setState({ subTopicDetails })
    }

    clickStEditBtn = () => {
        this.setState({ "stEditMode": true })
    }
    clickStOkBtn = async () => {
        const stId = window.location.pathname.split("/")[3]
        const { subTopicDetails, delStDetails } = this.state
        this.setState({"isLoadingStDetails": true })
        let formData = new FormData()
        const otherData = []

        for (let i = 0; i < subTopicDetails.length; i++) {
            const element = subTopicDetails[i]
            if (element.id === "img") {
                if (element.value !== "") {
                    formData.append("images", element.value)
                    otherData.push(element)
                }
            } else { otherData.push(element) }
        }

        formData.append("json_data", JSON.stringify({ otherData }))
        formData.append("del_data", JSON.stringify({ delStDetails }))
        formData.append("st_id", stId)

        let options = {
            method: "POST",
            body: formData,
        }
        await fetch("http://210.212.217.205:3003/update-subtopic", options)
            .then(() => {
                this.fetchSubTopicDetails()
                this.setState({ "stEditMode": false })
            })

    }

    clickAddTitle = () => {
        const { subTopicDetails } = this.state
        subTopicDetails.push({ "id": "title", "value": "New Title" })
        this.setState({ subTopicDetails })
    }
    clickAddDesc = () => {
        const { subTopicDetails } = this.state
        subTopicDetails.push({ "id": "desc", "value": "New Description" })
        this.setState({ subTopicDetails })
    }
    clickAddImage = () => {
        const { subTopicDetails } = this.state
        subTopicDetails.push({ "id": "img", "value": "" })
        this.setState({ subTopicDetails })
    }
    clickAddCode = () => {
        const { subTopicDetails } = this.state
        subTopicDetails.push({ "id": "code", "value": "Edit this Code :)", "lang": "python" })
        this.setState({ subTopicDetails })
    }

    openStFieldDelModal = (e, i) => {
        this.setState({ "sfmodalIsOpen": true, "delStField": i })
    }
    closeSFModal = () => {
        this.setState({ "sfmodalIsOpen": false })
    }
    clickStFieldTopicDel = () => {
        const { subTopicDetails, delStField, delStDetails } = this.state
        subTopicDetails[delStField].f_id !== undefined &&
            delStDetails.push({ "id": subTopicDetails[delStField].id, "f_id": subTopicDetails[delStField].f_id })
        subTopicDetails.splice(delStField, 1)
        this.setState({ subTopicDetails, "sfmodalIsOpen": false, delStDetails })
    }

    renderSubTopicEdit = () => {
        const elements = []
        const { subTopicDetails } = this.state
        for (let i = 0; i < subTopicDetails.length; i++) {
            const element = subTopicDetails[i]
            if (element.id === "title") {
                elements.push(
                    <div key={`${element.id}${i}`} className="d-flex">
                        <input className="st-head st-input" value={element.value} onChange={e => (this.changeStTitle(e, i))} />
                        <button onClick={e => this.openStFieldDelModal(e, i)} type="button" className="mod-btn st-tr-btn"><FaTrash /></button>
                    </div>)
            } else if (element.id === "desc") {
                elements.push(
                    <div key={`${element.id}${i}`} className="d-flex">
                        <textarea className="st-desc st-input st-desc" onChange={e => (this.changeStDesc(e, i))} rows={6} value={element.value}></textarea>
                        <button onClick={e => this.openStFieldDelModal(e, i)} type="button" className="mod-btn st-tr-btn"><FaTrash /></button>
                    </div>)
            } else if (element.id === "img") {
                let imageUrl = ""
                if (element.value.name !== undefined) {
                    imageUrl = URL.createObjectURL(element.value)
                } else {
                    const arrayBufferView = new Uint8Array(element.value.data)
                    const blob = new Blob([arrayBufferView], { type: 'image/png' })
                    imageUrl = URL.createObjectURL(blob)
                }
                elements.push(
                    <div key={`${element.id}${i}`} className="d-flex mt-3">
                        <>
                            <div className="d-flex">
                                <div className="st-img-input-div d-flex flex-column">
                                    {element.value === "" ? <FcAddImage className="st-img-icon" /> :
                                        <img src={imageUrl} className="st-mcq-img" alt={`img${i + 1}`} />}
                                    <input id={`img${i + 1}`} onChange={e => this.selectImage(`img${i + 1}`, i)} type="file" className="st-img-file" accept="image/png, image/jpeg, image/jpg" />
                                </div>
                            </div>
                            <p id={`img-err${i + 1}`} className="st-img-limit-err d-none">Image size exceed limit of 1MB</p>
                        </>
                        <button onClick={e => this.openStFieldDelModal(e, i)} type="button" className="mod-btn st-tr-btn"><FaTrash /></button>
                    </div>

                )
            } else {
                elements.push(
                    <div key={`${element.id}${i}`} className="mt-3">
                        <div className="st-sel-lang-con d-flex">
                            <select className="form-select st-select-lang" value={element.lang} onChange={e => this.changeLang(e, i)}>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="c">C</option>
                                <option value="cpp">Cpp</option>
                                <option value="html">HTML5</option>
                                <option value="css">CSS3</option>
                                <option value="javascript">Javascript</option>
                            </select>
                            <button onClick={e => this.openStFieldDelModal(e, i)} type="button" className="mod-btn st-tr-btn"><FaTrash /></button>
                        </div>
                        <Editor
                            height="172px"
                            width={`98%`}
                            language={element.lang}
                            theme="vs-dark"
                            options={{ readOnly: false }}
                            defaultValue={element.value}
                            onChange={e => this.changeStCode(e, i)}
                        />
                    </div>
                )
            }
        }
        return elements
    }

    renderSubTopic = () => {
        const elements = []
        const { subTopicDetails } = this.state
        for (let i = 0; i < subTopicDetails.length; i++) {
            const element = subTopicDetails[i];
            if (element.id === "title") {
                elements.push(<h1 key={element.f_id} className="st-head">{element.value}</h1>)
            } else if (element.id === "desc") {
                elements.push(<p key={element.f_id} className="st-desc">
                    {element.value}
                </p>)
            } else if (element.id === "img") {
                const arrayBufferView = new Uint8Array(element.value.data)
                const blob = new Blob([arrayBufferView], { type: 'image/png' })
                const imageUrl = URL.createObjectURL(blob)
                elements.push(<img key={element.f_id} className="st-img" src={imageUrl} alt={`img${i}`} />)
            } else {
                elements.push(
                    <div key={element.f_id} className="mt-3 me">
                        <Editor
                            height={`${(element.value.split("\n").length) * 2.5}ex`}
                            width={`100%`}
                            language={element.lang}
                            theme="vs-dark"
                            defaultValue={element.value}
                            options={{ readOnly: true, automaticLayout: true }}
                        />
                    </div>
                )
            }
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

    clickSlide = () => {
        this.setState(prev => ({"slide": !prev.slide}))
    }

    render() {
        const { topics, modalIsOpen, smodalIsOpen, stEditMode, sfmodalIsOpen, isLoadingTDetails, isLoadingStDetails, slide } = this.state
        const {tier} = this.state
        const customStyles = {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                border: '1px solid lightgreen',
                borderRadius: '7px',
                backgroundColor: 'rgb(242, 255, 250)'
            },
        }
        const slideId = slide ? "slide" : ""
        const slideBtn = slide ? "btn-slide" : ""
        const renderedTopics = this.renderTopics(topics)
        return (
            <>
                <Header />
                <div className="container-fluid d-flex">
                    <div id={slideId} className="tracks-con">
                        {isLoadingTDetails ? this.renderLoader() : renderedTopics[0]}
                        {tier < 3 && <button onClick={this.clickAddtopic} type="button" className="add-topic-btn">
                            <FaPlus />
                            <p className="add-text">Add New Topic</p>
                        </button>}
                    </div>
                    <button id={slideBtn} onClick={this.clickSlide} className="slide-btn" type="button">{!slide ? <TbLayoutSidebarLeftExpandFilled /> : <TbLayoutSidebarRightExpandFilled />}</button>
                    <div className="st-main-con">
                        {isLoadingStDetails ? this.renderLoader() : (stEditMode ?
                            <>
                                {this.renderSubTopicEdit()}
                                <div className="d-flex mt-3 edit-btns-con">
                                    <button onClick={this.clickAddTitle} type="button" className="add-topic-btn">
                                        <FaPlus />
                                        <p className="add-text">Add Title</p>
                                    </button>
                                    <button onClick={this.clickAddDesc} type="button" className="add-topic-btn">
                                        <FaPlus />
                                        <p className="add-text">Add Description</p>
                                    </button>
                                    <button onClick={this.clickAddImage} type="button" className="add-topic-btn">
                                        <FcAddImage />
                                        <p className="add-text">Add Image</p>
                                    </button>
                                    <button onClick={this.clickAddCode} type="button" className="add-topic-btn">
                                        <p className="add-text">{"</>"} Add Code</p>
                                    </button>
                                </div>
                            </> :
                            this.renderSubTopic())}
                        {tier < 3 && (!stEditMode ? <button onClick={this.clickStEditBtn} className="edit-btn" type="button"><MdModeEdit /></button> :
                            <button onClick={this.clickStOkBtn} className="edit-btn" type="button"><TiTick /></button>)}
                    </div>

                </div>
                <div>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        ariaHideApp={false}
                        contentLabel="Deletion Modal"
                    >
                        <h1 className="modal-desc">Confirm Delete Topic</h1>
                        <button className="modal-btn m-del-btn" onClick={this.clickTopicDel}>Yes</button>
                        <button className="modal-btn" onClick={this.closeModal}>No</button>
                    </Modal>
                </div>
                <div>
                    <Modal
                        isOpen={smodalIsOpen}
                        onRequestClose={this.closeSModal}
                        style={customStyles}
                        ariaHideApp={false}
                        contentLabel="Deletion Modal"
                    >
                        <h1 className="modal-desc">Confirm Delete Sub Topic</h1>
                        <button className="modal-btn m-del-btn" onClick={this.clickSTopicDel}>Yes</button>
                        <button className="modal-btn" onClick={this.closeSModal}>No</button>
                    </Modal>
                </div>
                <div>
                    <Modal
                        isOpen={sfmodalIsOpen}
                        onRequestClose={this.closeSFModal}
                        style={customStyles}
                        ariaHideApp={false}
                        contentLabel="Deletion Modal"
                    >
                        <h1 className="modal-desc">Confirm Delete Field</h1>
                        <button className="modal-btn m-del-btn" onClick={this.clickStFieldTopicDel}>Yes</button>
                        <button className="modal-btn" onClick={this.closeSFModal}>No</button>
                    </Modal>
                </div>
            </>
        )
    }
}

export default Track