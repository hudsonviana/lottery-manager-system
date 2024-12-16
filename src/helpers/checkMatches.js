const findMatchingNumbers = (gameNumbers, drawnNumbers) => {
  return gameNumbers.filter((item) => drawnNumbers.includes(item));
};

export default findMatchingNumbers;
