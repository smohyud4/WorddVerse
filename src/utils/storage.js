export function saveStats(stats) {
  localStorage.setItem("lengthStats", JSON.stringify(stats));
}

export function loadStats() {
  const savedStats = localStorage.getItem("lengthStats");
  return savedStats ? JSON.parse(savedStats) : null;
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