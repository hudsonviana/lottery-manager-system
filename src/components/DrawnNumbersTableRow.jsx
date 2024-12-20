const DrawnNumbersTableRow = ({ drawnNumbers }) => {
  return (
    <div className="py-0">
      <span>{drawnNumbers.join(' - ')}</span>
    </div>
  );
};

export default DrawnNumbersTableRow;
