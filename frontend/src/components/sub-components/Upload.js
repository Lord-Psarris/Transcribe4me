import React from 'react';

const $ = window.jQuery = require('jquery')


export default class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: ''
        }
    }

    async componentDidMount() {
        function verifyFormat(filename) {
            const acceptedFormats = ['wav', 'mp4', 'mp3', 'mkv', 'avi']
            let splitFileName = filename.split('.').slice(-1)[0]

            if (acceptedFormats.includes(splitFileName)) {
                return true
            }
            return false
        }

        const verifyFile = (file) => {
            if (verifyFormat(file.name)) {
                uploadBlock.addClass('uploaded')

                // setTimeout(function () {
                //     uploadBlock.removeClass('uploaded')
                // }, 4000)

                this.setState({ errorMessage: '' })
                this.props.handleUploadFile(file)
            } else {
                this.setState({ errorMessage: 'Unsupported file' })
            }
        }

        const uploadBlock = $('#uploadBlock')

        uploadBlock.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            uploadBlock.addClass('dragged')
        })
            .on('dragend dragleave', (e) => {
                uploadBlock.removeClass('dragged')
            })
            .on('drop', (e) => {
                var droppedFiles = e.originalEvent.dataTransfer.files;

                uploadBlock.removeClass('dragged')

                verifyFile(droppedFiles[0])
            });

        $('#upload-file').on('change', (e) => {
            let file = e.target.files[0]
            verifyFile(file)
        })
    }


    render() {
        return (

            <section id="upload" class="active">
                <h1>Upload any video or audio file</h1>
                <div id="uploadBlock" class="upload-block">
                    <img src={require("../../assets/stack.png")} alt="stack" />
                    <input type="file" hidden id="upload-file" />
                    <label for="upload-file" class="button">Select a file</label>
                    <p class="not-on-mobile">Or drag a file here</p>
                    <p style={{ color: "red" }}>{this.state.errorMessage}</p>
                </div>
            </section>
        )
    }
}