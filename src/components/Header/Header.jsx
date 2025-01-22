/* eslint-disable react/prop-types */
import { IoMdColorPalette } from "react-icons/io";
import { IoIosStats } from "react-icons/io";
import './Header.css';

export default function Header({title, setDisplay}) { 
  return (
    <nav>
      <h1 id='title'><a href='/'>{title}</a></h1>
      <div onClick={() => setDisplay(true)}>
        <IoMdColorPalette/>
      </div>
      <div>
        <a href='/stats'><IoIosStats/></a>
      </div>
    </nav>
  );
}