import React, { useState } from 'react';
import './MatrixCalculator.css';
import { calculateGroupAssessment } from '../core/GroupAssessment';

const MatrixCalculator = ({def, err}) => {
  const [rows, setRows] = useState(def.length);
  const [cols, setCols] = useState(def[0].length);
  const [error, setError] = useState(err)
  const [matrix, setMatrix] = useState(def);

  const [results, setResults] = useState(null);

  const initMatrix = (rows, cols) => {
    const newMatrix = Array(rows).fill().map(() => Array(cols).fill(0));
    setMatrix(newMatrix);
  };

  const handleColsChange = (e) => {
    const numValue = parseInt(e.target.value) || 1;
    setCols(numValue);
    initMatrix(rows, numValue);
  };

  const handleRowsChange = (e) => {
    const numValue = parseInt(e.target.value) || 1;
    setRows(numValue);
    initMatrix(numValue, cols);
  };

  const handleMatrixChange = (e, row, col) => {
    const newValue = parseFloat(e.target.value) || 0;
    const newMatrix = [...matrix];
    newMatrix[row][col] = newValue;
    setMatrix(newMatrix);
  };

  const calculateResults = () => {
    setResults(calculateGroupAssessment(matrix, error));
  };
  const setDefault = () => {
    setRows(def.length);
    setCols(def[0].length);
    console.log(err);
    setError(err);
    setMatrix(def);
  };

  return (
    <div className="matrix-container">
      <h2>Калькулятор групповых оценок</h2>
      <button onClick={setDefault}>Пресет</button>
      <div className="dimension-controls">
        <h3>Задайте размерность матрицы:</h3>
        <div className="dimension-inputs">
          <div>
            <label>Строк: </label>
            <input
              type="number"
              name="rows"
              min="1"
              onChange={handleRowsChange}
              className="dimension-input"
              value={rows}
            />
          </div>
          <div>
            <label>Столбцов: </label>
            <input
              type="number"
              name="cols"
              min="1"
              onChange={handleColsChange}
              className="dimension-input"
              value={cols}
            />
          </div>
          <div>
            <label>Ошибка: </label>
            <input
              type="number"
              name="error"
              min="1"
              onChange={(e) => setError(Number(e.target.value))}
              className="dimension-input"
              value={error}
            />
          </div>
        </div>

      </div>

      <div className="matrix-editor">
        <h3>Введите матрицу оценок:</h3>
        <div className='row center'>
          <table className="matrix-table">
            <tbody>
              {matrix.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {row.map((cell, colIndex) => (
                    <td key={`cell-${rowIndex}-${colIndex}`} className="matrix-cell">
                      <input
                        type="number"
                        step="0.01"
                        value={cell}
                        onChange={(e) => handleMatrixChange(e, rowIndex, colIndex)}
                        className="matrix-input"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={calculateResults}
        className="calculate-button"
      >
        Вычислить
      </button>

      {results && (
        <div className="results-container">
          <h3>Результаты:</h3>
          <pre>
            {results}
          </pre>
        </div>
      )}
    </div>
  );
};

export default MatrixCalculator;
