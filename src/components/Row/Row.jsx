/* eslint-disable react/prop-types */

export default function Row({word, guess, length}) {

  function getContainerWidth(length) {
    if (window.innerWidth > 600) {
      return {
        width: `${(length/5)*50}%`
      };
    }

    if (length == 8) {
      return {
        width: '97%',
        gap: '2%'
      };
    }

    return {
      width: `${(length/6)*80}%`
    };
  }
      
  function calculateSpanStyles(length) {
    const spanWidth = `${100/length}%`;
    if (length == 8) return { width: '10%'};
    return { width: spanWidth };
  }
    
  return (
    <div className="grid-item" style={getContainerWidth(length.current)}>
      {Array.from({length: length.current}).map((_, index) => {
        const id = `${guess}${index}`;
        return (
          <span id={id} key={id} style={calculateSpanStyles(length.current)}>
            {word[index] || ''}
          </span> 
        )
      })}
    </div>
  )
}