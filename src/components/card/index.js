import React from 'react'
import { Component } from "react"
import Modal from 'react-modal'

import './index.css'

class Card extends Component {
  state = { "modalIsOpen": false, "dmodalIsOpen": false }

  clickCard = () => {
    const { unqId, type } = this.props

    type !== "tracks" ? window.location.assign(`/test/${type}_${unqId}`) :
      this.clickTrack()
  }

  clickDel = async () => {
    const { unqId } = this.props

    let options = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "track_id": unqId })
    }
    await fetch("http://210.212.217.205:3003/del-track", options)
      .then(() => {
        window.location.replace("/")
      })
  }

  clickTrack = async () => {
    const { unqId } = this.props

    let options = {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "track_id": unqId })
    }
    const response = await fetch("http://210.212.217.205:3003/get-stopic-id", options)
    if (response.ok) {
      const data = await response.json()
      window.location.assign(`/tracks/${unqId}/${data.id}`)
    } else {
      window.location.assign(`/tracks/${unqId}/createTopic`)
    }

  }

  clickEdit = () => {
    const { unqId } = this.props
    window.location.assign(`/edit-track/${unqId}`)
  }

  openModal = () => {
    this.setState({ "modalIsOpen": true })
  }
  closeModal = () => {
    this.setState({ "modalIsOpen": false })
  }
  openDModal = () => {
    this.setState({ "modalIsOpen": false, "dmodalIsOpen": true })
  }
  closeDModal = () => {
    this.setState({ "dmodalIsOpen": false })
  }

  render() {
    const { image, heading, desc, tier } = this.props
    const { modalIsOpen, dmodalIsOpen } = this.state
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
      }
    }
    return (
      <>
        <div className="card-container" onClick={tier < 3 ? this.openModal : this.clickTrack}>
          <img className='card-img m-1' src={image} alt="card-img" />

          <h1 className='card-heading'>{heading}</h1>
          <p className='card-desc'>{desc.replace(/\\n/g, "\n")}</p>
        </div>
        <div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Track Modal"
          >
            <h1 className="tr-modal-desc">What would you like to do...?</h1>
            <button className="tr-modal-btn tr-m-open-btn" onClick={this.clickTrack}>Open</button>
            <button className="tr-modal-btn tr-m-edit-btn" onClick={this.clickEdit}>Edit</button>
            <button className="tr-modal-btn tr-m-del-btn" onClick={this.openDModal}>Delete</button>
          </Modal>
        </div>
        <div>
          <Modal
            isOpen={dmodalIsOpen}
            onRequestClose={this.closeDModal}
            style={customStyles}
            ariaHideApp={false}
            contentLabel="Deletion Modal"
          >
            <h1 className="tr-modal-desc">Confirm Delete Track</h1>
            <button className="tr-modal-btn tr-m-del-btn tr-m-open-btn" onClick={this.clickDel}>Yes</button>
            <button className="tr-modal-btn" onClick={this.closeDModal}>No</button>
          </Modal>
        </div>
      </>
    )
  }
}

export default Card