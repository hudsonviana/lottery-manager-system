const Footer = ({ currentYear }) => {
  return (
    <footer className="bg-sky-950 px-10 py-5 -translate-y-10">
      <section className="z-50">
        <div className="flex flex-row justify-between gap-12">
          <div className="flex w-full text-white">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consectetur ut
            maiores corrupti suscipit laborum quas, maxime quae dolores nisi rerum ducimus
            iste ab possimus expedita cum fugit fugiat iure sequi.
          </div>
          <div className="flex w-full text-white">Dois</div>
          <div className="flex w-full text-white">Três</div>
          <div className="flex w-full text-white">Quatro</div>
        </div>
        <div className="flex flex-row justify-between mt-5 pt-4 border-t border-neutral-500 text-neutral-400">
          <span>{currentYear}. &copy; Todos os direitos reservados.</span>
          <span>Desenvolvido por Hudson Andrade Viana</span>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
