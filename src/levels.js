// levels.js
export const levels = [

    {
        level: 2,
        size: 4,
        gridData: Array.from({ length: 4 }, () => Array(4).fill(null)),
        groupedCells:[]
    },
    {
        level: 3,
        size: 6,
        gridData: Array.from({ length: 6 }, () => Array(6).fill(null)),
    },
    {
        level: 4,
        size: 6,
        gridData: Array.from({ length: 6 }, () => Array(6).fill(null)),
    },
    // Add more levels as needed
];
