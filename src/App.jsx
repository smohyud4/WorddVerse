import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Game from './components/Game/Game';
import Stats from './components/Stats/Stats';
import './App.css'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Game/>} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
