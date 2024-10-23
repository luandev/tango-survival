// validationLibrary.test.js

import { validateRow, validateColumn, validateGridOnCellChange } from './validationLibrary';

// Test grid for validation
const testGrid = [
  ['circle', 'square', 'circle', null],
  ['square', 'square', 'circle', 'circle'],
  ['circle', 'circle', 'square', 'square'],
  [null, 'circle', 'square', 'circle']
];

describe('Validation Library', () => {
  test('validateRow should return true for a valid row', () => {
    expect(validateRow(testGrid, 2)).toBe(true);
  });

  test('validateRow should return false for an invalid row with more than 2 successive states', () => {
    const invalidGrid = [
      ['circle', 'circle', 'circle', 'square'],
      ...testGrid.slice(1)
    ];
    expect(validateRow(invalidGrid, 0)).toBe(false);
  });

  test('validateColumn should return true for a valid column', () => {
    expect(validateColumn(testGrid, 1)).toBe(true);
  });

  test('validateColumn should return false for an invalid column with more than 2 successive states', () => {
    const invalidGrid = [
      ...testGrid.slice(0, 1),
      ['circle', 'circle', 'circle', 'square'],
      ...testGrid.slice(2)
    ];
    expect(validateColumn(invalidGrid, 2)).toBe(false);
  });

  test('validateGridOnCellChange should return correct validation status for a valid cell change', () => {
    const result = validateGridOnCellChange(testGrid, 1, 2);
    expect(result.isRowValid).toBe(true);
    expect(result.isColumnValid).toBe(true);
  });

  test('validateGridOnCellChange should return correct validation status for an invalid cell change', () => {
    const invalidGrid = [
      ['circle', 'circle', 'circle', 'square'],
      ...testGrid.slice(1)
    ];
    const result = validateGridOnCellChange(invalidGrid, 0, 2);
    expect(result.isRowValid).toBe(false);
    expect(result.isColumnValid).toBe(true);
  });

  test('validateBalance should ensure each row has equal counts of states', () => {
    const balancedGrid = [
      ['circle', 'square', 'circle', 'square'],
      ['square', 'circle', 'square', 'circle'],
      ['circle', 'square', 'circle', 'square'],
      ['square', 'circle', 'square', 'circle']
    ];
    expect(validateRow(balancedGrid, 0)).toBe(true);
  });

  test('validateBalance should return false for an unbalanced row', () => {
    const unbalancedGrid = [
      ['circle', 'circle', 'square', 'square'],
      ...testGrid.slice(1)
    ];
    expect(validateRow(unbalancedGrid, 0)).toBe(false);
  });
});
