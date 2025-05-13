export function checkConvergence(prevVec, curVec, error) {
  return Math.max(...prevVec.map((val, i) => Math.abs(val - curVec[i]))) >= error;
}
