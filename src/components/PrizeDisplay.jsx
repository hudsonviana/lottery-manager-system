const PrizeDisplay = ({ prize }) => {
  return (
    <div className="py-0">
      {prize.map((prizeTier) => {
        return (
          <div key={prizeTier.faixa}>
            <p className="font-semibold">{prizeTier.descricaoFaixa}</p>
            <span className="text-gray-800">
              <p>Ganhadores: {prizeTier.numeroDeGanhadores.toLocaleString('pt-BR')}</p>
              <p>
                Prêmio:{' '}
                {prizeTier.valorPremio.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PrizeDisplay;
