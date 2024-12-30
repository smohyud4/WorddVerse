import { useState, useEffect, useRef } from 'react';
import KeyBoard from '../KeyBoard/KeyBoard';
import NewGame from '../NewGame/NewGame';
import './Game.css';

const map = ['one', 'two', 'three', 'four', 'five', 'six'];
const rowOne = "QWERTYUIOP";
const rowTwo = "ASDFGHJKL";
const rowThree = "ZXCVBNM";

export default function Game() {

  const [word, setWord] = useState('');
  const [wordLists, setWordLists] = useState({});
  const [words, setWords] = useState({
    one: '',
    two: '',
    three: '',
    four: '',
    five: '',
    six: ''
  });
  const [guess, setGuess] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [winnerMessage, setWinnerMessage] = useState("Wordle");
  const [time, setTime] = useState(0);

  const checkWord = useRef(false);
  const length = useRef(5);
  const colors = useRef([]);
  const inputRef = useRef(null);

  useEffect(() => {
    async function fetchWords() {
      async function loadWordList(path) {
        try {
          const response = await fetch(path);
          const text = await response.text();
          return text.split("\n").map((word) => word.trim());
        } catch (error) {
          console.error(error);
          return [];
        }
      }
    
      const paths = [
        `${import.meta.env.BASE_URL}/data/4_letter_words.txt`,
        `${import.meta.env.BASE_URL}/data/5_letter_words.txt`,
        `${import.meta.env.BASE_URL}/data/6_letter_words.txt`,
        `${import.meta.env.BASE_URL}/data/7_letter_words.txt`,
      ];
    
      const [fourLetterWords, fiveLetterWords, sixLetterWords, sevenLetterWords] = await Promise.all(
        paths.map(path => loadWordList(path))
      );
    
      setWordLists({
        4: fourLetterWords,
        5: fiveLetterWords,
        6: sixLetterWords,
        7: sevenLetterWords,
      });
    }
    
    fetchWords();
  }, []);

  useEffect(() => {
    let intervalId;
    if (!gameOver) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [gameOver]);

  useEffect(() => {
    // Focus the input field whenever the guess changes
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [words]); 

  useEffect(() => { 
    if (guess != 0 && checkGuess()) {
      setGameOver(true);
      setWinnerMessage("You Win!");
    }
    else if ((guess == 5 && length.current == 7) || guess == 6) {
      setGameOver(true);
      setWinnerMessage(`The word was ${word}!`);
    }

  }, [guess]);

  function formatTime() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function getContainerWidth(length) {
    if (window.innerWidth > 600) {
      return {
        width: `${(length/5)*50}%`
      };
    }

    return {
      width: `${(length/6)*80}%`
    };
  }
  
  function calculateSpanStyles(length) {
    const spanWidth = `${100/length}%`;
    return { width: spanWidth };
  }

  function generateWord(length) {
    const randomIndex = Math.floor(Math.random() * wordLists[length].length);
    return wordLists[length][randomIndex];
  }

  function resetGame() {
    setWords({
      one: '',
      two: '',
      three: '',
      four: '',
      five: '',
      six: ''
    });

    setGameOver(false);
    setWord(generateWord(length.current));
    setGuess(0);
    setTime(0);
    colors.current = [];

    const keys = document.querySelectorAll('.keyBoardContainer button');
    keys.forEach((key) => {
      if (key.className != 'action')
        key.className = '';
    });
  }


  function checkGuess() {
    let winner = true;

    const potential = [];
    const charColors = Array.from({ length: length });
    const freq = {};
    for (const char of word) {
      freq[char] = (freq[char] || 0) + 1;
    }

    /*
      In one loop, mark all exact matches in green and letters not included in the word at all as gray
      With the remaining letters:
         Mark them as yellow WHILE the temp freq[letter] > 0
    */

    for (let i=0; i < length.current; i++) {
      const char = words[map[guess-1]][i].toLowerCase();
      const charTag = document.getElementById(`${guess}${i}`);
      const keyTag = document.getElementById(char.toUpperCase());
 
      if (char === word[i]) {
        charTag.classList.add("correct");
        keyTag.classList.add("correct");
        charColors[i] = "correct"
        freq[char]--;
      }
      else if (!word.includes(char)) {
        charTag.classList.add("blank");
        keyTag.classList.add("blank");
        charColors[i] = "blank";
        winner = false;
      }
      else {
        potential.push({char, i});
        winner = false;
      }

      charTag.style.color = 'white';
    }

    for (const {char, i} of potential) {
      const charTag = document.getElementById(`${guess}${i}`);
      const keyTag = document.getElementById(char.toUpperCase());

      if (freq[char] > 0) {
        charTag.classList.add("correct-position");
        keyTag.classList.add("correct-position");
        charColors[i] = "correct-position";
        freq[char]--;
      } 
      else {
        charTag.classList.add("blank");
        keyTag.classList.add("blank");
        charColors[i] = "blank";
      } 
    }

    colors.current.push(charColors);
    return winner;
  }

  function handleClick(char) {
    if (words[map[guess]].length >= length.current) return; // Prevent adding more than 5 characters

    setWords((prevWords) => {
      const newWords = { ...prevWords }; // Create a shallow copy of the state
      newWords[map[guess]] += char; // Append the key to the current word
      return newWords;
    });
  }

  function handleDelete() {
    setWords((prevWords) => {
      const newWords = { ...prevWords }; // Create a shallow copy of the state
      newWords[map[guess]] = newWords[map[guess]].slice(0, -1); // Remove the last character
      return newWords;
    });
  }

  function handleInput(event) {
    const {name, value} = event.target;
    const char = value.charCodeAt(value.length-1)

    if ((char < '65' || char > '90') && // A-Z
       (char < '97' || char > '122')) {
      return;
    }

    setWords((prevWords) => ({
      ...prevWords,
      [name]: value.toUpperCase(),
    }));
  }

  function takeGuess() {
    if (words[map[guess]].length != length.current) {
      alert('Not enough letters');
      return;
    }

    if (checkWord.current) {
      !wordLists[length.current].includes(words[map[guess]].toLowerCase()) 
        ? alert('Not in word list')
        : setGuess(prev => prev+1) 
    }
    else {
      setGuess(prev => prev+1);
    }
  } 

  return <>
    {gameOver && (
      <NewGame 
        message={winnerMessage} 
        time={formatTime()}
        colors={colors.current}
        length={length}
        checkWord={checkWord}
        reset={resetGame}
      />
    )}
    <p id="time">{formatTime()}</p>
    <div className="container">
      <div className="grid-item" style={getContainerWidth(length.current)}> 
        {words.one.split('').map((char, index) => {
          return (
            <span id={`1${index}`} key={index} style={calculateSpanStyles(length.current)}>
              {char}
            </span> 
          )
        })}
      </div>
      <div className="grid-item" style={getContainerWidth(length.current)}>
        {words.two.split('').map((char, index) => {
          return (
            <span id={`2${index}`} key={index} style={calculateSpanStyles(length.current)}>
              {char}
            </span> 
          )
        })} 
      </div>
      <div className="grid-item" style={getContainerWidth(length.current)}> 
        {words.three.split('').map((char, index) => {
          return (
            <span id={`3${index}`} key={index} style={calculateSpanStyles(length.current)}>
              {char}
            </span> 
          )
        })}
      </div>
      <div className="grid-item" style={getContainerWidth(length.current)}>
        {words.four.split('').map((char, index) => {
          return (
            <span id={`4${index}`} key={index} style={calculateSpanStyles(length.current)}>
              {char}
            </span> 
          )
        })} 
      </div>
      <div className="grid-item" style={getContainerWidth(length.current)}>
        {words.five.split('').map((char, index) => {
          return (
            <span id={`5${index}`} key={index} style={calculateSpanStyles(length.current)}>
              {char}
            </span> 
          )
        })} 
      </div>
      {length.current != 7 &&
        <div className="grid-item" style={getContainerWidth(length.current)}>
          {words.six.split('').map((char, index) => {
            return (
              <span id={`6${index}`} key={index} style={calculateSpanStyles(length.current)}>
                {char}
              </span> 
            )
          })} 
        </div>
      }
      <input
        ref={inputRef}
        id='guessInput' 
        type='text' 
        maxLength={length.current}
        name={map[guess]}
        value={words[map[guess]]}
        onChange={handleInput}
        placeholder='Enter your guess'
        onKeyUp={(event) => {
          if (event.key === "Enter") takeGuess();
        }}
      />
      <KeyBoard 
        rowOne={rowOne} 
        rowTwo={rowTwo} 
        rowThree={rowThree} 
        handleClick={handleClick}
        handleEnter={takeGuess}
        handleDelete={handleDelete}
      />
    </div>
    </>
}; 