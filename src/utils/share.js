const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function share(result, URL) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile && navigator.share) {
    navigator
      .share({
        title: `WorddVerse`,
        text: result,
        url: URL,
      })
      .then(() => console.log('Shared successfully'))
      .catch(() => console.log('Failed to share'));
  } 
  else {
    console.log(URL);
    navigator.clipboard.writeText(`${result}\n${URL}`)
      .then(() => alert('Results copied to clipboard!'))
      .catch(() => alert('Failed to copy results.'));
  }
}

export function generateGameId(length) {
  const s1 = Math.floor(Math.random()*letters.length);
  const s2 = Math.floor(Math.random()*letters.length);
  const s3 = Math.floor(Math.random()*letters.length);

  return `${length}${letters[s1]}${letters[s2]}${letters[s3]}`;
}