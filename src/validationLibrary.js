export const validateRow = (grid, rowIndex) => {
    const row = grid[rowIndex];
    return !row.some(cell => cell == undefined) && validateSequence(row) && validateBalance(row);
  };
  
  export const validateColumn = (grid, colIndex) => {
    const column = grid.map(row => row[colIndex]);
    return !column.some(cell => cell == undefined) && validateSequence(column) && validateBalance(column);
  };
  
  export const validateWholeGrid = (grid) => {
    const size = grid.length;
    let isGridValid = true;
    const validationResults = Array.from({ length: size }, () => Array(size).fill(undefined));
  
    for (let i = 0; i < size; i++) {
      const isRowValid = validateRow(grid, i);
      const isColumnValid = validateColumn(grid, i);
  
      for (let j = 0; j < size; j++) {
        if (!isRowValid) {
          validationResults[i][j] = 'invalid';
          isGridValid = false;
        } else if (validationResults[i][j] !== 'invalid') {
          validationResults[i][j] = 'valid';
        }
  
        if (!isColumnValid) {
          validationResults[j][i] = 'invalid';
          isGridValid = false;
        } else if (validationResults[j][i] !== 'invalid') {
          validationResults[j][i] = 'valid';
        }
      }
    }
  
    return {
      isGridValid,
      validationResults,
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
  