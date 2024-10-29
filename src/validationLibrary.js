export const isRow = (grid, rowIndex) => {
  const row = grid[rowIndex];
  return !row.some(cell => cell == undefined);
};

export const isColumn = (grid, colIndex) => {
  const column = grid.map(row => row[colIndex]);
  return !column.some(cell => cell == undefined);
};

export const validateRow = (grid, rowIndex) => {
  const row = grid[rowIndex];
  return !row.some(cell => cell == undefined) && validateSequence(row) && validateBalance(row);
};

export const validateColumn = (grid, colIndex) => {
  const column = grid.map(row => row[colIndex]);
  return !column.some(cell => cell == undefined) && validateSequence(column) && validateBalance(column);
};

// New function to validate the whole grid
export const validateWholeGrid = (grid) => {
  const size = grid.length;
  const validationResults = Array.from({ length: size }, () => Array(size).fill(undefined));

  for (let i = 0; i < size; i++) {
    if (isRow(grid, i)) {
      setRow(validationResults, i, validateRow(grid, i) ? 'valid' : 'invalid');
    }
    
    if (isColumn(grid, i)) {
      setColumn(validationResults, i, validateColumn(grid, i) ? 'valid' : 'invalid');
    }
  }
  let isGridValid = validationResults.every(row => row.every(cell => (cell === 'valid')));

  return {
    isGridValid,
    validationResults,
  };
};

// Function to set the validation status for an entire row
const setRow = (validationResults, rowIndex, status) => {
  for (let colIndex = 0; colIndex < validationResults[rowIndex].length; colIndex++) {
    if (validationResults[rowIndex][colIndex] === undefined || validationResults[rowIndex][colIndex] === status) {
      validationResults[rowIndex][colIndex] = status;
    }
    else {
      validationResults[rowIndex][colIndex] = 'cross';
    }
  }
};

// Function to set the validation status for an entire column
const setColumn = (validationResults, colIndex, status) => {
  for (let rowIndex = 0; rowIndex < validationResults.length; rowIndex++) {
    if (validationResults[rowIndex][colIndex] === undefined || validationResults[rowIndex][colIndex] === status) {
      validationResults[rowIndex][colIndex] = status;
    }
    else {
      validationResults[rowIndex][colIndex] = 'cross';
    }
  }
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
