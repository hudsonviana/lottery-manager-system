import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import useToastAlert from '@/hooks/useToastAlert';

const gamesConfirmedInitialState = {
  gameA: [],
  gameB: [],
  gameC: [],
};

const betValue = [
  { betNum: 6, value: 5 },
  { betNum: 7, value: 35 },
  { betNum: 8, value: 140 },
  { betNum: 9, value: 420 },
];

const getBetPryce = (betNumber) => {
  return betValue.find(({ betNum }) => betNum === betNumber)?.value || 0;
};

const calculateTotalPryce = (gamesConfirmed) => {
  return Object.values(gamesConfirmed).reduce(
    (total, game) => total + getBetPryce(game.length),
    0
  );
};

const betNumbers = Array.from({ length: 4 }, (_, i) => i + 6);

const dozens = Array.from({ length: 60 }, (_, i) => (i + 1).toString().padStart(2, '0'));

const selectDozen = (dozen) => (prevList) => [...prevList, dozen].sort((a, b) => a - b);

const removeDozen = (dozen) => (prevList) => prevList.filter((value) => value !== dozen);

// Dozen Button
const Dozen = ({ num, isEnabled, setSelectedDozens, betNumber }) => {
  const { toastAlert } = useToastAlert();
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    setIsSelected(false);
  }, [betNumber]);

  const handleDozenClick = () => {
    if (betNumber === 0) {
      return toastAlert({
        type: 'warning',
        title: 'Alerta!',
        message:
          'Antes de marcar os números, selecione a quantidade de números da aposta.',
      });
    }

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

const BettingSlip = ({ setNewGameData, importedGameNumbers, action, resetAction }) => {
  const { toastAlert, dismiss } = useToastAlert();
  const [betNumber, setBetNumber] = useState(0);
  const [selectedDozens, setSelectedDozens] = useState([]);
  const [gamesConfirmed, setGamesConfirmed] = useState(gamesConfirmedInitialState);

  const isEnabled = selectedDozens.length < betNumber;

  const handleBetNumberClick = (num) => {
    dismiss();
    setBetNumber(num);
    setSelectedDozens([]);
  };

  const handleRemoveBet = (e) => {
    const { id } = e.target.closest('button');

    const updatedGames = { ...gamesConfirmed };

    const gameKeys = Object.keys(updatedGames);
    const targetIndex = gameKeys.indexOf(id);

    if (targetIndex !== -1) {
      updatedGames[id] = [];

      for (let i = targetIndex + 1; i < gameKeys.length; i++) {
        const currentGame = gameKeys[i];
        const previousGame = gameKeys[i - 1];
        updatedGames[previousGame] = [...updatedGames[currentGame]];
        updatedGames[currentGame] = [];
      }

      setGamesConfirmed(updatedGames);

      const gameNumbersUpdated = Object.values(updatedGames).every(
        (arr) => arr.length === 0
      )
        ? ''
        : updatedGames;

      setNewGameData((prev) => ({
        ...prev,
        gameNumbers: gameNumbersUpdated,
        ticketPrice: calculateTotalPryce(updatedGames),
      }));
    }
  };

  useEffect(() => {
    if (!action) return;

    const handleConfirm = () => {
      const gameEntry = Object.entries(gamesConfirmed).find(
        ([_, game]) => game.length === 0
      );

      dismiss();

      if (!gameEntry) {
        return toastAlert({
          type: 'warning',
          title: 'Alerta!',
          message: 'Não é possível fazer mais de 3 apostas por jogo.',
        });
      }

      if (selectedDozens.length !== betNumber) {
        return toastAlert({
          type: 'warning',
          title: 'Alerta!',
          message:
            'Conclua a aposta marcando exatamente a quantidade de números selecionada.',
        });
      }

      if (!betNumber) {
        return toastAlert({
          type: 'warning',
          title: 'Alerta!',
          message: 'Antes de confirmar, faça uma aposta.',
        });
      }

      const [gameKey] = gameEntry;
      const updatedGames = { ...gamesConfirmed, [gameKey]: selectedDozens };

      setGamesConfirmed(updatedGames);

      setNewGameData((prev) => ({
        ...prev,
        gameNumbers: updatedGames,
        ticketPrice: prev.ticketPrice + getBetPryce(betNumber),
      }));

      setBetNumber(0);
    };

    const handleExclude = () => {
      setGamesConfirmed(gamesConfirmedInitialState);
      setNewGameData((prev) => ({
        ...prev,
        gameNumbers: '',
        ticketPrice: 0,
      }));
    };

    switch (action) {
      case 'onConfirm':
        handleConfirm();
        break;
      case 'onClear':
        setBetNumber(0);
        break;
      case 'onExclude':
        handleExclude();
        break;
    }

    resetAction();
  }, [action, resetAction, gamesConfirmed, selectedDozens, setNewGameData]);

  useEffect(() => {
    if (importedGameNumbers) setGamesConfirmed(importedGameNumbers);
  }, [importedGameNumbers]);

  const totalPryce = calculateTotalPryce(gamesConfirmed);

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
                <li key={num} className="float-left" style={{ margin: '2.5px' }}>
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
              Marque os números para sua aposta:
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

        <div id="betts" className="gap-1 bg-green-100 pt-5 ps-2 h-full relative">
          {Object.entries(gamesConfirmed).map((game, i) => (
            <div key={i} className="flex items-center space-x-1 mb-5">
              {game[1].length ? (
                <>
                  <button id={game[0]} onClick={handleRemoveBet}>
                    <FaTimes size={16} color="red" />
                  </button>
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {game[0].slice(-1)}:{' '}
                    <span className="font-normal">{game[1].join(' - ')}</span>
                  </span>
                </>
              ) : null}
            </div>
          ))}

          <div className="ms-1.5 font-medium absolute inset-x-0 bottom-0 mb-2.5">
            Valor total das apostas:
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
