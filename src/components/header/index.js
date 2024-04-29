import React from 'react'
import { Component } from 'react'

import {LuLogOut} from "react-icons/lu";
import Modal from 'react-modal'

import logo from "../../imgs/logo.jpeg";
import './index.css'

class Header extends Component {
    state = {"modalIsOpen": false}

    onLogout = () => {
        window.localStorage.clear()
        window.location.replace('/login')
    }

    componentDidMount() {
        const token = window.localStorage.getItem("token")
        if (token === null) {
            window.location.replace('/login')
        }
    }

    openModal = () => {
        this.setState({ "modalIsOpen": true })
    }
    closeModal = () => {
        this.setState({ "modalIsOpen": false })
    }

    render() {
        const {modalIsOpen} = this.state
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
                backgroundColor: 'rgb(242, 255, 250)',
                position: 'fixed',
                zIndex: '9999'        
            },
        };
        return (
            <>
                <nav className="navbar sticky-top bg-light">
                    <div className='nav-header'>
                        <a href='/' className='link'>
                            <div className="navbar-logo d-flex">
                                <img src={logo} alt="Logo" />
                                <div>
                                    <p className='btext1'>Learn</p>
                                    <p className='btext1 btext2'>Together</p>
                                </div>
                            </div>
                        </a>
                        <div className='d-flex align-items-center'>
                            <a href="/cp" className='link cp-link'>
                                <p className='cp'>Compiler</p>
                            </a>
                            <div className="navbar-logout">
                                <button className='logout-btn logout-btn-lg' onClick={this.openModal}>Logout</button>
                                <button className='logout-btn logout-btn-sm' onClick={this.openModal}><LuLogOut /></button>
                            </div>
                        </div>
                    </div>
                </nav>
                <div className='logout-modal'>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={this.closeModal}
                        style={customStyles}
                        ariaHideApp={false}
                        contentLabel="LogOut Modal"
                    >
                        <h1 className="modal-desc">Confirm Logging Out</h1>
                        <button className="modal-btn m-del-btn" onClick={this.onLogout}>Yes</button>
                        <button className="modal-btn" onClick={this.closeModal}>No</button>
                    </Modal>
                </div>
            </>
        )
    }
}

export default Header
