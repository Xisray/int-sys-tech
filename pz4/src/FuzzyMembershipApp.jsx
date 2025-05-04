import React, { useState } from 'react';
import './FuzzyMembershipApp.css'


const FuzzyMembershipApp = () => {
  // Состояния приложения
  const [heightRanges, setHeightRanges] = useState(['[160,165)', '[165,170)', '[170,175)']);
  const [terms, setTerms] = useState(['Низкий', 'Средний', 'Высокий']);
  const [expertCount, setExpertCount] = useState(3);
  const [expertData, setExpertData] = useState([]);
  const [results, setResults] = useState(null);

  // Добавление нового диапазона роста
  const [newRange, setNewRange] = useState('');
  const addRange = () => {
    if (newRange.trim()) {
      setHeightRanges([...heightRanges, newRange.trim()]);
      setNewRange('');
    }
  };

  // Добавление нового терма
  const [newTerm, setNewTerm] = useState('');
  const addTerm = () => {
    if (newTerm.trim()) {
      setTerms([...terms, newTerm.trim()]);
      setNewTerm('');
    }
  };

  // Обработка изменения данных эксперта
  const handleExpertDataChange = (expertIndex, termIndex, rangeIndex, value) => {
    const newData = [...expertData];

    if (!newData[expertIndex]) newData[expertIndex] = [];
    if (!newData[expertIndex][termIndex]) newData[expertIndex][termIndex] = [];

    newData[expertIndex][termIndex][rangeIndex] = parseInt(value) || 0;
    setExpertData(newData);
  };

  // Расчет результатов
  const calculateResults = () => {
    const membershipDegrees = terms.map((term, termIndex) => {
      return heightRanges.map((range, rangeIndex) => {
        let sum = 0;
        let count = 0;

        // Суммируем оценки всех экспертов для данного терма и диапазона
        for (let expertIndex = 0; expertIndex < expertCount; expertIndex++) {
          const value = expertData[expertIndex]?.[termIndex]?.[rangeIndex];
          if (value !== undefined) {
            sum += value;
            count++;
          }
        }

        // Рассчитываем среднее значение
        return count > 0 ? (sum / count) : 0;
      });
    });

    setResults(membershipDegrees);
  };

  return (
    <div className="container" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Определение степени принадлежности роста к термам</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Диапазоны роста:</h2>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          {heightRanges.join(', ')}
        </div>
        <div>
          <input
            type="text"
            value={newRange}
            onChange={(e) => setNewRange(e.target.value)}
            placeholder="Новый диапазон, например [175,180)"
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button onClick={addRange} style={{ padding: '5px 10px' }}>Добавить диапазон</button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Лингвистические термы:</h2>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          {terms.join(', ')}
        </div>
        <div>
          <input
            type="text"
            value={newTerm}
            onChange={(e) => setNewTerm(e.target.value)}
            placeholder="Новый терм"
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button onClick={addTerm} style={{ padding: '5px 10px' }}>Добавить терм</button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Количество экспертов:
          <input
            type="number"
            min="1"
            value={expertCount}
            onChange={(e) => setExpertCount(parseInt(e.target.value) || 1)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>

      <div>
        <h2>Ввод данных экспертов:</h2>
        {Array.from({ length: expertCount }).map((_, expertIndex) => (
          <div key={expertIndex} style={{ marginBottom: '30px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
            <h3 style={{ marginTop: '0' }}>Эксперт {expertIndex + 1}</h3>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Терм \ Диапазон</th>
                  {heightRanges.map((range, rangeIndex) => (
                    <th key={rangeIndex} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{range}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {terms.map((term, termIndex) => (
                  <tr key={termIndex}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{term}</td>
                    {heightRanges.map((range, rangeIndex) => (
                      <td key={rangeIndex} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                        <select
                          value={expertData[expertIndex]?.[termIndex]?.[rangeIndex] ?? ''}
                          onChange={(e) => handleExpertDataChange(expertIndex, termIndex, rangeIndex, e.target.value)}
                          style={{ width: '100%', padding: '5px' }}
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <button
        onClick={calculateResults}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          margin: '20px 0'
        }}
      >
        Рассчитать степень принадлежности
      </button>

      {results && (
        <div style={{ marginTop: '30px' }}>
          <h2>Результаты (средние значения по экспертам):</h2>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Терм \ Диапазон</th>
                {heightRanges.map((range, rangeIndex) => (
                  <th key={rangeIndex} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{range}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {terms.map((term, termIndex) => (
                <tr key={termIndex}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{term}</td>
                  {results[termIndex].map((value, rangeIndex) => (
                    <td key={rangeIndex} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      {value.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FuzzyMembershipApp;
