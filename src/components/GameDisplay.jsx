const GameDisplay = ({ gameNumbers, isForDraw = false }) => {
  return (
    <div className="py-0">
      {Object.entries(gameNumbers).map(([gameName, numbers]) => {
        if (numbers.length > 0) {
          if (isForDraw) {
            return (
              <div key={gameName}>
                <span className="me-2 text-sm font-semibold">
                  {gameName.replace(/^game(\w)$/, 'Aposta $1')}
                </span>
                <span className="flex gap-2">
                  {numbers.length > 0
                    ? numbers.map((number, i) => (
                        <div
                          key={i}
                          className="size-10 bg-white rounded-full flex items-center justify-center border-solid border-2 border-green-600"
                        >
                          <span class="text-green-600 font-bold">{number}</span>
                        </div>
                      ))
                    : ''}
                </span>
              </div>
            );
          }
          return (
            <div key={gameName}>
              <span className="me-2">{gameName.replace(/^game(\w)$/, 'Aposta $1')}:</span>
              <span>{numbers.length > 0 ? numbers.join(' - ') : ''}</span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default GameDisplay;
