import { useState, useEffect, useRef } from 'react';
import { useWordLists } from '../../context/WordListContext';
import { useToast } from '../../hooks/toast';
import { loadGuessesForLength, loadStats, initStats, updateStats } from '../../utils/storage';
import KeyBoard from '../KeyBoard/KeyBoard';
import NewGame from '../NewGame/NewGame';
import Row from '../Row/Row';
import Header from '../Header/Header';
import './Game.css';

const map = ['one', 'two', 'three', 'four', 'five', 'six'];

function validateLink(params) {
  return params.has('word') && params.has('id');
}

export default function Game() {
  
  const wordLists = useWordLists();
  const [words, setWords] = useState({
    one: '',
    two: '',
    three: '',
    four: '',
    five: '',
    six: ''
  });
  const [validGuesses, setValidGuesses] = useState(null);
  const [word, setWord] = useState('');
  const [guess, setGuess] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [winnerMessage, setWinnerMessage] = useState("WorddVerse");
  const [time, setTime] = useState(0);
  const DELAY = (-10*(word.length-4) + 250);

  const id = useRef(null);
  const checkWord = useRef(true);
  const length = useRef(5);
  const colors = useRef([]);
  const inputRef = useRef(null);
  const gameOverRef = useRef(true); // Needed to prevent extra guesses
  const { toast, toastRef, setToast } = useToast(guess, length.current);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (validateLink(urlParams)) {
      const word = atob(urlParams.get('word'));
      if (word.length >= 4 && word.length <= 8) {
        setWord(word);
        length.current = word.length;
        setGameOver(false);
        gameOverRef.current = false;
      }
      id.current = urlParams.get('id');

      urlParams.delete('word');
      urlParams.delete('id');
      const newUrl = `${window.location.origin}${window.location.pathname}`;
      window.history.replaceState({}, '', newUrl);
    }

    initStats();
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
    if (inputRef.current && !gameOver) {
      inputRef.current.focus();
    }
  }, [word, gameOver]); 

  useEffect(() => { 
    if (guess != 0 && checkGuess()) {
      gameOverRef.current = true;
      setTimeout(() => {
        setGameOver(true);
        inputRef.current.blur();
        setWinnerMessage(`You guessed ${word}!`);
        const stats = loadStats();
        if (stats) updateStats(stats, guess, time, length.current, true);
      }, length.current * DELAY);
    }
    else if (guess == 6) {
      gameOverRef.current = true;
      setTimeout(() => {
        setGameOver(true);
        inputRef.current.blur();
        setWinnerMessage(`It was ${word}.`);
        const stats = loadStats();
        if (stats) updateStats(stats, guess, time, length.current, false);
      }, length.current * DELAY);
    }

  }, [guess]);

  function formatTime() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function generateWord(length) {
    const randomIndex = Math.floor(Math.random() * wordLists[length].length);
    return wordLists[length][randomIndex];
  }

  async function resetGame() {
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
    id.current = null;
    gameOverRef.current = false;

    const keys = document.querySelectorAll('.keyBoardContainer button');
    keys.forEach((key) => {
      if (key.className != 'action')
        key.className = '';
    });

    const chars = document.querySelectorAll('.grid-item span');
    chars.forEach((span) => {
      span.className = '';
    });

    setValidGuesses(await loadGuessesForLength(length.current));
  }


  function checkGuess() {
    let winner = true;
    const potential = [];
    const charColors = Array.from({ length: length.current });
    const keyColors = {};
    const freq = {};
    const fixedFreq = {};
    const exactMatches = {};

    for (const char of word) {
      freq[char] = (freq[char] || 0) + 1;
      fixedFreq[char] = (fixedFreq[char] || 0) + 1;
      exactMatches[char] = 0;
    }
    for (const char of words[map[guess-1]]) {
      keyColors[char] = '';
    }

    /*
      In one loop, mark all exact matches in green and letters not included in the word at all as gray
      With the remaining letters:
         Mark them as yellow WHILE the temp freq[letter] > 0
    */

    for (let i=0; i < length.current; i++) {
      const char = words[map[guess-1]][i].toLowerCase();

      if (char === word[i]) {
        charColors[i] = "correct";
        keyColors[char.toUpperCase()] = "correct";
        exactMatches[char]++;
        freq[char]--;
      }
      else if (!word.includes(char)) {
        charColors[i] = "blank";
        keyColors[char.toUpperCase()] = "blank";
        winner = false;
      }
      else {
        potential.push({char, i});
        winner = false;
      }
    }

    for (const {char, i} of potential) {

      if (freq[char] > 0) {
        charColors[i] = "wrong-position";

        exactMatches[char] > 0 && exactMatches[char] < fixedFreq[char]
          ? keyColors[char.toUpperCase()] = "mixed"
          : keyColors[char.toUpperCase()] = "wrong-position";

        freq[char]--;
      } 
      else {
        charColors[i] = "blank";
      } 
    }

    for (let i=0; i < length.current; i++) {
      setTimeout(() => {
        const char = words[map[guess-1]][i];
        const keyTag = document.getElementById(char);
        const charTag = document.getElementById(`${guess}${i}`);

        charTag.className = charColors[i];
        if (!((keyTag.className == 'correct' || keyTag.className == 'mixed') && keyColors[char] == 'wrong-position'))
          keyTag.className = keyColors[char];
      }, i * DELAY);
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
      const newWords = { ...prevWords }; 
      newWords[map[guess]] = newWords[map[guess]].slice(0, -1); // Remove the last character
      return newWords;
    });
  }

  function handleInput(event) {
    const {name, value} = event.target;
    
    if (value === '' || /^[a-z]+$/i.test(value)) {
      setWords((prevGuess) => ({
        ...prevGuess,
        [name]: value.toUpperCase()
      }));
    }
  }

  function takeGuess() {
    if (gameOverRef.current) return;
    if (words[map[guess]].length != length.current) {
      setToast('Not enough letters');
      return;
    }

    if (checkWord.current) {
      validGuesses.has(words[map[guess]].toLowerCase())
        ? setGuess(prev => prev+1)
        : setToast('Not a valid guess');
    }
    else {
      setGuess(prev => prev+1);
    }
  } 

  /*function randomGuess() {
    const word = generateWord(length.current).toUpperCase();
    setWords((prevWords) => ({
      ...prevWords,
      [map[guess]]: word,
    }));

    setGuess(prev => prev+1);
  }*/

  return <>
    <Header/>
    <p id="time">{formatTime()}</p>
    <main className="container">
      {Array.from({ length: 6 }).map((_, index) => (
        <Row 
          key={index} 
          word={words[map[index]]} 
          guess={index+1}
          length={length}
        />
      ))}
      <input
        ref={inputRef}
        id='guessInput' 
        type='text' 
        maxLength={length.current}
        name={map[guess]}
        value={words[map[guess]]}
        onChange={handleInput}
        placeholder='Enter your guess'
        autoComplete="off"
        onKeyUp={(event) => {
          if (event.key === "Enter") takeGuess();
        }}
      />
      <KeyBoard 
        handleClick={handleClick}
        handleEnter={takeGuess}
        handleDelete={handleDelete}
      />
    </main>
    <div className="toast" ref={toastRef}>{toast}</div>
    {gameOver && (
      <NewGame 
        message={winnerMessage}
        word={word}
        time={formatTime()}
        colors={colors.current}
        length={length}
        checkWord={checkWord}
        gameId={id.current}
        reset={resetGame}
      />
    )}
    </>
};
