import React from 'react';
import { Link } from 'react-router-dom'

export default class Header extends React.Component {
    render() {
        return (
            <header>
                <nav>
                    <a href="/" className="logo">Transcribe4me</a>
                    <Link to="/upload" className="nav-link">Get started</Link>
                </nav>
            </header>
        )
    }
}