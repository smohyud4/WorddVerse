/* eslint-disable react/prop-types */
import './ColorModal.css';

const colorSets = [
    {
        blank: "#a19e9e",
        wrongPosition: "#c9b458",
        mixed: "linear-gradient(45deg, #c9b458, #6aaa64)",
        correct: "#6aaa64"
    },
    {
        blank: "#a19e9e", 
        wrongPosition: "hsl(203, 6.60%, 23.90%)",
        mixed: "linear-gradient(45deg,hsl(203, 6.60%, 23.90%),hsl(8, 80.20%, 56.50%) )", 
        correct: "hsl(8, 80.20%, 56.50%)", 
    },
    {
        blank: "#d2b48c",
        wrongPosition: "#83c5be", 
        mixed: "linear-gradient(45deg, #83c5be, #006d77)",
        correct: "#006d77",
    },
    {
        blank: "#708090", 
        wrongPosition: "hsl(51, 98%, 45.00%)",
        mixed: "linear-gradient(45deg, hsl(51, 98%, 45.00%),hsl(283, 97.70%, 33.70%))", 
        correct: "hsl(283, 97.70%, 33.70%)", 
    },
    {
        blank: "#a19e9e", 
        wrongPosition: "hsl(207, 88.50%, 27.30%)", 
        mixed: "linear-gradient(45deg, hsl(207, 88.50%, 27.30%), hsl(192, 69.50%, 56.30%))", 
        correct: "hsl(192, 69.50%, 56.30%)", 
    },
    {
        blank: "#a19e9e",
        wrongPosition: "hsl(25, 45.10%, 53.70%)",
        mixed: "linear-gradient(45deg,hsl(25, 45.10%, 53.70%),hsl(210, 55.20%, 55.90%))",
        correct: "hsl(210, 55.20%, 55.90%)"
    },
    {
      blank: "#efc7c2", 
      wrongPosition: "hsl(333, 92.90%, 55.70%)", 
      mixed: "linear-gradient(45deg, hsl(333, 92.90%, 55.70%), hsl(315, 97.00%, 25.90%))", 
      correct: "hsl(315, 97.00%, 25.90%)"
    }
];

export default function ColorModal({setDisplay, setColors, currentIndex, setIndex}) {

  function nextSet() {
    setIndex(prevIndex => {
      const newIndex = (prevIndex+1) % colorSets.length;
      setColors(colorSets[newIndex]);
      return newIndex;
    });
  }

  function prevSet() {
    setIndex(prevIndex => {
      const newIndex = prevIndex === 0 ? colorSets.length - 1 : prevIndex - 1;
      setColors(colorSets[newIndex]);
      return newIndex;
    });
  }

  return (
    <div role="dialog" className="modal">
      <div className="modal-content">
        <h1>Choose a Color Set</h1>
        <h3>Rival</h3>
        <div className="colorSet">
          <div
            className="colorSet-item"
          >
            <span style={{ backgroundColor: colorSets[currentIndex].correct }}>R</span>
            <span style={{ backgroundColor: colorSets[currentIndex].blank }}>E</span>
            <span style={{ backgroundColor: colorSets[currentIndex].wrongPosition}}>L</span>
            <span style={{ backgroundColor: colorSets[currentIndex].correct }}>A</span>
            <span style={{ backgroundColor: colorSets[currentIndex].blank }}>Y</span>
          </div>
          <div
            className="colorSet-item"
          >
            <span style={{ backgroundColor: colorSets[currentIndex].wrongPosition }}>L</span>
            <span style={{ backgroundColor: colorSets[currentIndex].correct }}>I</span>
            <span style={{ backgroundColor: colorSets[currentIndex].blank}}>G</span>
            <span style={{ backgroundColor: colorSets[currentIndex].blank }}>H</span>
            <span style={{ backgroundColor: colorSets[currentIndex].blank }}>T</span>
          </div>
        </div>
        <div className="carousel-controls">
          <button onClick={prevSet}>&laquo;</button>
          <button onClick={nextSet}>&raquo;</button>
        </div>
        <button onClick={() => setDisplay(false)}>Close</button>
      </div>
    </div>
  );
}