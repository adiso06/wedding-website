import React, { useState, useEffect } from 'react';
import './MiniCrossword.css';

interface CrosswordCell {
  row: number;
  col: number;
  answer: string;
  number?: number;
  isBlack?: boolean;
}

interface Clue {
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
  startRow: number;
  startCol: number;
}

interface MiniCrosswordProps {
  clues?: Clue[];
}

const MiniCrossword: React.FC<MiniCrosswordProps> = ({ clues }) => {
  // Default puzzle (5x5) - placeholder until user provides clues
  const defaultClues: Clue[] = [
    { number: 1, clue: 'Say "I do"', answer: 'WED', direction: 'across', startRow: 0, startCol: 0 },
    { number: 4, clue: 'Commitment symbol', answer: 'RING', direction: 'across', startRow: 1, startCol: 0 },
    { number: 5, clue: 'Wedding promise', answer: 'VOWS', direction: 'across', startRow: 2, startCol: 1 },
    { number: 7, clue: 'Flower holder', answer: 'VASE', direction: 'across', startRow: 3, startCol: 1 },
    { number: 8, clue: 'First dance, e.g.', answer: 'WALTZ', direction: 'across', startRow: 4, startCol: 0 },
    { number: 1, clue: 'Wedding attendant', answer: 'WITNESS', direction: 'down', startRow: 0, startCol: 0 },
    { number: 2, clue: 'Bride\'s partner', answer: 'GROOM', direction: 'down', startRow: 0, startCol: 1 },
    { number: 3, clue: 'Reception time', answer: 'DINNER', direction: 'down', startRow: 0, startCol: 2 },
  ];

  const puzzleClues = clues || defaultClues;

  // Create grid from clues
  const createGrid = () => {
    const grid: { [key: string]: CrosswordCell } = {};
    let maxRow = 0;
    let maxCol = 0;

    puzzleClues.forEach(clue => {
      for (let i = 0; i < clue.answer.length; i++) {
        const row = clue.direction === 'across' ? clue.startRow : clue.startRow + i;
        const col = clue.direction === 'across' ? clue.startCol + i : clue.startCol;
        const key = `${row}-${col}`;

        maxRow = Math.max(maxRow, row);
        maxCol = Math.max(maxCol, col);

        if (!grid[key]) {
          grid[key] = {
            row,
            col,
            answer: clue.answer[i],
            number: i === 0 ? clue.number : undefined,
          };
        } else if (i === 0 && !grid[key].number) {
          grid[key].number = clue.number;
        }
      }
    });

    return { grid, rows: maxRow + 1, cols: maxCol + 1 };
  };

  const { grid, rows, cols } = createGrid();
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    checkCompletion();
  }, [userAnswers]);

  const checkCompletion = () => {
    const allCorrect = Object.keys(grid).every(key => {
      const cell = grid[key];
      return userAnswers[key]?.toUpperCase() === cell.answer.toUpperCase();
    });
    setIsComplete(allCorrect && Object.keys(userAnswers).length === Object.keys(grid).length);
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleInput = (row: number, col: number, value: string) => {
    const key = `${row}-${col}`;
    if (value.match(/^[a-zA-Z]$/)) {
      setUserAnswers({ ...userAnswers, [key]: value.toUpperCase() });
      // Auto-advance to next cell
      moveToNextCell(row, col);
    } else if (value === '') {
      const newAnswers = { ...userAnswers };
      delete newAnswers[key];
      setUserAnswers(newAnswers);
    }
  };

  const moveToNextCell = (row: number, col: number) => {
    // Find next cell to the right, or next row
    for (let c = col + 1; c < cols; c++) {
      if (grid[`${row}-${c}`]) {
        setSelectedCell({ row, col: c });
        return;
      }
    }
    // Move to next row
    for (let r = row + 1; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[`${r}-${c}`]) {
          setSelectedCell({ row: r, col: c });
          return;
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key === 'Backspace') {
      const key = `${row}-${col}`;
      const newAnswers = { ...userAnswers };
      delete newAnswers[key];
      setUserAnswers(newAnswers);
    }
  };

  const renderGrid = () => {
    const cellElements = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${r}-${c}`;
        const cell = grid[key];

        if (!cell) {
          cellElements.push(
            <div key={key} className="crossword-cell black-cell"></div>
          );
        } else {
          const isSelected = selectedCell?.row === r && selectedCell?.col === c;
          const isCorrect = userAnswers[key]?.toUpperCase() === cell.answer.toUpperCase();
          const hasValue = userAnswers[key];

          cellElements.push(
            <div
              key={key}
              className={`crossword-cell ${isSelected ? 'selected' : ''} ${hasValue && !isCorrect && isComplete ? 'incorrect' : ''}`}
              onClick={() => handleCellClick(r, c)}
            >
              {cell.number && <span className="cell-number">{cell.number}</span>}
              <input
                type="text"
                maxLength={1}
                value={userAnswers[key] || ''}
                onChange={(e) => handleInput(r, c, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, r, c)}
                className="cell-input"
                autoFocus={isSelected}
              />
            </div>
          );
        }
      }
    }
    return cellElements;
  };

  const acrossClues = puzzleClues.filter(c => c.direction === 'across');
  const downClues = puzzleClues.filter(c => c.direction === 'down');

  return (
    <div className="mini-crossword">
      <div className="crossword-header">
        <h3>Mini Crossword</h3>
        {isComplete && <div className="completion-message">🎉 Puzzle Complete!</div>}
      </div>

      <div className="crossword-container">
        <div className="crossword-grid" style={{ gridTemplateColumns: `repeat(${cols}, 40px)` }}>
          {renderGrid()}
        </div>

        <div className="crossword-clues">
          <div className="clues-section">
            <h4>ACROSS</h4>
            <ol className="clues-list">
              {acrossClues.map(clue => (
                <li key={`across-${clue.number}`} value={clue.number}>
                  {clue.clue}
                </li>
              ))}
            </ol>
          </div>

          <div className="clues-section">
            <h4>DOWN</h4>
            <ol className="clues-list">
              {downClues.map(clue => (
                <li key={`down-${clue.number}`} value={clue.number}>
                  {clue.clue}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCrossword;
