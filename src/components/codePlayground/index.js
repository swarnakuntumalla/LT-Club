import { Component, React } from 'react'
import './index.css'

import Editor from "@monaco-editor/react";
import logo from "../../imgs/logo.jpeg";
import { ThreeDots } from 'react-loader-spinner'

class CodePlayground extends Component {
    state = { "lang": "python", "cin": false, 
    "code": `def main():
    print("Code Together :)")

if __name__ == "__main__":
    main()`,
    "output": "", "input": "", "isRunning": false }

    componentDidMount() {
        const token = window.localStorage.getItem("token")
        if (token === null) {
            window.location.replace('/login')
        }
    }

    changeLang = event => {
        if (event.target.value === "python"){
            this.setState({ "lang": event.target.value, "code": `def main():
    print("Code Together :)")
        
if __name__ == "__main__":
    main()` })
        } else if (event.target.value === "java"){
            this.setState({ "lang": event.target.value, "code": `public class Main {
    public static void main(String[] args) {
        System.out.println("Code Together :)");
    }
}`})
        }else{
            this.setState({ "lang": event.target.value, "code": `#include <iostream>
int main() {
    std::cout << "Code Together :)" << std::endl;
    return 0;
}`})
        }
        
    }

    customInput = () => {
        this.setState(prev => ({ "cin": !prev.cin }))
        window.scrollTo(0, 200)
    }

    changeCode = event => {
        this.setState({ "code": event })
    }

    changeInput = event => {
        this.setState({ "input": event.target.value })
    }

    runCode = async () => {
        const { code, input, lang } = this.state
        this.setState({ "isRunning": true })

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
            this.setState({ "output": d.output, "isRunning": false })
        } else {
            this.setState({ "output": d.error, "isRunning": false })
        }

        window.scrollTo(0, 1000);
    }

    renderLoader = () => {
        return (
            <div className='d-flex justify-content-center p-2'>
                <ThreeDots
                    height="10"
                    width="100px"
                    color="#000000"
                    ariaLabel="threedots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                />
            </div>
        )
    }

    render() {
        const { lang, cin, output, input, isRunning, code } = this.state
        const options = {
            "quickSuggestions": false,
        }
        return (
            <div className="row m-3">
                <div className="col">
                    <div className="d-flex justify-content-between mb-3 rounded cp-nav">
                        <a href='/' className='link'>
                            <div className="d-flex">
                                <img src={logo} width="55" height="55" alt="Logo" />
                                <div className='m-2'>
                                    <p className='cp-btext1'>Learn</p>
                                    <p className='cp-btext1 cp-btext2'>Together</p>
                                </div>
                            </div>
                        </a>
                        <div className="col-12 w-25">
                            <select className="form-select select-lang" onChange={this.changeLang}>
                                <option value="python">Python</option>
                            </select>
                        </div>
                    </div>
                    <Editor
                        height="65vh"
                        width={`100%`}
                        language={lang}
                        theme="vs-dark"
                        value={code}
                        options={options}
                        onChange={this.changeCode}
                    />
                </div>
                <div className='d-flex justify-content-end mt-3 align-items-center'>
                    <label className="switch">
                        <input id='input-check' type="checkbox" onChange={this.customInput} />
                        <span className="slider round"></span>
                    </label>
                    <label className='check-label' htmlFor='input-check'>Custom Input</label>
                    <button onClick={this.runCode} className='run-btn'>{isRunning ? this.renderLoader() : "Run"}</button>
                </div>
                {cin && (
                    <div>
                        <h4 className='in-text'>Input</h4>
                        <textarea value={input} className='in-tarea' rows={5} onChange={this.changeInput} ></textarea>
                    </div>
                )}
                <div id="o-div" className='mt-3'>
                    <h4 className='in-text'>Output</h4>
                    <textarea className='in-tarea' rows={10} value={output} readOnly></textarea>
                </div>
            </div>
        )
    }
}



export default CodePlayground