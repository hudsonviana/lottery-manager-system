import findMatchingNumbers from '@/helpers/findMatchingNumbers';

const formatGameName = (gameName) => {
  return gameName.replace(/^game(\w)$/, 'Aposta $1');
};

const getNumberClassNames = (drawnNumbers, matchingNumbers, number) => {
  const styles = {
    idle: 'bg-white border-sky-600 text-sky-600',
    matched: 'bg-blue-100 border-blue-600 text-blue-600',
    missed: 'bg-orange-100 border-orange-600 text-orange-600',
  };

  if (drawnNumbers.length === 0) {
    return styles.idle;
  }

  return matchingNumbers.includes(number) ? styles.matched : styles.missed;
};

const getDrawResultClassNames = (hits) => {
  const baseStyles = 'rounded px-1 font-semibold whitespace-nowrap';

  const styles = {
    4: `text-white bg-blue-600 ${baseStyles}`,
    5: `text-white bg-green-600 ${baseStyles}`,
    6: `text-white bg-red-600 ${baseStyles}`,
    default: `text-gray-500 bg-white ${baseStyles}`,
  };

  return styles[hits] || styles.default;
};

const TitleLabel = ({ title }) => {
  return <span className="bg-slate-200 w-full text-sm font-semibold px-1">{title}</span>;
};

const GameNumbers = ({ gameName, numbers, drawnNumbers, matchingNumbers }) => {
  return (
    <div className="flex flex-col gap-1">
      <TitleLabel title={formatGameName(gameName)} />
      <div className="flex gap-2">
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
      </div>
    </div>
  );
};

const DrawResult = ({ hits }) => {
  return (
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
  );
};

const GameDisplay = ({ gameNumbers, drawnNumbers }) => {
  return (
    <div className="p-2 my-2 border border-slate-300 rounded-md mt-0">
      <div className="flex flex-col gap-3">
        {Object.entries(gameNumbers).map(([gameName, numbers]) => {
          if (numbers.length > 0) {
            const [matchingNumbers, hits] = findMatchingNumbers(numbers, drawnNumbers);

            return (
              <div key={gameName} className="flex">
                <GameNumbers
                  gameName={gameName}
                  numbers={numbers}
                  drawnNumbers={drawnNumbers}
                  matchingNumbers={matchingNumbers}
                />

                {drawnNumbers.length > 0 ? <DrawResult hits={hits} /> : null}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default GameDisplay;
