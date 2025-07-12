import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Welcome.css';
import '../styles/LandingPage.css';

function Welcome() {
    const navigate = useNavigate();

    const Typewriter = (text, delay) => {
        const [currentText, setCurrentText] = useState('');
        const [currentIndex, setCurrentIndex] = useState(0);

        useEffect(() => {
            if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prevText => prevText + text[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, delay);
            return () => {
                clearTimeout(timeout);
            }
            }
        }, [currentIndex, delay, text]);

        return <span>{currentText}</span>;
    };

    return (
        <div className="welcome-container">
            <div className="welcome-message">
                <h2>welcome to the closet</h2>
                {Typewriter("phreaky phriday", 100)}
            </div>
            <div className="button-group">
                <button className="landing-button" onClick={() => navigate('/register')}>Sign Up</button>
            </div>
        </div>
    );

};

export default Welcome;