const formatGameName = (gameName) => {
  return gameName.replace(/^game(\w)$/, 'Aposta $1');
};

const GameNumbersTableRow = ({ gameNumbers }) => {
  return (
    <div className="py-0">
      {Object.entries(gameNumbers).map(([gameName, numbers]) => {
        if (numbers.length > 0) {
          return (
            <div key={gameName}>
              <span className="whitespace-nowrap me-2">{formatGameName(gameName)}:</span>
              <span className="whitespace-nowrap">
                {numbers.length > 0 ? numbers.join(' - ') : null}
              </span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default GameNumbersTableRow;
