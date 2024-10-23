export const validateRow = (grid, rowIndex) => {
    const row = grid[rowIndex];
    return validateSequence(row) && validateBalance(row);
  };
  
  export const validateColumn = (grid, colIndex) => {
    const column = grid.map(row => row[colIndex]);
    return validateSequence(column) && validateBalance(column);
  };
  
  // Universal validation logic for ensuring no more than 2 successive states and equal number of states
  export const validateGridOnCellChange = (grid, rowIndex, colIndex) => {
    const isRowValid = validateRow(grid, rowIndex);
    const isColumnValid = validateColumn(grid, colIndex);
  
    return {
      isRowValid,
      isColumnValid,
    };
  };
  
  // Helper function to validate no more than 2 successive states in a row/column
  const validateSequence = (line) => {
    let count = 1;
    for (let i = 1; i < line.length; i++) {
      if (line[i] !== null && line[i] === line[i - 1]) {
        count++;
        if (count > 2) {
          return false;
        }
      } else {
        count = 1;
      }
    }
    return true;
  };
  
  // Helper function to validate that each row/column has the same number of states
  const validateBalance = (line) => {
    const counts = {};
    line.forEach(cell => {
      if (cell !== null) {
        counts[cell] = (counts[cell] || 0) + 1;
      }
    });
    const values = Object.values(counts);
    return values.every(count => count === values[0]);
  };
  