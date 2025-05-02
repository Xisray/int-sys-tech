import React, { useState } from 'react';
import FuzzyRelationEditor from './components/FuzzyRelationEditor';
import "./App.css";

// Функция композиции MAX-PROD
const maxProdComposition = (R, S) => {
  if (R[0].length !== S.length) {
    throw new Error('Количество столбцов первой матрицы должно совпадать с количеством строк второй матрицы');
  }

  const result = [];
  const n = R.length;    // строк в R
  const m = S[0].length; // столбцов в S
  const p = R[0].length; // общее измерение

  for (let i = 0; i < n; i++) {
    const newRow = [];
    for (let j = 0; j < m; j++) {
      let max = 0;
      for (let k = 0; k < p; k++) {
        const product = R[i][k] * S[k][j]; //max-prod
        // const product = Math.min(R[i][k],S[k][j]);
        max = Math.max(max, product);
      }
      newRow.push(max);
    }
    result.push(newRow);
  }

  return result;
};

function App() {

  const [rowsR, setRowsR] = useState(3);
  const [colsR_RowsS, setColsR_RowsS] = useState(3);
  const [colsS, setColsS] = useState(3);

  const [relationR, setRelationR] = useState(null);
  const [relationS, setRelationS] = useState(null);
  const [composition, setComposition] = useState(null);

  const presetRelationR = [
    [0.9, 0.9, 0.8, 0.4, 0.5, 0.3, 0.6, 0.2, 0.9, 0.8],
    [0.8, 0.5, 0.9, 0.3, 0.1, 0.2, 0.2, 0.2, 0.5, 0.5],
    [0.3, 0.9, 0.6, 0.5, 0.9, 0.8, 0.9, 0.8, 0.6, 0.3],
    [0.5, 0.4, 0.5, 0.5, 0.2, 0.2, 0.3, 0.3, 0.9, 0.8],
    [0.7, 0.8, 0.8, 0.2, 0.6, 0.2, 0.2, 0.3, 0.3, 0.2]
  ];

  const presetRelationS = [
    [0.9, 0.8, 0.7, 0.9, 1.0],
    [0.6, 0.4, 0.8, 0.5, 0.6],
    [0.5, 0.2, 0.3, 0.8, 0.7],
    [0.5, 0.9, 0.5, 0.8, 0.4],
    [1.0, 0.6, 0.5, 0.7, 0.4],
    [0.4, 0.5, 1.0, 0.7, 0.8],
    [0.5, 0.8, 0.9, 0.5, 0.4],
    [0.5, 0.6, 0.7, 0.6, 0.5],
    [0.8, 1.0, 0.2, 0.5, 0.6],
    [0.3, 0.5, 0.9, 0.6, 0.8]
  ];

  const fillRelations = () => {
    setRelationR(presetRelationR);
    setRelationS(presetRelationS);
    setRowsR(presetRelationR.length);
    setColsR_RowsS(presetRelationS.length);
    setColsS(presetRelationS[0].length);
  }
  const clearRelations = () => {
    setRelationR(null);
    setRelationS(null);
  }


  const calculateComposition = () => {
    if (relationR && relationS) {
      try {
        const result = maxProdComposition(relationR, relationS);
        setComposition(result);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="fuzzy-relations-app">
      <h1>Композиция нечетких отношений (MAX-PROD)</h1>
      <button onClick={fillRelations} className="fill-btn">
        Заполнить тестовыми значениями
      </button>
      <button onClick={clearRelations} className="fill-btn">
        Очистить
      </button>
      <div style={{display:'flex', flexDirection: 'column', padding: '1em'}}>
            <label>
              Кол-во строк отношения R:
              <input
                type="number"
                value={rowsR}
                onChange={(e) => setRowsR(parseInt(e.target.value) || 1)}
                min="1"
                style={{marginLeft: '1em'}}
              />
            </label>
            <label>
              Кол-во столбцов отношения R:
              <input
                type="number"
                value={colsR_RowsS}
                onChange={(e) => setColsR_RowsS(parseInt(e.target.value) || 1)}
                min="1"
                style={{marginLeft: '1em'}}
              />
            </label>
            <label>
              Кол-во столбцов отношения S:
              <input
                type="number"
                value={colsS}
                onChange={(e) => setColsS(parseInt(e.target.value) || 1)}
                min="1"
                style={{marginLeft: '1em'}}
              />
            </label>
          </div>
      <div className="relations-container">
        <div className="relation">
          <h2>Отношение R (размер {rowsR}×{colsR_RowsS})</h2>
          <FuzzyRelationEditor
            rows={rowsR}
            cols={colsR_RowsS}
            onRelationChange={setRelationR}
            initialData={relationR}
          />
        </div>

        <div className="relation">
          <h2>Отношение S (размер {colsR_RowsS}×{colsS})</h2>
          <FuzzyRelationEditor
            rows={colsR_RowsS}
            cols={colsS}
            onRelationChange={setRelationS}
            initialData={relationS}
          />
        </div>
      </div>

      <button onClick={calculateComposition} className="calculate-btn" style={{marginTop: "1em"}}>
        Вычислить композицию R∘S (MAX-PROD)
      </button>

      {composition && (
        <div className="result">
          <h2>Результат композиции R∘S (размер {rowsR}×{colsS})</h2>
          <FuzzyRelationEditor
            rows={rowsR}
            cols={colsS}
            initialData={composition}
            readOnly
          />
        </div>
      )}
    </div>
  );
}

export default App;
