import React from 'react';
import '../../svg.css';

// getting domain
var DOMAIN;
const location = window.location.hostname
if (location.includes('localhost')) {
    DOMAIN = 'http://localhost:8000'
} else {
    DOMAIN = ''
}
const axios = require('axios')

export default class Processing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            percentageComplete: 5,
            percentageText: 'Your file has been added to the queue'
        }
    }

    async componentDidMount() {
        var interval = setInterval(async () => {
            var response = await axios.get(`${DOMAIN}/check-file-progress/${this.props.uniqueKey}`, { withCredentials: true })
            var responseData = await response.data

            if (responseData.fileStatus === 'started' && responseData.percentageComplete === 0) {
                this.setState({ percentageText: 'Your file is being processed', percentageComplete: 20 })
            }
            else if (responseData.percentageComplete === 25) {
                this.setState({ percentageText: 'Your file has been converted and is being transcribed', percentageComplete: 25 })
            }
            else if (responseData.percentageComplete === 75) {
                this.setState({ percentageText: 'Almost done, note that the transcripts will be auto-deleted after 30 minutes', percentageComplete: 75 })
            }
            else if (responseData.fileStatus === 'completed' && responseData.percentageComplete === 100) {
                clearInterval(interval)
                this.setState({ percentageText: 'Transcription completed!', percentageComplete: 100 })
                this.props.finishedProcessing(responseData.plainText, responseData.subtitle)
            } else {
                if (responseData.percentageComplete !== 0) {
                    this.setState({ percentageComplete: responseData.percentageComplete })
                }
            }
        }, 7500)
    }

    render() {

        return (
            <section id="processing" class="active">
                <h1 styke={{ background: 'pink' }}>Processing</h1>
                <div class="progress-bar">
                    <div class="progress" style={{ width: `${this.state.percentageComplete}%` }}>{this.state.percentageComplete}%</div>
                </div>
            </section>
        )
    }
}