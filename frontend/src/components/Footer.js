/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

export default class Footer extends React.Component {
    render() {
        return (
            <footer>
                <div class="froot">
                    <a href="/">
                        <h3>Transcribe4me</h3>
                    </a>
                    <div class="footer-links">
                        <a href="https://github.com/Lord-Psarris/Transcribe4me" rel="noreferrer" target="_blank">Get Source Code</a>
                    </div>

                    <p>&copy; Transcribe4me 2021</p>
                </div>
            </footer>
        )
    }
}