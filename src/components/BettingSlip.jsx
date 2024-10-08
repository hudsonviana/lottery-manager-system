import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

const betValue = [
  { betNum: 6, value: 5 },
  { betNum: 7, value: 35 },
  { betNum: 8, value: 140 },
  { betNum: 9, value: 420 },
];

const showAlert = (message) => {
  return toast({
    className: 'bg-yellow-200 text-yellow-800 border-yellow-300',
    title: 'Alerta!',
    description: message,
  });
};

const getBetPryce = (betNumber) => {
  return betValue.find(({ betNum }) => betNum === betNumber)?.value || 0;
};

const betNumbers = Array.from({ length: 4 }, (_, i) => i + 6);

const dozens = Array.from({ length: 60 }, (_, i) =>
  (i + 1).toString().padStart(2, '0')
);

const selectDozen = (dozen) => (prevList) =>
  [...prevList, dozen].sort((a, b) => a - b);

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
      className={`size-7 font-medium text-sm ${
        isSelected ? 'bg-blue-950 text-white' : 'bg-white'
      }`}
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
      className={`size-7 font-medium text-sm ${
        isSelected ? 'bg-blue-950 text-white' : 'bg-white'
      }`}
    >
      {num}
    </button>
  );
};

const BettingSlip = ({ setNewGameData, action, resetAction }) => {
  const [betNumber, setBetNumber] = useState(0);
  const [selectedDozens, setSelectedDozens] = useState([]);
  const [gamesConfirmed, setGamesConfirmed] = useState({
    gameA: [],
    gameB: [],
    gameC: [],
  });

  const isEnabled = selectedDozens.length < betNumber;

  const handleBetNumberClick = (num) => {
    setBetNumber(num);
  };

  const handleInputCheck = (e) => {
    const { id, dataset } = e.target;
    console.log({ [id]: dataset.state === 'unchecked' });
    // setNewUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const calculateTotalPryce = () => {
    return Object.values(gamesConfirmed).reduce(
      (total, game) => total + getBetPryce(game.length),
      0
    );
  };

  useEffect(() => {
    setSelectedDozens([]);
  }, [betNumber]);

  useEffect(() => {
    if (!action) return;

    const handleConfirm = () => {
      const gameEntry = Object.entries(gamesConfirmed).find(
        ([_, game]) => game.length === 0
      );

      if (!gameEntry) {
        return showAlert(
          'Número máximo de apostas atingido. Não é possível cadastrar mais apostas nesse jogo.'
        );
      }

      if (selectedDozens.length !== betNumber) {
        return showAlert('Conclua sua aposta.');
      }

      const [gameKey] = gameEntry;
      const updatedGames = { ...gamesConfirmed, [gameKey]: selectedDozens };

      setGamesConfirmed(updatedGames);

      setNewGameData((prev) => ({
        ...prev,
        gameNumbers: updatedGames,
        ticketPrice: calculateTotalPryce(),
      }));

      setBetNumber(0);
    };

    const handleRemove = () => {
      console.log('Removendo apostas...');
    };

    switch (action) {
      case 'onConfirm':
        handleConfirm();
        break;
      case 'onClear':
        setBetNumber(0);
        break;
      case 'onRemove':
        handleRemove();
        break;
    }

    resetAction();
  }, [action, resetAction, gamesConfirmed, selectedDozens, setNewGameData]);

  const totalPryce = calculateTotalPryce();

  return (
    <div className="flex gap-3">
      <div className="max-w-fit">
        <Label htmlFor="bettingSlip" className="text-left">
          Volante
        </Label>
        <div className="grid bg-yellow-100 h-full p-0.5 select-none">
          <div className="mb-2">
            <h1 className="text-neutral-700 text-sm mb-1 ms-0.5">
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
            <h1 className="text-neutral-700 text-sm mb-1 ms-0.5">
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
          <div className="font-medium ms-1">
            Valor da aposta:
            <span className="ms-2">
              {getBetPryce(betNumber).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <Label htmlFor="betts" className="text-left">
          Confira suas apostas
        </Label>
        <div className="gap-1 bg-green-100 pt-5 ps-2 h-full relative">
          <div className="flex items-center space-x-2 mb-5">
            <Checkbox
              id="gameA"
              name="gameA"
              className="bg-white"
              onClick={handleInputCheck}
            />
            <label
              htmlFor="gameA"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              A:{' '}
              <span className="font-normal">
                {gamesConfirmed.gameA.join(' - ')}
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-2 mb-5">
            <Checkbox
              id="gameB"
              name="gameB"
              className="bg-white"
              onClick={handleInputCheck}
            />
            <label
              htmlFor="gameB"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              B:{' '}
              <span className="font-normal">
                {gamesConfirmed.gameB.join(' - ')}
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-2 mb-5">
            <Checkbox
              id="gameC"
              name="gameC"
              className="bg-white"
              onClick={handleInputCheck}
            />
            <label
              htmlFor="gameC"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              C:{' '}
              <span className="font-normal">
                {gamesConfirmed.gameC.join(' - ')}
              </span>
            </label>
          </div>

          <div className="ms-1.5 font-medium absolute inset-x-0 bottom-0 mb-2.5">
            Valor total da aposta:
            <span className="ms-2">
              {totalPryce.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingSlip;
