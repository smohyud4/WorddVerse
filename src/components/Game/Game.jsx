import { useState, useEffect, useRef } from 'react';
import KeyBoard from '../KeyBoard/KeyBoard';
import NewGame from '../NewGame/NewGame';
import Row from '../Row/Row';
import Header from '../Header/Header'
import ColorModal from '../ColorModal/ColorModal';
import './Game.css';

const map = ['one', 'two', 'three', 'four', 'five', 'six'];

export default function Game() {

  const [words, setWords] = useState({
    one: '',
    two: '',
    three: '',
    four: '',
    five: '',
    six: ''
  });
  const [colorSet, setColorSet] = useState({
    blank: "#a19e9e",
    wrongPosition: "#c9b458",
    mixed: "linear-gradient(45deg, #c9b458, #6aaa64)",
    correct: "#6aaa64",
  });
  const [word, setWord] = useState('');
  const [wordLists, setWordLists] = useState({});
  const [guess, setGuess] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [winnerMessage, setWinnerMessage] = useState("WorddVerse");
  const [time, setTime] = useState(0);
  const [colorModal, setColorModal] = useState(false);

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
        `/data/4_letter_words.txt`,
        `/data/5_letter_words.txt`,
        `/data/6_letter_words.txt`,
        `/data/7_letter_words.txt`,
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
    if (inputRef.current && !gameOver) {
      inputRef.current.focus();
    }
  }, [words]); 

  useEffect(() => { 
    if (guess != 0 && checkGuess()) {
      setGameOver(true);
      setWinnerMessage(`You guessed ${word}!`);
    }
    else if ((guess == 5 && length.current == 7) || guess == 6) {
      setGameOver(true);
      setWinnerMessage(`The word was ${word}.`);
    }

  }, [guess]);

  useEffect(() => {
    document.documentElement.style.setProperty("--blank-color", colorSet.blank);
    document.documentElement.style.setProperty("--correct-color", colorSet.correct);
    document.documentElement.style.setProperty("--wrong-position-color", colorSet.wrongPosition);
    document.documentElement.style.setProperty("--mixed-color", colorSet.mixed);
  }, [colorSet]);

  function formatTime() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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

    const chars = document.querySelectorAll('.grid-item span');
    chars.forEach((span) => {
      span.className = '';
      span.style.color = 'black';
    });
  }


  function checkGuess() {
    let winner = true;
    const potential = [];
    const charColors = Array.from({ length: length });
    const freq = {};
    const exactMatches = {};

    for (const char of word) {
      freq[char] = (freq[char] || 0) + 1;
      exactMatches[char] = 0;
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
        charTag.className = "correct";
        keyTag.className = "correct";
        charColors[i] = "correct";
        exactMatches[char]++;
        freq[char]--;
      }
      else if (!word.includes(char)) {
        charTag.className = "blank";
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
        charTag.className = "wrong-position";
        charColors[i] = "wrong-position";

        if (exactMatches[char] > 0 && exactMatches[char] < freq[char]+1) {
          keyTag.classList.remove("correct");
          keyTag.classList.add("mixed");
        }
        else {
          keyTag.classList.add("wrong-position");
        }
        freq[char]--;
      } 
      else {
        charTag.className = "blank";
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
      const newWords = { ...prevWords }; 
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

  /*function randomGuess() {
    const word = generateWord(length.current).toUpperCase();
    setWords((prevWords) => ({
      ...prevWords,
      [map[guess]]: word,
    }));

    setGuess(prev => prev+1);
  }*/

  return <>
    <Header title="WorddVerse" setDisplay={setColorModal}/>
    <p id="time">{formatTime()}</p>
    <main className="container">
      {Array.from({ length: length.current == 7 ? 5 : 6 }).map((_, index) => (
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
    {colorModal && (
      <ColorModal 
        setDisplay={setColorModal} 
        setColors={setColorSet}
      />
    )}
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
    </>
};
