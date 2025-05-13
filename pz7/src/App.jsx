import './App.css'
import Settings from './core/Settings'
import { calculateRelativeAssessment } from './core/RelativeAssessment'
import { calculateGroupAssessment } from './core/GroupAssessment'
import MatrixCalculator from './components/MatrixCalculator'

function App() {
  const hz = () => {
    calculateRelativeAssessment(Settings.matrix);
  }
  const hz2 = () => {
    const matrix = [
      [0.3, 0.5, 0.2],
      [0.7, 0.5, 0.8],
    ]
    console.log(calculateGroupAssessment(matrix, 3));
  }
  return (
    <>
      {/* <button onClick={hz}>Test 1</button>
      <button onClick={hz2}>Test 2</button> */}
      <MatrixCalculator func={calculateRelativeAssessment} />
    </>
  )
}

export default App
