/* eslint-disable react/prop-types */

export default function Row({word, guess, length}) {

  function getContainerWidth(length) {
    if (window.innerWidth > 600) {
      return {
        width: `${(length/5)*50}%`
      };
    }

    return {
      width: `${(length/6)*80}%`
    };
  }
      
  function calculateSpanStyles(length) {
    const spanWidth = `${100/length}%`;
    return { width: spanWidth };
  }
    
  return (
    <div className="grid-item" style={getContainerWidth(length.current)}>
      {word.split('').map((char, index) => {
        const id = `${guess}${index}`;
        return (
          <span id={id} key={id} style={calculateSpanStyles(length.current)}>
            {char}
          </span> 
        )
      })}
    </div>
  )
}