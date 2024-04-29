import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import './App.css'

import LoginPage from './components/login'
import HomePage from './components/home'
import NotFound from './components/notfound'
import CodePlayground from './components/codePlayground'
// import CreateMCQ from './components/createMCQ'
// import TestStartPage from './components/testStartPage'
// import CreateCodingTest from './components/createCodingTest'
// import CodingTestPage from './components/codingTestPage'
import Track from './components/tracks'
import CreateTrack from './components/createTrack'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<LoginPage/>} />
        <Route exact path="/" element={<HomePage/>} />
        <Route exact path="/cp" element={<CodePlayground/>} />
        {/* <Route exact path="/create-mcq" element={<CreateMCQ />} />
        <Route exact path="/create-coding-test" element={<CreateCodingTest />} />
        <Route path="/test/:testId" element={<TestStartPage />} />
        <Route path="/coding-test/:testId" element={<CodingTestPage />} /> */}
        <Route path="/tracks/:trackId/:stId" element={<Track />} />
        <Route exact path="/edit-track/:trackId" element={<CreateTrack />} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
