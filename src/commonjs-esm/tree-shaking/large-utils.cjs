// large-utils.js (CommonJS)
console.log("large-utils.js 로딩 중 - 모든 함수가 로드됩니다!");

// 수학 함수들
function add(a, b) {
  console.log("add 함수 호출됨");
  return a + b;
}

function subtract(a, b) {
  console.log("subtract 함수 호출됨");
  return a - b;
}

function multiply(a, b) {
  console.log("multiply 함수 호출됨");
  return a * b;
}

function divide(a, b) {
  console.log("divide 함수 호출됨");
  return a / b;
}

function power(a, b) {
  console.log("power 함수 호출됨");
  return Math.pow(a, b);
}

// 문자열 함수들
function capitalize(str) {
  console.log("capitalize 함수 호출됨");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function reverse(str) {
  console.log("reverse 함수 호출됨");
  return str.split("").reverse().join("");
}

function truncate(str, length) {
  console.log("truncate 함수 호출됨");
  return str.length > length ? str.substring(0, length) + "..." : str;
}

// 배열 함수들
function sortArray(arr) {
  console.log("sortArray 함수 호출됨");
  return [...arr].sort();
}

function filterEven(arr) {
  console.log("filterEven 함수 호출됨");
  return arr.filter((num) => num % 2 === 0);
}

function sum(arr) {
  console.log("sum 함수 호출됨");
  return arr.reduce((total, num) => total + num, 0);
}

// 복잡한 유틸리티 함수들
function complexCalculation() {
  console.log("complexCalculation 함수 호출됨");
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += Math.sqrt(i);
  }
  return result;
}

function heavyStringProcessing(str) {
  console.log("heavyStringProcessing 함수 호출됨");
  return str.repeat(10000).split("").reverse().join("");
}

// 모든 함수 내보내기
module.exports = {
  add,
  subtract,
  multiply,
  divide,
  power,
  capitalize,
  reverse,
  truncate,
  sortArray,
  filterEven,
  sum,
  complexCalculation,
  heavyStringProcessing,
};
