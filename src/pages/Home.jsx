import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import HomeCard from '@/components/HomeCard';
import { HiOutlineCog } from 'react-icons/hi';

const Home = () => {
  return (
    <>
      <Hero title="SGL" />
      <div className="px-40">
        <div className="flex flex-row mt-10">
          <div className="mr-8 flex flex-row">
            <HiOutlineCog fontSize={70} className="mr-5 text-neutral-400" />
            <span className="text-justify">
              Este sistema é uma ferramenta para gerenciar apostas realizadas na
              loteria Federal da Caixa Econômica Federal
            </span>
          </div>
          <div className="text-justify text-neutral-600">
            O <span className="font-semibold italic">SGL</span> oferece uma
            maneira eficiente e prática para que apostadores possam registrar,
            acompanhar e gerenciar suas apostas realizadas na loteria Federal.
            Acompanhe todas as suas apostas em um só lugar e confira suas
            chances de ganhar com uma visão clara e organizada dos seus jogos.
          </div>
        </div>
        <div className="flex flex-row mt-10 mb-10 gap-4 justify-between">
          <HomeCard text="1. Cadastre apostas realizadas no aplicativo da Caixa ou nas lotéricas" />
          <HomeCard text="2. Consulte as apostas, histórico de jogos e outras estatísticas" />
          <HomeCard text="3. Confira os resultados dos sorteios na loteria Federal" />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
