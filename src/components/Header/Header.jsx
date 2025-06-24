import { useState, useEffect } from 'react';
import CustomWord from '../CustomWord/CustomWord';
import ColorModal from '../ColorModal/ColorModal';
import { IoMdColorPalette } from "react-icons/io";
import { IoIosStats } from "react-icons/io";
import { FcPlus } from "react-icons/fc";
import { MdOutlineDarkMode } from "react-icons/md";
import './Header.css';

export default function Header() { 
  const [customWordModal, setCustomWordModal] = useState(false);
  const [colorModal, setColorModal] = useState(false);
  const [currentIndex, setIndex] = useState(0);
  const [colorSet, setColorSet] = useState(JSON.parse(localStorage.getItem("colorSetWV23748893")) || {
    blank: "#a19e9e",
    wrongPosition: "#c9b458",
    mixed: "linear-gradient(45deg, #c9b458, #6aaa64)",
    correct: "#6aaa64",
  });
  const [theme, setTheme] = useState(localStorage.getItem("themeWV23748893") || "light");

  useEffect(() => {
    document.documentElement.style.setProperty("--blank-color", colorSet.blank);
    document.documentElement.style.setProperty("--correct-color", colorSet.correct);
    document.documentElement.style.setProperty("--wrong-position-color", colorSet.wrongPosition);
    document.documentElement.style.setProperty("--mixed-color", colorSet.mixed);
    localStorage.setItem("colorSetWV23748893", JSON.stringify(colorSet));
  }, [colorSet]);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("themeWV23748893", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  }

  return <>
    <nav>
      <div className='primary-links'>
        <a href="/"><img id='logo' src='output-onlinepngtools.png' alt='logo'/></a> 
        <a id='trial' href="/time-trial">Trial</a>
      </div>
       
      <div className='secondary-links'>
        <div className='icon-container' onClick={() => setColorModal(true)}>
          <IoMdColorPalette/>
        </div>
        <div className='icon-container'>
          <a href='/stats'><IoIosStats/></a>
        </div>
        <div className='icon-container' onClick={() => toggleTheme()}>
          <MdOutlineDarkMode/>
        </div>
        <div className='icon-container' onClick={() => setCustomWordModal(true)}>
          <FcPlus/>
        </div>
      </div>
    </nav>
    {colorModal && <ColorModal setDisplay={setColorModal} setColors={setColorSet} currentIndex={currentIndex} setIndex={setIndex}/>}
    {customWordModal && <CustomWord setDis={setCustomWordModal}/>}
  </>
}