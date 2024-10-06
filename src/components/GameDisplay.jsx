const GameDisplay = ({ gameNumbers }) => {
  return (
    <div className="py-1">
      {Object.entries(gameNumbers).map(([gameName, numbers]) => {
        if (numbers.length > 0) {
          return (
            <div key={gameName}>
              <span className="me-2">
                {gameName.replace(/^game(\w)$/, 'Aposta $1')}:
              </span>
              <span>{numbers.length > 0 ? numbers.join(' - ') : ''}</span>
            </div>
          );
        }
      })}
    </div>
  );
};

export default GameDisplay;
