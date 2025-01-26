/* eslint-disable react/prop-types */
import { IoMdTime } from "react-icons/io";
import './Graph.css'

export default function Graph({stats, length}) {

  function getBarWidth(freq) {
    const min = Math.min(...stats.guessFrequency);
    const max = Math.max(...stats.guessFrequency);

    if (min === max) return { width: '100%' };

    const width = (0.05 + ((freq - min) / (max - min)) * (1-0.05)) * 100;
    return { width: `${width}%` };
  }

  if (stats.games == 0) {
    return <p>Finish a game to view your stats for {length} letter words</p>;
  }

  return <>
    <h2>
      Games: {stats.games} Win%: {((stats.wins / stats.games) * 100).toFixed(0)} 
    </h2>
    <span className="length-container">
      {Array.from({length: length}).map((_, index) => {
        return <span key={index}></span>
      })}
    </span>
    <p>
      Guess Frequency
    </p>
    <div className="frequency-graph">
      {stats.guessFrequency.map((freq, index) => {
        if (index === 5 && length === 7) return null;
        return (
          <div key={index} className="bar-container">
            <span>{index+1}</span>
            <div
              className="bar"
              style={getBarWidth(freq)}
            >
              <p>{freq}</p>
            </div>
          </div>
        );
      })}
    </div>
    <div className="time-stats">
      <div className="time-bar">
        <IoMdTime className="time-icon"/>
        <p>
          Best  
          <span className="stat">
            {stats.bestTime === 10000000000 ? ' N/A' : ` ${stats.bestTime}s`}
          </span>
        </p>
      </div>
      <div className="time-bar">
        <IoMdTime className="time-icon"/>
        <p>Average  <span className="stat">{(stats.totalTime/stats.games).toFixed(0)}s</span></p>
      </div>
      <div>
        <p>Streak <span className="stat">{stats.streak}</span></p>
      </div>
      <div>
        <p>Max Streak <span className="stat">{stats.bestStreak}</span></p>
      </div>
    </div>
  </>
}

