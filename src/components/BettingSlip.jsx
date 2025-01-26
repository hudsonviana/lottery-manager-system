import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import useToastAlert from '@/hooks/useToastAlert';
import { FaTimes } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { RiDeleteBinLine } from 'react-icons/ri';
import { IoTrashBinOutline } from 'react-icons/io5';
import { FaRegTrashAlt } from 'react-icons/fa';

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
  const [gamesConfirmed, setGamesConfirmed] = useState(importedGameNumbers);

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
      setGamesConfirmed({
        gameA: [],
        gameB: [],
        gameC: [],
      });
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

        <div id="betts" className="gap-1 bg-green-100 p-2 h-full relative">
          <table className="w-full text-left table-auto min-w-max">
            <tbody>
              {Object.entries(gamesConfirmed).map((game) =>
                game[1].length ? (
                  <tr key={game[0]} className="hover:bg-green-300 text-sm">
                    <td className="px-1 py-2 font-bold w-5">{game[0].slice(-1)}</td>
                    <td className="">{game[1].join(' - ')}</td>
                    <td>
                      <div className="flex items-center">
                        <button id={game[0]} onClick={handleRemoveBet}>
                          <FaRegTrashAlt color="red" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>

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
