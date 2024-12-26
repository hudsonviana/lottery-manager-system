const Hero = ({
  title = 'Sistema de Apostas',
  subtitle = 'Sistema de Gerenciamento de Apostas em Loterias',
}) => {
  return (
    // <section classNameName="bg-sky-700 py-20 mb-10">
    //   <div classNameName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    //     <div classNameName="text-center">
    //       <h1 classNameName="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
    //         {title}
    //       </h1>
    //       <p classNameName="my-4 text-xl text-white">{subtitle}</p>
    //     </div>
    //   </div>
    // </section>

    // <section className="relative bg-black">
    //   <div className="fixed top-0 w-full h-[60vh] mb-5 overflow-hidden grid grid-areas-[stack] bg-black ">
    //     <div className="absolute translate-y-[-30px] bg-cover bg-no-repeat bg-[url('lottery-4-transformed-hight-qualitty.png')] w-full h-full p-10 transition-transform duration-2000 opacity-90 hover:scale-[1.15] hover:opacity-[0.4]"></div>
    //     <div className="absolute top-[250px] left-10">
    //       <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
    //         Sistema de Apostas
    //       </h1>
    //       <p className="my-4 text-xl text-white">
    //         Sistema de Gerenciamento de Apostas em Loterias
    //       </p>
    //     </div>
    //   </div>
    // </section>

    <section className="hero-container">
      <div className="hero"></div>
      <div className="hero-stuff">
        <h1>I love Coffee</h1>
        <a href="#" className="btn">
          By me Some
        </a>
      </div>
    </section>
  );
};

export default Hero;
