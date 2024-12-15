const PrizeDisplay = ({ prize }) => {
  return (
    <div className="py-0">
      {prize.map((prizeTier) => {
        return (
          <div key={prizeTier.faixa}>
            <p className="font-semibold">{prizeTier.descricaoFaixa}</p>
            <p>Ganhadores: {prizeTier.numeroDeGanhadores}</p>
            <p>
              Prêmio:{' '}
              {prizeTier.valorPremio.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default PrizeDisplay;
