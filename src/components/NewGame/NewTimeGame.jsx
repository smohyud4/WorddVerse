/* eslint-disable react/prop-types */
import {share, generateGameId} from '../../utils/share';
import { IoShareSocialOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import './NewTimeGame.css'

const guessMap = {
  'blank': '⬜', 
  'wrong-position': '🟨', 
  'correct': '🟩'
};

export default function NewGame({
  message, 
  words,
  times,
  total,
  colors,  
  setTime,
  limit,
  gameId, 
  reset
}) {

  function getModalAnimation(message) {
    if (message === "Time Trial") {
      return;
    }

    return message[message.length-1] == '!'
      ? {animation: 'grow 0.4s ease-in'}
      : {animation: 'fade 1s ease-in'}
  }

  function generateResult(colors, times) {
    let resultString = "";

    for (let i=0; i < times.length; i++) {
      const time = times[i];
      const grid = colors[i].map(row => {
        return row.map(color => guessMap[color]).join('');
      }).join('\n');

      resultString += `⏰ ${time}\n${grid}\n`;
    }
    
    resultString += `Total: ${total}`;
    return resultString;
  }

  function handleShare(challenge) {

    let result = generateResult(colors, times);
    let shareURL;
    if (challenge) {
      const id = generateGameId('TT');
      shareURL = `${window.location.href}?`;
      for (let i=0; i < words.length; i++) {
        const word = words[i];
        shareURL += `&word${i+1}=${btoa(word)}`;
      }
      shareURL += `&id=${id}`;
      result = `Time Trial #${id}\n${result}\nBeat that!`;
    }
    else {
      shareURL = `${window.location.href}`;
      result = `Time Trial #${gameId}\n${result}\n`
      words.forEach(word => result += `${word} `);
    }

    share(result, shareURL);
  }

  function handleEasy() {
    setTime(720);
    limit.current= 720;
    reset(false);
  }

  function handleHard() {
    setTime(360);
    limit.current = 360;
    reset(false);
  }

  return (
    <div role="dialog" className="modal">
      <div 
        className="modal-content"
        style={getModalAnimation(message)}
      >
        <h1 id="msg">{message || "Game over"}</h1> 
        <div className='time-container'>
          {message != "Time Trial" ? (
            <h2>Total: {total}</h2>
          ) : (
            <h3>Guess 4 - 8 letter words before time runs out!</h3>
          )}
          {times.map((time, index) => {
            return (
              <div key={index} className="time-bar">
                <IoMdTime className="time-icon"/>
                <p>{words[index]} {time}</p>
              </div>
            )
          })}
        </div>
        <br/>
        <div className="buttonContainer">
          <button onClick={handleEasy} title='12 mins'>
            Easy
          </button>
          <button onClick={handleHard} title='6 mins'>
            Hard
          </button>
          {gameId ? (
            <button className="shareButton" onClick={() => handleShare(false)}>
              Share <IoShareSocialOutline />
            </button>
            ) : message === "You win!" ? (
            <button className="shareButton" onClick={() => handleShare(true)}>
              Challenge <IoShareSocialOutline />
            </button>
            ) : null}
        </div>
      </div>
    </div>
  )
}