/* eslint-disable react/prop-types */
import { useState } from 'react'
import { IoShareSocialOutline } from "react-icons/io5";
import './NewGame.css'

const wordLengths = [4, 5, 6, 7];
const guessMap = {
  'blank': '⬜', 
  'wrong-position': '🟨', 
  'correct': '🟩'
};

export default function NewGame({
  message, 
  word,
  time, 
  colors,  
  length,
  checkWord, 
  reset
}) {
 
  const [lengthState, setLengthState] = useState(length.current);
  const [validateState, setValidateState] = useState(checkWord.current);

  function handleChange(event) {
    if (event.target.type === "checkbox") {
      setValidateState(event.target.checked);
      return;
    }

    setLengthState(event.target.value); 
  }

  function handleSubmit() {
    if (lengthState === "") {
      alert("Please enter a valid number");
      return;
    }

    checkWord.current = validateState;
    length.current = lengthState;
    reset();
  }

  function generateResult(colors, time) {
    const grid = colors.map(row => {
      return row.map(color => guessMap[color]).join('');
    }).join('\n');

    return `WorddVerse ⏰ ${time}\n${grid}`;
  }

  function handleShare(challenge) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const result = generateResult(colors, time);
    let shareURL;
    challenge 
      ? shareURL = `${window.location.origin}?word=${btoa(word)}`
      : shareURL = `${window.location.origin}`;

    if (isMobile && navigator.share) {
      navigator
        .share({
          title: `WorddVerse`,
          text: result,
          url: shareURL,
        })
        .then(() => console.log('Shared successfully'))
        .catch(() => alert('Error sharing :('));
    } 
    else {
      console.log(shareURL);
      navigator.clipboard.writeText(`${result}\n${shareURL}`)
        .then(() => alert('Results copied to clipboard!'))
        .catch(() => alert('Failed to copy results.'));
    }
  }

  return (
    <div role="dialog" className="modal">
      <div className="modal-content">
        <h1>{message || "Game over"}</h1>
        {message != "WorddVerse" &&
          <>
            <h2>Time: {time}</h2>
            <div 
              className="colorGrid" 
              style={{
                gridTemplateRows: `repeat(${colors.length}, 1fr)`, 
                gridTemplateColumns: `repeat(${length.current}, 1fr)`,
                width: `${length.current*20 + (length.current-1)*2}px`,  
              }}
            >
              {colors.flat().map((color, index) => (
                <div key={index} className={color}></div>
              ))}
            </div>
          </>
        }
        <br/>
        <form className="inputContainer">
          <label htmlFor="options">Word Length</label>
          <select 
            name="options" 
            value={lengthState} 
            onChange={handleChange}
          >
            {wordLengths.map((length, index) => (
              <option key={index} value={length}>{length}</option>
            ))}
          </select>
          <label>Validate Guess</label>
          <input
            type="checkbox"
            name="difficulty"
            checked={validateState}
            onChange={handleChange}
          />
        </form>
        <br/>
        <div className="buttonContainer">
          <button onClick={handleSubmit}>
            New Game
          </button>
          {message != "WorddVerse" && (
            <>
              <button onClick={() => handleShare(true)}>
                Challenge <IoShareSocialOutline/>
              </button>
              <button onClick={() => handleShare(false)}>
                Share <IoShareSocialOutline/>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

