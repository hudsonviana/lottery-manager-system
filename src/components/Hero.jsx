const Hero = () => {
  return (
    <section className="hero-container">
      <div
        className="hero"
        style={{ backgroundImage: 'url(/lottery-4-transformed-hight-qualitty-2.png)' }}
      ></div>
      <div className="hero-stuff flex gap-28">
        <div className="w-96 ms-52">
          <div className="text-5xl text-white font-semibold shadow-blue">
            Sistema de Gerenciamento de Apostas na Loteria Federal
          </div>
          <div>
            <div className="text-gray-100 font-medium my-6 shadow-blue">
              Clique abaixo para mais informações sobre as loterias ferderais
              administradas pela Caixa.
            </div>
            <a
              href="https://loterias.caixa.gov.br/Paginas/default.aspx"
              target="_blank"
              className="btn"
            >
              Saiba mais
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
