import './App.css'
import Settings from './core/Settings'
import MatrixCalculator from './components/MatrixCalculator'
import SquareMatrixCalculator from './components/SquareMatrixCalculator'

function App() {
  return (
    <>
      <SquareMatrixCalculator def={Settings.matrix} />
      <MatrixCalculator def={Settings.matrix2} err={Settings.errorRate}/>
    </>
  )
}

export default App
