const Hero = () => {
  return (
    <section className="hero-container">
      <div className="hero"></div>
      <div className="hero-stuff flex gap-28">
        <div className="w-96 ms-52">
          <div className="text-5xl text-white font-semibold shadow-blue">
            Sistema de Gerenciamento de Loterias
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
