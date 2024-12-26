const HomeCard = ({ text = 'Teste', icon }) => {
  return (
    <div className="flex items-center gap-4 rounded-sm border border-neutral-300 p-6 w-full text-justify bg-slate-100">
      <span className="text-xl text-neutral-600">{icon}</span>
      <span className="text-neutral-900">{text}</span>
    </div>
  );
};

export default HomeCard;
