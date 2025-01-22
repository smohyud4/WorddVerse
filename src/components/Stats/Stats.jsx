import { useState, useEffect } from 'react';
import { loadStats } from '../../utils/storage';
import Header from '../Header/Header';
import Graph from '../Graph/Graph';
import './Stats.css'

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [index, setIndex] = useState(1);

  useEffect(() => {
    const saved = loadStats();
    if (saved) setStats(saved);
  }, []);

  function changeLength(forward) {
    if (forward) {
      setIndex((index + 1) % 4);
      return;
    }
    setIndex(index == 0 ? 3 : index - 1);
  }

  if (!stats) {
    return <>
     <Header title="WorddVerse" setDisplay={() => {}}/>
     <p>Finish a game to see your stats</p>
    </>
  }

  return <> 
    <Header title="WorddVerse" setDisplay={() => {}}/>
    <div className="stats-container">
      <div className="game-stats">
        <Graph stats={stats[index]} length={index+4}/>
      </div>
    </div>
    <div className="stat-controls">
      <button onClick={() => changeLength(false)}>&laquo;</button>
      <button onClick={() => changeLength(true)}>&raquo;</button>
    </div>
  </>
}