import findMatchingNumbers from '@/helpers/findMatchingNumbers';

const formatGameName = (gameName) => {
  return gameName.replace(/^game(\w)$/, 'Aposta $1');
};

const TitleLabel = ({ title }) => {
  return <span className="bg-slate-200 w-full text-sm font-semibold">{title}</span>;
};

const getNumberClassNames = (drawnNumbers, matchingNumbers, number) => {
  const idleNumberStyles = 'bg-white border-green-600 text-green-600';
  const matchedNumberStyles = 'bg-blue-100 border-blue-600 text-blue-600';
  const missedNumberStyles = 'bg-red-100 border-red-600 text-red-600';

  if (drawnNumbers.length === 0) {
    return idleNumberStyles;
  }

  return matchingNumbers.includes(number) ? matchedNumberStyles : missedNumberStyles;
};

const GameDisplay = ({ gameNumbers, drawnNumbers = [], isForDraw = false }) => {
  return (
    <div className={isForDraw ? 'flex flex-col gap-3' : 'py-0'}>
      {Object.entries(gameNumbers).map(([gameName, numbers]) => {
        if (numbers.length > 0) {
          if (isForDraw) {
            const [matchingNumbers, hits] = findMatchingNumbers(numbers, drawnNumbers);
            return (
              <div key={gameName} className="flex">
                <div id="principal" className="flex flex-col gap-1">
                  <TitleLabel title={formatGameName(gameName)} />
                  <span className="flex gap-2">
                    {numbers.map((number, i) => (
                      <div
                        key={i}
                        className={`size-10 rounded-full flex items-center justify-center border-solid border-2 font-bold ${getNumberClassNames(
                          drawnNumbers,
                          matchingNumbers,
                          number
                        )}`}
                      >
                        {number}
                      </div>
                    ))}
                  </span>
                </div>
                {/* Continuar dqui */}
                {drawnNumbers.length > 0 ? (
                  <div className="ms-2 flex flex-col gap-1">
                    <TitleLabel title={'Resultado'} />
                    <div className="flex h-full items-center relative">
                      <span className="text-red-600 font-bold invisible whitespace-nowrap">
                        9 acertos
                      </span>
                      <span className="text-blue-600 font-bold absolute whitespace-nowrap">
                        {hits} {hits > 1 ? 'acertos' : 'acerto'}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          }
          return (
            <div key={gameName}>
              <span className="me-2">{formatGameName(gameName)}:</span>
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
