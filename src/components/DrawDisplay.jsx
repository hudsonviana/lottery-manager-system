const TitleLabel = ({ title }) => {
  return <span className="bg-slate-200 w-full text-sm font-semibold px-1">{title}</span>;
};

const DrawDisplay = ({ drawnNumbers }) => {
  return (
    <div className="p-2 my-2 border border-slate-300 rounded-md mt-0 w-fit">
      <div className="flex flex-col gap-1">
        <TitleLabel title="Dezenas sorteadas" />
        <span className="flex gap-2">
          {drawnNumbers.map((drawnNumber, i) => (
            <div
              key={i}
              className="size-10 rounded-full flex items-center justify-center border-solid border-2 font-bold bg-white border-green-600 text-green-600"
            >
              {drawnNumber}
            </div>
          ))}
        </span>
      </div>
    </div>
  );
};

export default DrawDisplay;
