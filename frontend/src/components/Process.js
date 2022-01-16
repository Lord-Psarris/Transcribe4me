/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable eqeqeq */
import React from 'react';
import '../svg.css';
import Header from './Header';
import Footer from './Footer';
import Upload from './sub-components/Upload'
import Processing from './sub-components/Processing'
import Completed from './sub-components/Completed'

// getting domain
const location = window.location.hostname
if (location.includes('localhost')) {
    var DOMAIN = 'http://localhost:8000'
} else {
    var DOMAIN = ''
}


export default class Process extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 'upload',
            uniqueKey: '',
            responseText: {
                sub: 'this is a subtitle',
                plain: 'this is a plain text',
            }
        }
    }

    handleFileUpload = (file) => {
        this.setState({ currentTab: 'processing' })

        var newFormData = new FormData()
        newFormData.append('file', file)

        // fetch request
        fetch(DOMAIN + "/post-file/", {
            method: "POST",
            body: newFormData
        })
            .then(response => response.json())
            .then(data => {
                this.setState({ uniqueKey: data.data })
            })

        var interval = setInterval(() => {
            fetch(DOMAIN + "/check-file/", {
                method: "POST",
                body: this.state.uniqueKey
            })
                .then(res => res.json())
                .then(data => {
                    let nData = data.data
                    console.log(data)
                    if (data.completed) {
                        this.setState({ currentTab: 'completed', responseText: nData })
                        clearInterval(interval)
                    }

                })
        }, 10000)
    }

    render() {
        const currentTab = (
            this.state.currentTab == 'upload' ? <Upload handleUploadFile={this.handleFileUpload} /> :
                this.state.currentTab == 'processing' ? <Processing /> : <Completed values={this.state.responseText} />
        )

        return (
            <div>
                <div class="root">
                    <Header />

                    <main class="upload">
                        {currentTab}
                    </main>
                </div>
                <Footer />
            </div >
        )
    }
}