import React, { Component } from "react";
import { BiArrowBack, BiUpload } from 'react-icons/bi'

import { FcAddImage } from 'react-icons/fc'
import { ThreeDots } from 'react-loader-spinner'

import '../createMCQ/index.css'

class CreateTrack extends Component {
    state = { "track_details": { "title": "", "description": "", "image": "" }, "isLoading": false }

    componentDidMount() {
        const token = window.localStorage.getItem("token")
        const trackId = window.location.pathname.split("/")[2]
        this.getTier()
        if (token === null) {
            window.location.replace('/login')
        }
        if (trackId !== "create") {
            this.setState({ "isLoading": true })
            this.fetchTrackDetails()
        }
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
        data.tier === 3 && window.location.replace("/")
    }

    fetchTrackDetails = async () => {
        const trackId = window.location.pathname.split("/")[2]
        let options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "track_id": trackId })
        }
        const response = await fetch("http://210.212.217.205:3003/get-track-details", options)
        const data = response.json()
        data.then((result) => {
            this.setState({ "track_details": result, "isLoading": false })
        })
    }

    clickBack = () => {
        window.location.replace("/")
    }

    clickClear = () => {
        this.setState({
            "track_details": { "title": "", "description": "", "image": "" }
        })
    }

    clickUpload = async e => {
        const { track_details } = this.state
        const { title, description, image } = track_details
        if (title === "" || description === "") {
            return
        }
        let imgErr = document.getElementById("img-err")
        if (image === "") {
            imgErr.textContent = "Please select an image"
            imgErr.classList.remove('d-none')
        }

        e.preventDefault()
        let fd = new FormData()
        if(track_details.imgChanged !== undefined){
            fd.append("image", image)
        }

        fd.append("json_data", JSON.stringify({ track_details }))

        let options = {
            method: "POST",
            body: fd,
        }
        const response = await fetch("http://210.212.217.205:3003/upload-track", options)
        const data = await response.json()

        if (response.ok) {
            alert(data)
            window.location.replace("/")
        } else {
            alert("Error uploading track!")
            window.location.reload()
        }
    }

    changeTitle = event => {
        const { track_details } = this.state
        track_details.title = event.target.value
        this.setState(track_details)
    }

    changeDescription = event => {
        const { track_details } = this.state
        track_details.description = event.target.value
        this.setState(track_details)
    }

    selectImage = () => {
        let imgInput = document.getElementById("img")
        let imgErr = document.getElementById("img-err")
        if (imgInput.files[0] !== undefined) {
            if (imgInput.files[0].size < 999999) {
                imgErr.classList.add("d-none")
                const { track_details } = this.state
                track_details.image = imgInput.files[0]
                track_details.imgChanged = true
                this.setState(track_details)
            } else {
                imgErr.textContent = "Image size exceed limit of 1MB"
                imgErr.classList.remove("d-none")
            }
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

    renderTrackForm = () => {
        const trackId = window.location.pathname.split("/")[2]
        const { track_details } = this.state
        const { title, description, image } = track_details
        let imageUrl = ""
        if (trackId === "create") {
            image !== "" && (imageUrl = URL.createObjectURL(image))
        } else {
            if (track_details.imgChanged === undefined){
                const arrayBufferView = new Uint8Array(image.data)
                const blob = new Blob([arrayBufferView], { type: 'image/png' })
                imageUrl = URL.createObjectURL(blob)
            } else {
                imageUrl = URL.createObjectURL(image)
            }
            
        }
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
                <div className="d-md-flex">
                    <form id="mcq-form" className="m-3 track-form">
                        <div className="d-flex">
                            <p className="test-name">Title of the track : </p>
                            <input type="text" value={title} onChange={this.changeTitle} className="mcq-input mcq-opt" required />
                        </div>
                        <div className="d-flex mt-3">
                            <p className="test-name">Some Description: </p>
                            <textarea value={description} onChange={this.changeDescription} className="mcq-input mcq-que mt-2" required></textarea>
                        </div>
                    </form>
                    <div className="d-flex flex-lg-column text-center">
                        <div className="img-input-div d-flex flex-column">
                            {image === "" ? <FcAddImage className="img-icon" /> :
                                <img src={imageUrl} className="mcq-img" alt="img" />}
                            <input id="img" onChange={e => this.selectImage()} type="file" className="img-file" accept="image/png, image/jpeg, image/jpg" />
                        </div>
                        <p id="img-err" className="img-limit-err d-none"></p>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { isLoading } = this.state
        return (
            isLoading ? this.renderLoader() : this.renderTrackForm()
        )
    }

}

export default CreateTrack