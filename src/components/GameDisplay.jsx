import findMatchingNumbers from '@/helpers/findMatchingNumbers';

const formatGameName = (gameName) => {
  return gameName.replace(/^game(\w)$/, 'Aposta $1');
};

const TitleLabel = ({ title }) => {
  return <span className="bg-slate-200 w-full text-sm font-semibold px-1">{title}</span>;
};

const getNumberClassNames = (drawnNumbers, matchingNumbers, number) => {
  const idleNumberStyles = 'bg-white border-green-600 text-green-600';
  const matchedNumberStyles = 'bg-blue-100 border-blue-600 text-blue-600';
  const missedNumberStyles = 'bg-orange-100 border-orange-600 text-orange-600';

  if (drawnNumbers.length === 0) {
    return idleNumberStyles;
  }

  return matchingNumbers.includes(number) ? matchedNumberStyles : missedNumberStyles;
};

const getDrawResultClassNames = (hits) => {
  const defaultStyles =
    'text-gray-600 bg-white rounded px-1 font-semibold whitespace-nowrap';

  const prizeStyles = {
    4: 'text-white bg-blue-600 rounded px-1 font-semibold whitespace-nowrap',
    5: 'text-white bg-green-600 rounded px-1 font-semibold whitespace-nowrap',
    6: 'text-white bg-red-600 rounded px-1 font-semibold whitespace-nowrap',
  };

  return prizeStyles[hits] || defaultStyles;
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
                {/* Draw result */}
                {drawnNumbers.length > 0 ? (
                  <div className="ms-2 flex flex-col gap-1">
                    <TitleLabel title={'Resultado'} />
                    <div className="flex h-full items-center relative">
                      <span className="text-gray-600 bg-white rounded px-1 font-semibold whitespace-nowrap invisible">
                        9 acertos
                      </span>
                      <span className={`${getDrawResultClassNames(hits)} absolute`}>
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
