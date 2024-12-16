const formatGameName = (gameName) => {
  return gameName.replace(/^game(\w)$/, 'Aposta $1');
};

const TitleLabel = ({ title }) => {
  return <span className="bg-slate-200 w-full text-sm font-semibold">{title}</span>;
};

const GameDisplay = ({ gameNumbers, drawnNumbers = [], isForDraw = false }) => {
  return (
    <div className={isForDraw ? 'flex flex-col gap-3' : 'py-0'}>
      {Object.entries(gameNumbers).map(([gameName, numbers]) => {
        if (numbers.length > 0) {
          if (isForDraw) {
            return (
              <div key={gameName} className="flex">
                <div id="principal" className="flex flex-col gap-1">
                  <TitleLabel title={formatGameName(gameName)} />
                  <span className="flex gap-2">
                    {numbers.map((number, i) => (
                      <div
                        key={i}
                        className="size-10 bg-white rounded-full flex items-center justify-center border-solid border-2 border-green-600"
                      >
                        <span class="text-green-600 font-bold">{number}</span>
                      </div>
                    ))}
                  </span>
                </div>
                {/* Continuar dqui */}
                <div className="ms-2 flex flex-col gap-1">
                  <TitleLabel title={'Resultado'} />
                  <div className="flex h-full items-center">
                    <span className="text-green-600 font-bold">4 acertos</span>
                  </div>
                </div>
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
