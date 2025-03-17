import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Game from './components/Game/Game';
import TimedGame from './components/Game/TimedGame';
import Stats from './components/Stats/Stats';
import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Game/>} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/time-trial" element={<TimedGame/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
