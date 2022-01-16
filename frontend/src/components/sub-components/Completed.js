/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

function SubtitleTab(props) {
    const [text, setText] = React.useState(props.values)
    const [fileType, setFileType] = React.useState('txt')

    function download() {
        let fileName = 'download.' + fileType
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', fileName);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    const options = [

        {

            label: "Text file (.txt)",

            value: "txt",

        },

        {

            label: "Subtitle file (.srt)",

            value: "srt",

        },

    ];
    return (
        <div class="tab active">
            <textarea defaultValue={text} onChange={(Event) => { setText(Event.target.value) }} name="" id="timestamped" cols="30" rows="10">
            </textarea>
            <select id="" value={fileType} onChange={(Event) => { setFileType(Event.target.value) }}>
                {options.map((option) => (

                    <option value={option.value}>{option.label}</option>

                ))}
            </select>
            <button onClick={() => { download() }} class="button">Download</button>
        </div>
    )
}

function PlainTextTab(props) {
    const [text, setText] = React.useState(props.values)
    const [fileType, setFileType] = React.useState('txt')

    function download() {
        let fileName = 'download.' + fileType
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', fileName);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    const options = [

        {

            label: "Text file (.txt)",

            value: "txt",

        },

        {

            label: "Subtitle file (.srt)",

            value: "srt",

        },

    ];

    return (
        <div class="tab active">
            <textarea defaultValue={text} onChange={(Event) => { setText(Event.target.value) }} name="" id="plaintext" cols="30" rows="10">
            </textarea>
            <select id="" value={fileType} onChange={(Event) => { setFileType(Event.target.value) }}>
                {options.map((option) => (

                    <option value={option.value}>{option.label}</option>

                ))}
            </select>
            <button onClick={() => { download() }} class="button">Download</button>
        </div>
    )
}

export default class Completed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openTab: 'subs'
        }
        this.switchTab = this.switchTab.bind(this)
    }

    switchTab(Event, tab) {
        Event.preventDefault();
        document.querySelectorAll('.switch-tab').forEach((tab) => {
            tab.classList.remove('active')
        })
        Event.target.classList.add('active')
        this.setState({ openTab: tab })
    }

    render() {

        const openTab = this.state.openTab === 'subs' ? <SubtitleTab values={this.props.values.sub} /> : <PlainTextTab values={this.props.values.plain} />

        return (
            <section id="completed" class="active">
                <div className="tab-switcher">
                    <a class="switch-tab active" href="#" onClick={(Event) => { this.switchTab(Event, 'subs') }}>
                        With Time-stamps
                    </a>
                    <a class="switch-tab" href="#" onClick={(Event) => { this.switchTab(Event, 'plain') }}>Plain Text</a>
                </div>

                {openTab}
            </section>
        )
    }
}