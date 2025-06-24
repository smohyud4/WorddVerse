/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";

const WordListContext = createContext();

export function WordListProvider({ children }) {
  const [wordLists, setWordLists] = useState(null);

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
        `/words/4/solutions.txt`,
        `/words/5/solutions.txt`,
        `/words/6/solutions.txt`,
        `/words/7/solutions.txt`,
        `/words/8/solutions.txt`,
      ];

      const [fourLetterWords, fiveLetterWords, sixLetterWords, sevenLetterWords, eightLetterWords] = await Promise.all(
        paths.map(loadWordList)
      );

      //console.log(fourLetterWords.length, fiveLetterWords.length, sixLetterWords.length, sevenLetterWords.length, eightLetterWords.length);

      setWordLists({
        4: fourLetterWords,
        5: fiveLetterWords,
        6: sixLetterWords,
        7: sevenLetterWords,
        8: eightLetterWords,
      });
    }

    fetchWords();
  }, []);

  return (
    <WordListContext.Provider value={wordLists}>
      {children}
    </WordListContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWordLists() {
  return useContext(WordListContext);
}