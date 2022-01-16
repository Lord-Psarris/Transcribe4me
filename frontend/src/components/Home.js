/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom'


export default class Home extends React.Component {
    render() {
        return (
            <div>
                <div class="root">
                    <Header />

                    <main>
                        <section class="section1">
                            <div class="texts">
                                <h1>
                                    No more manual notes!
                                </h1>
                                <h5>Let Transcribe4me do the transcribing and note taking for you</h5>
                                <br />
                                <br />
                                <Link to="/upload" className="button">Try for free</Link>
                            </div>
                            <div class="images">
                                <img src={require("../assets/main_img.png")} alt="main" />
                            </div>
                        </section>

                        <br />
                        <div class="hr"></div>

                        <section class="section2">
                            <div class="top">
                                <h2>A fast and easy to use transcription service</h2>
                                <p>Easily transcribe any video or audio file to text. Our in browser editor helps you edit the
                                    text
                                    for any errors. The texts are separated by timestmps (default is in minutes) but this can
                                    easily
                                    be adjusted to suite your needs. Transcribe4me makes use of the DeepSpeech model for swift
                                    transcriptions.</p>
                            </div>
                            <div class="bottom">
                                <div class="split">
                                    <h2>Upload</h2>
                                    <p>Submit a video or audio file of any type</p>
                                </div>

                                <div class="split">
                                    <h2>Edit</h2>
                                    <p>Review and edit transcripts with timestamps</p>
                                </div>

                                <div class="split">
                                    <h2>Download</h2>
                                    <p>Export your transcript as MS Word, PDF, TXT etc.</p>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
                <Footer />
            </div >
        )
    }
}