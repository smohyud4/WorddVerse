export function saveStats(stats) {
  localStorage.setItem("lengthStatss", JSON.stringify(stats));
}

export function loadStats() {
  const savedStats = localStorage.getItem("lengthStatss");
  return savedStats ? JSON.parse(savedStats) : null;
}

export function initStats() {
  const initialStats = loadStats();

  if (!initialStats) {
    let oldStats = localStorage.getItem("lengthStats");
    
    if (oldStats) {
      oldStats = JSON.parse(oldStats);
      let newStats = oldStats;
      
      newStats.push({
        guessFrequency: [0, 0, 0, 0, 0, 0],
        streak: 0,
        bestStreak: 0,
        bestTime: 10000000000,
        totalTime: 0,
        games: 0,
        wins: 0
      });

      localStorage.removeItem("lengthStats");
      saveStats(newStats);
    }
    else {
      const defaultStats = Array(5).fill({
        guessFrequency: [0, 0, 0, 0, 0, 0],
        streak: 0,
        bestStreak: 0,
        bestTime: 10000000000,
        totalTime: 0,
        games: 0,
        wins: 0
      });

      saveStats(defaultStats);
    }
  }
}

/*
{
    guessFrequency: [1, 2, 5, 6, 7, 40],
    streak: 23,
    bestStreak: 23,
    bestTime: 12,
    totalTime: 49,
    games: 23,
    wins: 23,
  },
*/

export function updateStats(stats, guesses, time, length, win) {
  const updatedStats = [...stats];
  const currentStats = updatedStats[length-4];

  if (win) {
    currentStats.wins += 1;
    currentStats.streak += 1;
    currentStats.bestStreak = Math.max(currentStats.streak, currentStats.bestStreak);
    currentStats.bestTime = Math.min(time, currentStats.bestTime);
    currentStats.guessFrequency[guesses-1] += 1;
  } 
  else {
    currentStats.streak = 0; 
  }

  currentStats.games += 1;
  currentStats.totalTime += time;

  saveStats(updatedStats);
}