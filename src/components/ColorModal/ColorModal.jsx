/* eslint-disable react/prop-types */
import { useState } from 'react';
import './ColorModal.css';

const colorSets = [
    {
        blank: "#a19e9e",
        wrongPosition: "#c9b458",
        mixed: "linear-gradient(45deg, #c9b458, #6aaa64)",
        correct: "#6aaa64"
    },
    {
        blank: "#a19e9e", // Light Purple
        wrongPosition: "#e94f37", // Amber
        mixed: "linear-gradient(45deg, #e94f37, #393e41)", // Amber to Lime Green
        correct: "#393e41", // Lime Green
    },
    {
        blank: "#d2b48c", // Taupe
        wrongPosition: "#83c5be", // Coral
        mixed: "linear-gradient(45deg, #83c5be, #006d77)", // Coral to Olive
        correct: "#006d77", // Olive
    },
    {
        blank: "#708090", // Slate Gray
        wrongPosition: "#d496a7", // Gold
        mixed: "linear-gradient(45deg, #d496a7, #5d576b)", // Gold to Emerald
        correct: "#5d576b", // Emerald
    },
    {
        blank: "#a19e9e", // Beige
        wrongPosition: "#42bfdd", // Mustard
        mixed: "linear-gradient(45deg, #42bfdd, #084b83)", // Mustard to Forest Green
        correct: "#084b83", // Forest Green
    },
    {
        blank: "#708090", // Light Blue
        wrongPosition: "#8390fa", // Light Green
        mixed: "linear-gradient(45deg, #8390fa, #1d2f6f)", // Light Green to Orange
        correct: "#1d2f6f", // Orange
    },
    {
        blank: "#a19e9e", // Light Blue
        wrongPosition: "#00a9a5", // Light Green
        mixed: "linear-gradient(45deg, #00a9a5, #0b5351)", // Light Green to Orange
        correct: "#0b5351", // Orange
    },
];

export default function ColorModal({ setDisplay, setColors }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  function nextSet() {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % colorSets.length);
  }

  function prevSet() {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? colorSets.length - 1 : prevIndex - 1
    );
  };

  return (
    <div role="dialog" className="modal">
      <div className="modal-content">
        <h1>Choose a Color Set</h1>
        <h4>Rival</h4>
        <div className="colorSet">
          <div
            className="colorSet-item"
            onClick={() => setColors(colorSets[currentIndex])}
          >
            <span style={{ backgroundColor: colorSets[currentIndex].correct }}>R</span>
            <span style={{ backgroundColor: colorSets[currentIndex].blank }}>E</span>
            <span style={{ backgroundColor: colorSets[currentIndex].wrongPosition}}>L</span>
            <span style={{ backgroundColor: colorSets[currentIndex].correct }}>A</span>
            <span style={{ backgroundColor: colorSets[currentIndex].blank }}>Y</span>
          </div>
        </div>
        <div className="carousel-controls">
          <button onClick={prevSet}>&laquo; Previous</button>
          <button onClick={nextSet}>Next &raquo;</button>
        </div>
        <button onClick={() => setDisplay(false)}>Close</button>
      </div>
    </div>
  );
}