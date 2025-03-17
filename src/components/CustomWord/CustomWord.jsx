/* eslint-disable react/prop-types */
import { useState } from 'react'
import { IoShareSocialOutline } from "react-icons/io5";
import {share} from '../../utils/share';
import './CustomWord.css'

export default function CustomWord({setDis}) {
  const [data, setData] = useState({word: '', hint: ''});
  const [invalid, setInvalid] = useState(false);

  function handleChange(event) {
    const {name, value} = event.target;
    if (name == "word" && (!/^[A-Za-z]+$/.test(value) || value.length < 4 || value.length > 8)) {
      setInvalid(true);
      return;
    }

    setInvalid(false);
    setData({...data, [name]: value.toLowerCase()});
  }

  function handleShare() {
    if (data.word.length == 0) return;
    
    let result = "Guess my word!";
    if (data.hint.length != 0) result += `\nHint - ${data.hint}`;
    let shareURL = `${window.location.origin}?word=${btoa(data.word)}&id=C`;
    share(result, shareURL);
  }
  
  return (
    <div role="dialog" className="modal">
      <div className="modal-content">
        <div className="custom-container">
          <h2 id='msg'>Send a custom word</h2>
          <input
            type="text"
            name="word"
            className='custom-input'
            placeholder='Word'
            onChange={handleChange}
          />
          <input
            type="text"
            name="hint"
            className='custom-input'
            placeholder='Optional Hint'
            onChange={handleChange}
          />
          <div className="buttonContainer">
            <button onClick={() => setDis(false)}>Close</button>
            {!invalid && (
              <button className="shareButton" onClick={() => handleShare()}>
               Challenge <IoShareSocialOutline/>
              </button>
            )}
          </div>
          {invalid && <p>Must be a 4-8 letter word</p>}
        </div>
      </div>
    </div>
  )
}