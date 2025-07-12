// large-utils.mjs (ESM)
console.log("large-utils.mjs 로딩 중");

// 수학 함수들
export function add(a, b) {
  console.log("add 함수 호출됨");
  return a + b;
}

export function subtract(a, b) {
  console.log("subtract 함수 호출됨");
  return a - b;
}

export function multiply(a, b) {
  console.log("multiply 함수 호출됨");
  return a * b;
}

export function divide(a, b) {
  console.log("divide 함수 호출됨");
  return a / b;
}

export function power(a, b) {
  console.log("power 함수 호출됨");
  return Math.pow(a, b);
}

// 문자열 함수들
export function capitalize(str) {
  console.log("capitalize 함수 호출됨");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function reverse(str) {
  console.log("reverse 함수 호출됨");
  return str.split("").reverse().join("");
}

export function truncate(str, length) {
  console.log("truncate 함수 호출됨");
  return str.length > length ? str.substring(0, length) + "..." : str;
}

// 배열 함수들
export function sortArray(arr) {
  console.log("sortArray 함수 호출됨");
  return [...arr].sort();
}

export function filterEven(arr) {
  console.log("filterEven 함수 호출됨");
  return arr.filter((num) => num % 2 === 0);
}

export function sum(arr) {
  console.log("sum 함수 호출됨");
  return arr.reduce((total, num) => total + num, 0);
}

// 복잡한 유틸리티 함수들
export function complexCalculation() {
  console.log("complexCalculation 함수 호출됨");
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += Math.sqrt(i);
  }
  return result;
}

export function heavyStringProcessing(str) {
  console.log("heavyStringProcessing 함수 호출됨");
  return str.repeat(10000).split("").reverse().join("");
}
