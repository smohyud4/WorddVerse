import { useState, useEffect } from 'react';
import { loadStats } from '../../utils/storage';
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
      setIndex((index + 1) % 6);
      return;
    }
    setIndex(index == 0 ? 5 : index - 1);
  }

  if (!stats) {
    return <>
     <div className="nostats-container">
      <p>Finish a game to see your stats</p>
     </div>
    </>
  }

  return <> 
    <main>
      <section className="stats-container">
        <div className="game-stats">
          <Graph stats={stats[index]} length={index+4}/>
        </div>
        <section className="stat-controls">
          <button onClick={() => changeLength(false)}>&laquo;</button>
          <button onClick={() => changeLength(true)}>&raquo;</button>
        </section>
      </section>
    </main>
  </>
}