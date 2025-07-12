import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EnterCloset.css';

function EnterCloset() {
  const [letters, setLetters] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (letters.join('').length === 4) {
      const word = letters.join('').toUpperCase();
      if (word === 'ORNO') {
        navigate('/welcome');
      } else {
        setError("Hint: Truth, Honor, Forever");
      }
    } else {
      setError('');
    }
  }, [letters, navigate]);

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
        e.preventDefault();
        const updated = [...letters];

        if (letters[index]) {
        // Clear current letter if filled
        updated[index] = '';
        setLetters(updated);
        } else if (index > 0) {
        // Move focus back if current is already empty
        inputsRef.current[index - 1].focus();
        const prev = [...letters];
        prev[index - 1] = '';
        setLetters(prev);
        }
    }
    };

  const handleChange = (index, value) => {
    if (!/^[a-zA-Z]?$/.test(value)) return;

    const updated = [...letters];
    updated[index] = value.toUpperCase();
    setLetters(updated);

    if (value && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  return (
    <div className="enter-container">
      <div className="enter-box">
        <h2 className="prompt">
          ALETHIA&nbsp;
          {/* ALETHIA */}
          <span className="letter-group">
          {letters.map((letter, idx) => (
            <input
              key={idx}
              type="text"
              maxLength="1"
              className="inline-letter"
              value={letter}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el) => inputsRef.current[idx] = el}
            />
          ))}
          </span>
          &nbsp;ETERONIS
          {/* ETERONIS */}
        </h2>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default EnterCloset;
