import { checkConvergence } from "./utils";

function sum(arr) {
  return arr.reduce((acc, cur) => acc + (Array.isArray(cur) ? sum(cur) : cur), 0)
}


function calculateVectorK(matrix, vectorK, y) {
  const newVectorK = Array(vectorK.length);
  for(let i = 0; i < vectorK.length; i++) {
    newVectorK[i] = 1/y * sum(matrix[i].map((val, index) => val*vectorK[index]));
    console.log(newVectorK[i]);
  }
  return newVectorK;
}

export function calculateRelativeAssessment(matrix) {
  const debug = {
    str: ""
  };
  const size = matrix.length;
  let y = sum(matrix);
  let id = 0;
  debug.str += `y = ${y}\n`;
  let prevVectorK = Array(size).fill(1);
  debug.str += `k[${id++}] = [ ${prevVectorK.join(", ")} ]\n`
  let curVectorK = calculateVectorK(matrix, prevVectorK, y);
  while(checkConvergence(prevVectorK, curVectorK, 0.01)) {
    y = sum(matrix.map((row) => row.map((cell, colInd) => cell * curVectorK[colInd])));
    prevVectorK = curVectorK;
    curVectorK = calculateVectorK(matrix, prevVectorK, y);
    debug.str += `k[${id++}] = [ ${prevVectorK.join(", ")} ]\n`
  }
  debug.str += `k[${id}] = [ ${curVectorK.join(", ")} ]\n`
  return debug.str;
}
