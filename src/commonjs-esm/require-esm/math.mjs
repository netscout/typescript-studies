// math.mjs
console.log("math.mjs 로딩 중 (ESM)");

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export const PI = 3.14159;

export default function calculate(x, y) {
  return x * y + PI;
}
