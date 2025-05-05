export default {
  Sigmoid: {
    func: (x, k = 1) => 1 / (1 + Math.exp(-k * x)),
    derivative: (x, k = 1) => {
      const sig = this.func(x, k);
      return k * sig * (1 - sig);
    },
  },
};
