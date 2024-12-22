const PrizeDisplay = ({ prize }) => {
  return (
    <div className="py-0">
      {prize.map((prizeTier) => {
        return (
          <div key={prizeTier.faixa} className="mb-2">
            <span className="font-semibold">{prizeTier.descricaoFaixa}</span>
            <div className="text-gray-700 flex flex-col">
              <span>
                Ganhadores: {prizeTier.numeroDeGanhadores.toLocaleString('pt-BR')}
              </span>
              <span>
                Prêmio:{' '}
                {prizeTier.valorPremio.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PrizeDisplay;
