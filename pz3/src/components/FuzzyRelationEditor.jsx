import React, { useState, useEffect } from 'react';

const FuzzyRelationEditor = ({ rows, cols, initialData, onRelationChange }) => {
  const [relation, setRelation] = useState([]);

  // Инициализация отношения
  useEffect(() => {
    if (initialData && initialData.length === rows &&
        initialData.every(row => row.length === cols)) {
      setRelation(initialData);
    } else {
      const newRelation = Array(rows).fill().map(() =>
        Array(cols).fill().map(() => 0)
      );
      setRelation(newRelation);
    }
  }, [rows, cols, initialData]);

  // Обработчик изменения значения
  const handleValueChange = (rowIndex, colIndex, value) => {
    let numValue = parseFloat(value);
    if (isNaN(numValue)) numValue = 0;
    // Ограничиваем значение интервалом [0, 1]
    numValue = Math.max(0, Math.min(1, numValue));

    const newRelation = relation.map((row, rIdx) =>
      rIdx === rowIndex
        ? row.map((cell, cIdx) => cIdx === colIndex ? numValue : cell)
        : row
    );
    setRelation(newRelation);

    if (onRelationChange) {
      onRelationChange(newRelation);
    }
  };

  return (
    <div className="fuzzy-relation-editor">
      <table>
        <tbody>
          {relation.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {row.map((value, colIndex) => (
                <td key={`cell-${rowIndex}-${colIndex}`}>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={value}
                    onChange={(e) =>
                      handleValueChange(rowIndex, colIndex, e.target.value)
                    }
                    className="relation-cell"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

FuzzyRelationEditor.defaultProps = {
  rows: 3,
  cols: 3,
  initialData: null,
  onRelationChange: null
};

export default FuzzyRelationEditor;
