/**
 * Generates a list of unique level configurations.
 * Ensures that no two levels have the same set of parameters.
 *
 * @param {number} totalLevels - The total number of levels to generate.
 * @returns {Array} - An array of generated level data.
 */
const generateLevels = (totalLevels, selectedDifficulty=0) => {
  const levels = [];

  const difficultySettings = {
    Beginner: { gridSize: 4, maxGroupSize: 4, groupCount: 2 }, 
    Easy: { gridSize: 6, maxGroupSize: 5, groupCount: 3 }, 
    Medium: { gridSize: 6, maxGroupSize: 6, groupCount: 4 }, 
    Hard: { gridSize: 8, maxGroupSize: 7, groupCount: 5 }, 
    Grandmaster: { gridSize: 10, maxGroupSize: 8, groupCount: 6 }, 
  };

  for (let i = 1; i <= totalLevels; i++) {
    let gridSize, maxGroupSize, groupCount;
    let configKey;

    const settings = difficultySettings[selectedDifficulty];

    // Apply difficulty settings with gradual increase for gridSize and groupCount
    gridSize = settings.gridSize + 2 * Math.floor((i - 1) / (totalLevels / 3)); 
    gridSize = gridSize % 2 === 0 ? gridSize : gridSize + 1; // Ensure gridSize is even
    
    maxGroupSize = settings.maxGroupSize;
    groupCount = settings.groupCount + Math.floor((i - 1) / 2); // Increment group count every 2 levels

    levels.push(generateGridWithGroups(gridSize, maxGroupSize, groupCount, i));
  }

  return levels;
};


/**
 * Generates a valid grid with neighbor-based groups.
 * @param {number} size - The size of the grid (size x size).
 * @param {number} maxGroupSize - The maximum size of a group.
 * @param {number} groupCount - The number of groups to create.
 * @returns {object} An object containing gridData, validationData, groupedCells.
 */
function generateGridWithGroups(size, maxGroupSize, groupCount, level=1) {
    // Generate a solved grid
    let solvedGrid = generateValidGridData(size);

    // Create groups with neighboring cells
    let groupedCells = createNeighborGroups(size, maxGroupSize, groupCount);

    // Create validation data as an array of empty objects
    let validationData = createEmptyValidationData(size);

    // Return the solved grid, validation data, and grouped cells
    return {
        level,
        size,
        solvedGrid,
        gridData: maskGridData(solvedGrid, groupedCells, size),
        validationData,
        groupedCells
    };
}

// Helper function to generate a valid solved grid
function generateValidGridData(size) {
    let grid = Array.from({ length: size }, () => Array(size).fill(null));

    if (fillGrid(grid, size, 0, 0)) {
        return grid;
    } else {
        throw new Error('Failed to generate a valid grid');
    }
}

// Recursive function to fill the grid
function fillGrid(grid, size, row, col) {
    if (row === size) {
        // Finished filling the grid
        return true;
    }

    let nextRow = col === size - 1 ? row + 1 : row;
    let nextCol = col === size - 1 ? 0 : col + 1;

    let shapes = ['circle', 'square'];

    // Shuffle shapes to add randomness
    shapes = shuffleArray(shapes);

    for (let shape of shapes) {
        grid[row][col] = shape;

        if (isValidPlacement(grid, size, row, col)) {
            if (fillGrid(grid, size, nextRow, nextCol)) {
                return true;
            }
        }

        grid[row][col] = null; // backtrack
    }

    return false;
}

// Function to check if the current placement is valid
function isValidPlacement(grid, size, row, col) {
    // Get current row and column
    let currentRow = grid[row];
    let currentColumn = grid.map(r => r[col]);

    // Check sequences in row and column
    if (!validateSequence(currentRow)) return false;
    if (!validateSequence(currentColumn)) return false;

    // Check balance in row and column
    if (!validateBalance(currentRow, size)) return false;
    if (!validateBalance(currentColumn, size)) return false;

    return true;
}

// Validate that no more than 2 consecutive shapes are in a line
function validateSequence(line) {
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
}

// **Updated** Validate that the line has an equal number of each shape when complete
function validateBalance(line, size) {
    let counts = {};
    line.forEach(cell => {
        if (cell !== null) {
            counts[cell] = (counts[cell] || 0) + 1;
        }
    });

    const totalShapes = Object.values(counts).reduce((a, b) => a + b, 0);

    if (totalShapes === size) {
        // Line is complete, counts must be equal
        const values = Object.values(counts);
        if (values.length !== 2 || values[0] !== values[1]) {
            return false;
        }
    } else {
        // Line is incomplete, no shape count should exceed size / 2
        for (let count of Object.values(counts)) {
            if (count > Math.floor(size / 2)) {
                return false;
            }
        }
    }
    return true;
}

