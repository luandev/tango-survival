Here’s an updated README for **Tango-Survival** with background on its inspiration from LinkedIn's **Tango** game.

---

# 💃 Tango-Survival
### The Rogue-like Binary Sudoku Game

Welcome to **Tango-Survival**, a logic-based puzzle game where balance and strategy are everything. Inspired by LinkedIn's **Tango**, this game offers an immersive and strategic challenge where players must fill a grid using carefully placed shapes while adhering to specific rules of balance and symmetry. Built using **Google Project IDX**, Tango-Survival provides a smooth, efficient development experience and intuitive gameplay. 🌀✨

## Play the Game

[![Play the Game](https://img.shields.io/badge/Play%20Now-Tango--Survival-blue?style=for-the-badge)](https://luandev.github.io/tango-survival/)

## Background: Inspiration from LinkedIn's Tango Game

LinkedIn recently introduced **Tango**, a daily puzzle game aimed at fostering engagement and social interaction among users. In LinkedIn’s Tango, players fill a grid with alternating symbols (like suns and moons) while following rules to ensure balance—no more than two consecutive identical symbols in any row or column, and an equal number of each symbol per line. LinkedIn designed this game to provide users with short, intellectually engaging breaks from work, tapping into logic puzzles for daily mental exercise【34†source】【35†source】【36†source】.

This inspired **Tango-Survival**, where players apply similar balance-based rules but with the added twist of **group movement** for specific cells. This strategic mechanic adds a unique layer of difficulty, requiring careful planning and precise moves to maintain balance.

## Gameplay Overview

1. **Objective**: Fill each row and column with circles and squares, adhering to rules that enforce symmetry and avoid over-clustering.
2. **Controls**: Click on cells to toggle between circles and squares. Cells within groups move together when toggled.
3. **Rules**:
   - **Limit Consecutive Shapes**: No more than two identical shapes can be adjacent in any row or column.
   - **Maintain Balance**: Each row and column must contain an equal number of circles and squares.
   - **Group Movement**: Cells in groups toggle together, adding a strategic challenge to achieve the perfect configuration.
4. **Victory Condition**: Complete the grid with all rules intact to win. ⚖️

## Engineering Details

### Development with Google Project IDX

**Project IDX** by Google was integral to the development of Tango-Survival. It provided an AI-supported development environment where code suggestions, debugging tools, and cloud-based testing accelerated our workflow. IDX enabled us to streamline development, test cross-platform compatibility, and leverage AI assistance for code quality and speed, all from a cloud-hosted, collaborative environment. For more details on Google Project IDX, visit [idx.dev](https://idx.dev).

## Features

- **Interactive Gameplay**: Strategic group movements add complexity to the challenge.
- **Dynamic Puzzles**: Each play session generates a new configuration, ensuring replayability.
- **Error Feedback**: Invalid configurations are highlighted to help players refine their moves.
- **Responsive Design**: Optimized for seamless gameplay on any device.

## Installation

Set up the game locally with:

```bash
# Clone this repository
git clone https://github.com/luandev/tango-survival.git

# Navigate to the project directory
cd tango-survival

# Install dependencies
npm install

# Run the game
npm start
```

## Technology Stack

- **React**: Handles the dynamic UI and gameplay logic.
- **CSS**: Styles the interactive grid and provides feedback for errors.
- **Jest**: Ensures that game logic is tested thoroughly.
- **Vite**: Powers efficient builds and smooth deployment.

## Contributing

We welcome contributions from developers and puzzle enthusiasts! Follow these steps to contribute:

1. **Fork the Repository**.
2. **Create a Branch**: Use a feature-based branch name.
3. **Commit and Push Your Changes**.
4. **Submit a Pull Request**.

## License

This project is licensed under the MIT License.

## Acknowledgements

Special thanks to:

- **LinkedIn’s Tango Game**: For inspiring the design and concept of Tango-Survival.
- **Google Project IDX**: For providing a powerful cloud-based development environment.
- **Community Testers**: For invaluable feedback on gameplay and usability.

---

Ready to dive into the dance of logic? [![Play the Game](https://img.shields.io/badge/Play%20Now-Tango--Survival-blue?style=for-the-badge)](https://luandev.github.io/tango-survival/)

--- 

This README now contextualizes Tango-Survival as inspired by LinkedIn's Tango while providing engineering insights into its development with Google IDX. Let me know if you need further modifications!