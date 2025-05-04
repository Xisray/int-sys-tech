import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Регистрируем необходимые компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MembershipChart = ({ uSet, lSet, resultData }) => {
  // Функция для парсинга интервалов (для подписей оси X)
  const parseIntervalLabel = (interval) => {
    const matches = interval.match(/\d+/g);
    return matches ? `${matches[0]}-${matches[1]}` : interval;
  };

  // Подготовка данных для графика
  const chartData = {
    labels: uSet.map(parseIntervalLabel),
    datasets: lSet.map((category, index) => ({
      label: category,
      data: uSet.map(uItem => resultData[uItem][category].percent),
      borderColor: `hsl(${index * 120}, 70%, 50%)`,
      backgroundColor: `hsla(${index * 120}, 70%, 50%, 0.2)`,
      tension: 0.3,
      pointRadius: 5,
      pointHoverRadius: 7,
      borderWidth: 2
    }))
  };

  // Настройки графика
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Функции принадлежности нечётких множеств',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const uItem = uSet[context.dataIndex];
            const category = lSet[context.datasetIndex];
            const count = resultData[uItem][category].count;
            const percent = (context.raw * 100).toFixed(1);
            return `${category}: ${percent}% (${count}/${count + context.dataset.data.reduce((sum, val, i) =>
              i === context.dataIndex ? sum : sum + resultData[uSet[i]][category].count, 0)})`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Интервалы значений',
          font: {
            size: 14
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Степень принадлежности',
          font: {
            size: 14
          }
        },
        min: 0,
        max: 1,
        ticks: {
          stepSize: 0.1,
          // callback: (value) => `${(value * 100).toFixed(0)}%`
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '20px auto' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default MembershipChart;
