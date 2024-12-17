const findMatchingNumbers = (gameNumbers, drawnNumbers) => {
  const matchingNumbers = gameNumbers.filter((item) => drawnNumbers.includes(item));
  const hits = matchingNumbers.length;
  return [matchingNumbers, hits];
};

export default findMatchingNumbers;
