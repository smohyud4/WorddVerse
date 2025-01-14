/* eslint-disable react/prop-types */
import { IoMdColorPalette } from "react-icons/io";
import './Header.css';

export default function Header({title, setDisplay}) { 
  return (
    <header>
      <h1 id='title'>{title}</h1>
      <div onClick={() => setDisplay(true)}>
        <IoMdColorPalette/>
      </div>
    </header>
  );
}