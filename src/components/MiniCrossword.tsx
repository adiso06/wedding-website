import React, { useState, useEffect, useRef, useCallback } from 'react';
import './MiniCrossword.css';

interface CrosswordCell {
  row: number;
  col: number;
  answer: string;
  number?: number;
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
  const gridRef = useRef<HTMLDivElement>(null);

  // Create grid from clues
  const createGrid = useCallback(() => {
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
  }, [puzzleClues]);

  const { grid, rows, cols } = createGrid();
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    checkCompletion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAnswers]);

  const checkCompletion = () => {
    const allCorrect = Object.keys(grid).every(key => {
      const cell = grid[key];
      return userAnswers[key]?.toUpperCase() === cell.answer.toUpperCase();
    });
    setIsComplete(allCorrect && Object.keys(userAnswers).length === Object.keys(grid).length);
  };

  // Find which clues include a given cell
  const getCluesForCell = useCallback((row: number, col: number): Clue[] => {
    return puzzleClues.filter(clue => {
      if (clue.direction === 'across') {
        return clue.startRow === row && col >= clue.startCol && col < clue.startCol + clue.answer.length;
      } else {
        return clue.startCol === col && row >= clue.startRow && row < clue.startRow + clue.answer.length;
      }
    });
  }, [puzzleClues]);

  // Get all cells in the current word (for highlighting)
  const getCurrentWordCells = useCallback((): string[] => {
    if (!selectedCell) return [];
    
    const cluesAtCell = getCluesForCell(selectedCell.row, selectedCell.col);
    const currentClue = cluesAtCell.find(c => c.direction === direction);
    
    if (!currentClue) return [];
    
    const cells: string[] = [];
    for (let i = 0; i < currentClue.answer.length; i++) {
      const r = currentClue.direction === 'across' ? currentClue.startRow : currentClue.startRow + i;
      const c = currentClue.direction === 'across' ? currentClue.startCol + i : currentClue.startCol;
      cells.push(`${r}-${c}`);
    }
    return cells;
  }, [selectedCell, direction, getCluesForCell]);

  const handleCellClick = (row: number, col: number) => {
    const cluesAtCell = getCluesForCell(row, col);
    
    // If clicking the same cell, toggle direction (like NYT crossword)
    if (selectedCell?.row === row && selectedCell?.col === col) {
      if (cluesAtCell.length > 1) {
        setDirection(prev => prev === 'across' ? 'down' : 'across');
      }
    } else {
      // New cell selected
      setSelectedCell({ row, col });
      
      // Determine direction based on available clues
      const hasAcross = cluesAtCell.some(c => c.direction === 'across');
      const hasDown = cluesAtCell.some(c => c.direction === 'down');
      
      if (hasAcross && !hasDown) {
        setDirection('across');
      } else if (hasDown && !hasAcross) {
        setDirection('down');
      }
      // If both exist, keep current direction
    }
  };

  // Handle all keyboard input through onKeyDown (like the reference repo)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const key = `${row}-${col}`;
    
    // Letter input
    if (e.key.match(/^[a-zA-Z]$/)) {
      e.preventDefault();
      
      // Set the letter
      setUserAnswers(prev => ({ ...prev, [key]: e.key.toUpperCase() }));
      
      // Auto-advance in current direction
      if (direction === 'across') {
        const nextCol = col + 1;
        if (grid[`${row}-${nextCol}`]) {
          setSelectedCell({ row, col: nextCol });
        }
      } else {
        const nextRow = row + 1;
        if (grid[`${nextRow}-${col}`]) {
          setSelectedCell({ row: nextRow, col });
        }
      }
    }
    // Backspace
    else if (e.key === 'Backspace') {
      e.preventDefault();
      
      if (userAnswers[key]) {
        // Current cell has a letter - delete it
        setUserAnswers(prev => {
          const newAnswers = { ...prev };
          delete newAnswers[key];
          return newAnswers;
        });
      } else {
        // Current cell is empty - move back and delete
        if (direction === 'across') {
          const prevCol = col - 1;
          const prevKey = `${row}-${prevCol}`;
          if (grid[prevKey]) {
            setSelectedCell({ row, col: prevCol });
            setUserAnswers(prev => {
              const newAnswers = { ...prev };
              delete newAnswers[prevKey];
              return newAnswers;
            });
          }
        } else {
          const prevRow = row - 1;
          const prevKey = `${prevRow}-${col}`;
          if (grid[prevKey]) {
            setSelectedCell({ row: prevRow, col });
            setUserAnswers(prev => {
              const newAnswers = { ...prev };
              delete newAnswers[prevKey];
              return newAnswers;
            });
          }
        }
      }
    }
    // Arrow keys - matching direction moves, perpendicular switches direction
    else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (direction === 'across') {
        const nextCol = col + 1;
        if (grid[`${row}-${nextCol}`]) {
          setSelectedCell({ row, col: nextCol });
        }
      } else {
        setDirection('across');
      }
    }
    else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (direction === 'across') {
        const prevCol = col - 1;
        if (grid[`${row}-${prevCol}`]) {
          setSelectedCell({ row, col: prevCol });
        }
      } else {
        setDirection('across');
      }
    }
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (direction === 'down') {
        const nextRow = row + 1;
        if (grid[`${nextRow}-${col}`]) {
          setSelectedCell({ row: nextRow, col });
        }
      } else {
        setDirection('down');
      }
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (direction === 'down') {
        const prevRow = row - 1;
        if (grid[`${prevRow}-${col}`]) {
          setSelectedCell({ row: prevRow, col });
        }
      } else {
        setDirection('down');
      }
    }
    // Tab - move to next word
    else if (e.key === 'Tab') {
      e.preventDefault();
    }
  };

  const currentWordCells = getCurrentWordCells();

  const acrossClues = puzzleClues.filter(c => c.direction === 'across');
  const downClues = puzzleClues.filter(c => c.direction === 'down');

  return (
    <div className="mini-crossword">
      <div className="crossword-header">
        <h3>Mini Crossword</h3>
        {isComplete && (
          <div className="completion-message" role="status" aria-live="polite">
            🎉 Puzzle Complete!
          </div>
        )}
      </div>

      <div className="crossword-container" role="region" aria-label="Wedding-themed crossword puzzle">
        {/* The entire grid is one focusable element that captures all keyboard input */}
        <div 
          ref={gridRef}
          className="crossword-grid" 
          style={{ gridTemplateColumns: `repeat(${cols}, 40px)` }}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const key = `${r}-${c}`;
              const cell = grid[key];

              if (!cell) {
                return <div key={key} className="crossword-cell black-cell"></div>;
              }

              const isSelected = selectedCell?.row === r && selectedCell?.col === c;
              const isInCurrentWord = currentWordCells.includes(key);
              const isCorrect = userAnswers[key]?.toUpperCase() === cell.answer.toUpperCase();
              const hasValue = userAnswers[key];

              return (
                <div
                  key={key}
                  className={`crossword-cell ${isSelected ? 'selected' : ''} ${isInCurrentWord && !isSelected ? 'highlighted' : ''} ${hasValue && !isCorrect && isComplete ? 'incorrect' : ''}`}
                  onClick={() => {
                    handleCellClick(r, c);
                    gridRef.current?.focus();
                  }}
                >
                  {cell.number && <span className="cell-number">{cell.number}</span>}
                  <span className="cell-letter">{userAnswers[key] || ''}</span>
                </div>
              );
            })
          )}
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
