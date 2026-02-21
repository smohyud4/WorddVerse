/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { loadStats } from '../../utils/storage';
import { share, generateGameId } from '../../utils/share';
import { IoShareSocialOutline } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";
import './NewGame.css'

const wordLengths = [4, 5, 6, 7, 8, 9];
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
  gameId, 
  reset
}) {
 
  const [stats, setStats] = useState(null);
  const [lengthState, setLengthState] = useState(length.current);
  const [validateState, setValidateState] = useState(checkWord.current);

  useEffect(() => {
    if (!length) return;

    const allStats = loadStats();
    setStats(allStats[length.current - 4]);
  }, [length]);

  function getModalAnimation(message) {
    if (message === "WorddVerse") {
      return;
    }

    return message[message.length-1] == '!'
      ? {animation: 'grow 0.4s ease-in'}
      : {animation: 'fade 1s ease-in'}
  }

  function handleSearch(word) {
    const searchURL = `https://www.google.com/search?q=define+${word}`;
    window.open(searchURL, '_blank');
  }

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

    return `⏰ ${time}\n${grid}`;
  }

  function handleShare(challenge) {
    let result = generateResult(colors, time);

    if (challenge) {
      const id = generateGameId(length.current);
      const shareURL = `${window.location.origin}?word=${btoa(word)}&id=${id}`;
      result = `WorddVerse #${id}\n${result}\nBeat that!`;
      share(result, shareURL);
      return;
    }

    result = `WorddVerse #${gameId}\n${result}\n\n${word}`;
    share(result);
  }

  return (
    <div role="dialog" className="modal">
      <div 
        className="modal-content"
        style={getModalAnimation(message)}
      >
        {word ?
          <>
            <h1 id="msg">
              {message || "Game over"}
              <button 
                onClick={() => handleSearch(word)}
                title="Search for word definition"
              >
                <IoSearchSharp/>
              </button>
            </h1>
            <div className="results">
              <h2>Time: {time}</h2>
              <h2>Streak: {stats.streak}</h2>
              <h2>Max Streak: {stats.bestStreak}</h2>
            </div>
            <div 
              className="colorGrid" 
              style={{
                gridTemplateRows: `repeat(${colors.length}, 1fr)`, 
                gridTemplateColumns: `repeat(${length.current}, 1fr)`  
              }}
            >
              {colors.flat().map((color, index) => (
                <div key={index} className={color}></div>
              ))}
            </div>
          </>
          : <h1 id="msg">{message || "Game over"}</h1>
        }
        <br/>
        <form className="inputContainer">
          <label htmlFor="options">Word Length</label>
          <select
            id="options" 
            name="options" 
            value={lengthState} 
            onChange={handleChange}
          >
            {wordLengths.map((length, index) => (
              <option key={index} value={length}>{length}</option>
            ))}
          </select>
          <label htmlFor="difficulty">Validate Guess</label>
          <input
            type="checkbox"
            id="difficulty"
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
          {message != "WorddVerse" && 
            (!gameId ? (
              <button className="shareButton" onClick={() => handleShare(true)}>
                Challenge <IoShareSocialOutline/>
              </button>
            ) : (
              <button className="shareButton" onClick={() => handleShare(false)}>
                Share <IoShareSocialOutline/>
              </button>
            ))
          }
        </div>
      </div>
    </div>
  )
}

