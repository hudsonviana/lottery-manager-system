const HomeCard = ({ text = 'Teste' }) => {
  return (
    <div className="rounded-sm border border-neutral-300 p-6 w-full text-justify">
      {text}
    </div>
  );
};

export default HomeCard;
