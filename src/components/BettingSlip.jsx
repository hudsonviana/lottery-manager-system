import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useState } from 'react';

const selectDozen = (dozen) => (prevList) => [...prevList, dozen];
const removeDozen = (dozen) => (prevList) =>
  prevList.filter((value) => value !== dozen);

// Dozen Button
const Dozen = ({ num, isEnabled, setSelectedDozens, betNumber }) => {
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(false);
  }, [betNumber]);

  const handleDozenClick = () => {
    if (isSelected || isEnabled) {
      setIsSelected((prevState) => !prevState);
      setSelectedDozens(isSelected ? removeDozen(num) : selectDozen(num));
    }
  };

  return (
    <button
      onClick={handleDozenClick}
      className={`size-7 ${isSelected ? 'bg-blue-950 text-white' : 'bg-white'}`}
    >
      {num}
    </button>
  );
};

// BetNumber Button
const BetNumber = ({ num, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`size-7 ${isSelected ? 'bg-blue-950 text-white' : 'bg-white'}`}
    >
      {num}
    </button>
  );
};

const BettingSlip = ({ setNewGameData }) => {
  const [betNumber, setBetNumber] = useState(0);
  const [selectedDozens, setSelectedDozens] = useState([]);

  const isEnabled = selectedDozens.length < betNumber;

  const betNumbers = Array.from({ length: 4 }, (_, i) => i + 6);

  const dozens = Array.from({ length: 60 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );

  const betValue = [
    { num: 6, value: 5 },
    { num: 7, value: 35 },
    { num: 8, value: 140 },
    { num: 9, value: 420 },
  ];

  const handleBetNumberClick = (num) => {
    setBetNumber(num);
  };

  useEffect(() => {
    setSelectedDozens([]);
  }, [betNumber]);

  return (
    <div className="flex gap-3">
      <div className="max-w-fit">
        <Label htmlFor="bettingSlip" className="text-left">
          Volante
        </Label>
        <div className="grid bg-[#fffacf] h-full p-0.5">
          <div className="mb-2">
            <h1 className="text-neutral-700 text-sm mb-1">
              Selecione quantos números deseja para esta aposta.
            </h1>
            <ul>
              {betNumbers.map((num) => (
                <li
                  key={num}
                  className="float-left"
                  style={{ margin: '2.5px' }}
                >
                  <BetNumber
                    num={num}
                    isSelected={betNumber === num}
                    onClick={() => handleBetNumberClick(num)}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h1 className="text-neutral-700 text-sm mb-1">
              Escolha os números para sua aposta:
            </h1>
            <ul>
              {dozens.map((dozen, index) => (
                <li
                  key={dozen}
                  style={{
                    float: 'left',
                    margin: '2.5px',
                    clear: index % 10 === 0 ? 'both' : 'none',
                  }}
                >
                  <Dozen
                    num={dozen}
                    isEnabled={isEnabled}
                    setSelectedDozens={setSelectedDozens}
                    betNumber={betNumber}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div>
            Valor da aposta:
            <span className="ms-2">R$ 5.00</span>
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <Label htmlFor="betts" className="text-left">
          Confira suas apostas
        </Label>
        <div className="gap-1 bg-green-100 pt-5 ps-2 h-full">
          <div className="flex items-center space-x-2 mb-5">
            <Checkbox id="gameA" className="bg-white" />
            <label
              htmlFor="gameA"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              A:
            </label>
          </div>

          <div className="flex items-center space-x-2 mb-5">
            <Checkbox id="gameB" className="bg-white" />
            <label
              htmlFor="gameB"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              B:
            </label>
          </div>

          <div className="flex items-center space-x-2 mb-5">
            <Checkbox id="gameC" className="bg-white" />
            <label
              htmlFor="gameC"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              C:
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingSlip;
