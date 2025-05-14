import { checkConvergence } from "./utils";

let error = 9;

function getGroupAssessment(matrix, competenceCoef, debug) {
  const groupAssessment = Array(matrix.length).fill(0);
  let normalFactor = 0;
  const logNormalFact = [];
  for (let i = 0; i < matrix.length; i++) {
    let temp = 0;
    const tempLogGA = [];
    const hz = [];
    for (let j = 0; j < matrix[0].length; j++) {
      groupAssessment[i] += matrix[i][j] * competenceCoef[j];
      tempLogGA.push(`${matrix[i][j].toFixed(error)} * ${competenceCoef[j].toFixed(error)}`);
      temp += matrix[i][j];
      hz.push(`${matrix[i][j].toFixed(error)}`);
    }
    debug.str += `X${i} = ${tempLogGA.join(" + ")} = ${groupAssessment[i].toFixed(error)}\n`;
    normalFactor += groupAssessment[i] * temp;
    logNormalFact.push(`${groupAssessment[i].toFixed(error)} * (${hz.join(" + ")})`);
  }
  debug.str += `lambda = ${logNormalFact.join(" + ")} = ${normalFactor.toFixed(error)}\n`;
  return [groupAssessment, normalFactor];
}

function getCompetenceCoef(matrix, groupAssessment, normalFactor, debug) {
  const competenceCoef = Array(matrix[0].length).fill(0);
  let sum = 0;
  const tempLogSum = [];
  for (let j = 0; j < matrix[0].length - 1; j++) {
    const tempLog = [];
    for (let i = 0; i < matrix.length; i++) {
      competenceCoef[j] += matrix[i][j] * groupAssessment[i];
      tempLog.push(`${matrix[i][j].toFixed(error)} * ${groupAssessment[i].toFixed(error)}`);
    }
    competenceCoef[j] *= 1 / normalFactor;
    debug.str += `K${j} = ${(1 / normalFactor).toFixed(error)} * (${tempLog.join(" + ")}) = ${competenceCoef[j].toFixed(error)}\n`;
    tempLogSum.push(`${competenceCoef[j].toFixed(error)}`);
    sum += competenceCoef[j];
  }
  competenceCoef[matrix[0].length - 1] = 1 - sum;
  debug.str += `K${matrix[0].length - 1} = 1 - (${tempLogSum.join(" + ")}) = ${competenceCoef[matrix[0].length - 1].toFixed(error)}\n`;
  return competenceCoef;
}

export function calculateGroupAssessment(matrix, err) {
  const debug = {
    str: "",
  };
  error = err;
  const pred = Math.pow(10, err * -1);
  const m = matrix[0].length;
  let competenceCoef = Array(m).fill(1 / m);
  debug.str += "Итерация 1\n";
  let [prevGroupAssessment, normalFactor] = getGroupAssessment(matrix, competenceCoef, debug);
  let groupAssessment = prevGroupAssessment;
  competenceCoef = getCompetenceCoef(matrix, prevGroupAssessment, normalFactor, debug);
  let iterations = 2;
  do {
    debug.str += "\n";
    debug.str += `Итерация ${iterations}\n`;
    [groupAssessment, normalFactor] = getGroupAssessment(matrix, competenceCoef, debug);
    competenceCoef = getCompetenceCoef(matrix, prevGroupAssessment, normalFactor, debug);
    if (checkConvergence(prevGroupAssessment, groupAssessment, pred)) break;
    iterations++;
    prevGroupAssessment = groupAssessment;
  } while (iterations <= 10000);
  // return [groupAssessment, iterations];
  return debug.str;
}
