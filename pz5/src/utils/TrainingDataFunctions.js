export default {
  "OR": (A,B) => A || B ? 1 : 0,
  "AND": (A,B) => A && B ? 1 : 0,
  "Implication": (A, B) => !A || B ? 1 : 0,
}
