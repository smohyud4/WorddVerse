/* eslint-disable react/prop-types */
import { useState } from 'react'
import {share} from '../../utils/share';
import { IoShareSocialOutline } from "react-icons/io5";
import { IoIosStats } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import './NewGame.css'

const wordLengths = [4, 5, 6, 7, 8];
const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const guessMap = {
  'blank': '⬜', 
  'wrong-position': '🟨', 
  'correct': '🟩'
};

function generateGameId(length) {
  const s1 = Math.floor(Math.random()*letters.length);
  const s2 = Math.floor(Math.random()*letters.length);
  const s3 = Math.floor(Math.random()*letters.length);

  return `${length}${letters[s1]}${letters[s2]}${letters[s3]}`;
}

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
 
  const [lengthState, setLengthState] = useState(length.current);
  const [validateState, setValidateState] = useState(checkWord.current);

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
    let shareURL;
    if (challenge) {
      const id = generateGameId(length.current);
      shareURL = `${window.location.origin}?word=${btoa(word)}&id=${id}`;
      result = `WorddVerse #${id}\n${result}\nBeat that!`;
    }
    else {
      shareURL = `${window.location.origin}`;
      result = `WorddVerse #${gameId}\n${result}\n${word}`;
    }

    share(result, shareURL);
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
              <h2><a href='/stats'><IoIosStats/></a></h2>
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

