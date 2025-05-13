import { checkConvergence } from "./utils";

let error = 9;

function getGroupAssessment(matrix, competenceCoef) {
  const groupAssessment = Array(matrix.length).fill(0);
  let normalFactor = 0;
  const logNormalFact = [];
  for(let i = 0; i < matrix.length; i++) {
    let temp = 0;
    const tempLogGA = [];
    const hz = [];
    for(let j = 0; j < matrix[0].length; j++) {
      groupAssessment[i] += matrix[i][j]*competenceCoef[j];
      tempLogGA.push(`${matrix[i][j].toFixed(error)} * ${competenceCoef[j].toFixed(error)}`);
      temp += matrix[i][j];
      hz.push(`${matrix[i][j].toFixed(error)}`)
    }
    console.log(`X${i} = ${tempLogGA.join(" + ")} = ${groupAssessment[i].toFixed(error)}`)
    normalFactor += groupAssessment[i] * temp;
    logNormalFact.push(`${groupAssessment[i].toFixed(error)} * (${hz.join(" + ")})`);
  }
  console.log(`lambda = ${logNormalFact.join(" + ")} = ${normalFactor.toFixed(error)}`);
  return [groupAssessment, normalFactor];
}

function getCompetenceCoef(matrix, groupAssessment, normalFactor) {
  const competenceCoef = Array(matrix[0].length).fill(0);
  let sum = 0;
  const tempLogSum = [];
  for(let j = 0; j < matrix[0].length-1; j++) {
    const tempLog = [];
    for(let i = 0; i < matrix.length; i++) {
      competenceCoef[j] += matrix[i][j]*groupAssessment[i];
      tempLog.push(`${matrix[i][j].toFixed(error)} * ${groupAssessment[i].toFixed(error)}`);
    }
    competenceCoef[j] *= 1/normalFactor;
    console.log(`K${j} = ${(1/normalFactor).toFixed(error)} * (${tempLog.join(" + ")}) = ${competenceCoef[j].toFixed(error)}`);
    tempLogSum.push(`${competenceCoef[j].toFixed(error)}`);
    sum += competenceCoef[j];
  }
  competenceCoef[matrix[0].length-1] = 1- sum;
  console.log(`K${matrix[0].length-1} = 1 - (${tempLogSum.join(" + ")}) = ${competenceCoef[matrix[0].length-1].toFixed(error)}`)
  return competenceCoef;
}


export function calculateGroupAssessment(matrix, err) {
  error = err;
  const pred = Math.pow(10, err*-1);
  const m = matrix[0].length;
  let competenceCoef = Array(m).fill(1 / m);
  console.log("Итерация 1");
  let [prevGroupAssessment, normalFactor] = getGroupAssessment(matrix, competenceCoef);
  let groupAssessment = prevGroupAssessment;
  competenceCoef = getCompetenceCoef(matrix, prevGroupAssessment, normalFactor);
  let iterations = 2;
  do {
    console.log();
    console.log(`Итерация ${iterations}`);
    [groupAssessment, normalFactor] = getGroupAssessment(matrix, competenceCoef);
    competenceCoef = getCompetenceCoef(matrix, prevGroupAssessment, normalFactor);
    if(checkConvergence(prevGroupAssessment, groupAssessment, pred))
      return [groupAssessment, iterations]; 
    iterations++;
    prevGroupAssessment = groupAssessment;
  } while(iterations <= 10000)
}
