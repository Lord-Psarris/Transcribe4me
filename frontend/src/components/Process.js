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
var DOMAIN;
const location = window.location.hostname
if (location.includes('localhost')) {
    DOMAIN = 'http://localhost:8000'
} else {
    DOMAIN = ''
}
const axios = require('axios')
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
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

    handleFileUpload = async (file) => {
        var formData = new FormData()
        var cookie = getCookie('csrftoken');

        formData.append('file', file)
        formData.append("csrfmiddlewaretoken", cookie)

        var response = await axios.post(`${DOMAIN}/upload-file/`, formData, { withCredentials: true })
        var responseData = await response.data

        this.setState({ uniqueKey: responseData.uniqueId, currentTab: 'processing' })
    }

    hasFinishedProcessingFile = (plainText, subtitle) => {
        this.setState({ currentTab: 'completed', responseText: { sub: subtitle, plain: plainText } })
    }

    async componentDidMount() {
        var response = await axios.get(`${DOMAIN}/check-if-has-file/`, { withCredentials: true })
        var responseData = await response.data
        console.log(responseData)

        if (responseData.hasFile) {
            // ask if the user wants details on prev file
            var confirmQuestion = `You already uploaded a file (${responseData.file}), do you want to proceed with processing it?`
            if (window.confirm(confirmQuestion)) {
                // OK
                this.setState({ uniqueKey: responseData.uniqueId, currentTab: 'processing' })
            }
        }

    }

    render() {
        const currentTab = (
            this.state.currentTab == 'upload' ? <Upload handleUploadFile={this.handleFileUpload} /> :
                this.state.currentTab == 'processing' ? <Processing uniqueKey={this.state.uniqueKey} finishedProcessing={this.hasFinishedProcessingFile} /> : <Completed values={this.state.responseText} />
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