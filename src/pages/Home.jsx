import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import HomeCard from '@/components/HomeCard';
import { HiOutlineCog } from 'react-icons/hi';
import { FaChartLine } from 'react-icons/fa';
import { MdWorkspacePremium } from 'react-icons/md';
import { MdEditCalendar } from 'react-icons/md';

import './Home.css';

const Home = () => {
  return (
    <>
      <Hero title="SiGALF" className="-z-20 bg-green-300" />

      <section className="px-40 py-24 z-50 bg-white -translate-y-10">
        <div className="flex flex-row mt-10">
          <div className="mr-8 flex flex-row">
            <HiOutlineCog fontSize={70} className="mr-5 text-neutral-600" />
            <span className="text-justify">
              Este sistema é uma ferramenta para gerenciar apostas realizadas na loteria
              Federal da Caixa Econômica Federal
            </span>
          </div>
          <div className="text-justify text-neutral-600">
            O <span className="font-semibold italic">SiGALF</span> oferece uma maneira
            eficiente e prática para que apostadores possam registrar, acompanhar e
            gerenciar suas apostas realizadas na loteria Federal. Acompanhe todas as suas
            apostas em um só lugar e confira os resultados com uma visão clara e
            organizada dos seus jogos.
          </div>
        </div>
        <div className="flex flex-row mt-10 mb-10 gap-4 justify-between">
          <HomeCard
            icon={<MdEditCalendar />}
            text="Cadastre apostas realizadas no aplicativo da Caixa ou nas lotéricas"
          />
          <HomeCard
            icon={<MdWorkspacePremium />}
            text="Confira os resultados dos sorteios na loteria Federal"
          />
          <HomeCard
            icon={<FaChartLine />}
            text="Consulte o histórico de jogos, das apostas e outras estatísticas"
          />
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