// Function to create groups of neighboring cells with a minimum size of 2
function createNeighborGroups(size, maxGroupSize, groupCount) {
    const totalCells = size * size;
    const availableCells = new Set(Array.from({ length: totalCells }, (_, index) => index));
    const groupedCells = [];

    const directions = [
        { dr: -1, dc: 0 }, // Up
        { dr: 1, dc: 0 },  // Down
        { dr: 0, dc: -1 }, // Left
        { dr: 0, dc: 1 }   // Right
    ];

    // Helper function to get valid neighbors
    function getNeighbors(cellIndex) {
        const neighbors = [];
        const row = Math.floor(cellIndex / size);
        const col = cellIndex % size;

        for (let { dr, dc } of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                const neighborIndex = newRow * size + newCol;
                if (availableCells.has(neighborIndex)) {
                    neighbors.push(neighborIndex);
                }
            }
        }

        return neighbors;
    }

    const allCellIndices = Array.from(availableCells);
    shuffleArray(allCellIndices); // Randomize starting points

    for (let i = 0; i < groupCount; i++) {
        if (availableCells.size < 2) break; // Not enough cells to form a group

        const groupSize = Math.min(
            maxGroupSize,
            availableCells.size,
            getRandomInt(2, maxGroupSize)
        );
        const group = [];

        // Start from a random available cell
        let startIndex;
        for (let index of allCellIndices) {
            if (availableCells.has(index)) {
                startIndex = index;
                break;
            }
        }

        if (startIndex === undefined) break; // No available cells left

        group.push(startIndex);
        availableCells.delete(startIndex);

        let frontier = getNeighbors(startIndex);

        while (group.length < groupSize && frontier.length > 0) {
            // Choose a random neighbor
            const neighborIndex = frontier.splice(Math.floor(Math.random() * frontier.length), 1)[0];

            if (availableCells.has(neighborIndex)) {
                group.push(neighborIndex);
                availableCells.delete(neighborIndex);

                // Add new neighbors to frontier
                const newNeighbors = getNeighbors(neighborIndex);
                for (let n of newNeighbors) {
                    if (!frontier.includes(n) && availableCells.has(n)) {
                        frontier.push(n);
                    }
                }
            }
        }

        // Ensure group has at least 2 cells
        if (group.length >= 2) {
            groupedCells.push(group);
        } else {
            // If group size is less than 2, return cells to availableCells
            availableCells.add(group[0]);
        }
    }

    return groupedCells;
}

// Helper function to get a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create validation data as an array of empty objects
function createEmptyValidationData(size) {
    return Array.from({ length: size }, () => Array(size).fill({}));
}

// Function to shuffle an array
function shuffleArray(array) {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Masks the solved grid, revealing only the grouped cells.
 * @param {string[][]} solvedGrid - The fully solved grid data.
 * @param {number[][]} groupedCells - Array of groups with cell indices.
 * @param {number} size - The size of the grid (size x size).
 * @returns {(string | null)[][]} The masked grid with only grouped cells revealed.
 */
function maskGridData(solvedGrid, groupedCells, size) {
    const maskedGrid = solvedGrid.map(row => row.map(() => null));

  // Iterate through the grouped cells and reveal them on the masked grid
  groupedCells.forEach(group => {
    group.forEach(cellIndex => {
      const row = Math.floor(cellIndex / size);
      const col = cellIndex % size;
      maskedGrid[row][col] = solvedGrid[row][col]; // Copy state from solvedGrid
    });
  });


  const groupsToToggle = getRandomGroupsToToggle(groupedCells);

  groupsToToggle.forEach(groupIndex => {
    const group = groupedCells[groupIndex];
    group.forEach(cellIndex => {
      const row = Math.floor(cellIndex / size);
      const col = cellIndex % size;

      maskedGrid[row][col] = toggleCellState(maskedGrid[row][col]); 
    });
  });

  return maskedGrid;
}

function getRandomGroupsToToggle(groupedCells) {
  const numGroupsToToggle = Math.floor(Math.random() * groupedCells.length);
  const groupsToToggle = [];

  for (let i = 0; i < numGroupsToToggle; i++) {
    let randomGroupIndex;
    do {
      randomGroupIndex = Math.floor(Math.random() * groupedCells.length);
    } while (groupsToToggle.includes(randomGroupIndex));

    groupsToToggle.push(randomGroupIndex);
  }

  return groupsToToggle;
}

function toggleCellState(cellValue) {
  return cellValue === 'circle' ? 'square' : 'circle';
}


export { generateLevels };