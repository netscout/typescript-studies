// commonjs-runtime.js
console.log("=== CommonJS 런타임 해석 데모 ===");

// 사용자의 입력을 받습니다.
const userChoice = process.argv[2];
console.log(`사용자가 선택한 값: ${userChoice}`);

// 런타임에 로드할 모듈을 결정 - 사용자의 입력에 따라 어떤 모듈을 로드할지 결정합니다.
let utils;
if (userChoice === "math") {
  // (1) 사용자가 math를 선택한 경우
  console.log("런타임에 수학 유틸리티 로딩 중...");
  utils = require("./math-utils.cjs");
} else if (userChoice === "string") {
  // (2) 사용자가 string을 선택한 경우
  console.log("런타임에 문자열 유틸리티 로딩 중...");
  utils = require("./string-utils.cjs");
} else {
  // (3) 사용자가 값을 입력하지 않은 경우
  console.log("런타임에 두 유틸리티 모두 로딩 중...");
  const mathUtils = require("./math-utils.cjs");
  const stringUtils = require("./string-utils.cjs");
  utils = { ...mathUtils, ...stringUtils };
}

// 런타임에 동적으로 로드된 모듈을 사용합니다.
if (userChoice === "math") {
  // (1) 사용자가 math를 선택한 경우
  console.log("수학 결과:", utils.add(5, 3));
} else if (userChoice === "string") {
  // (2) 사용자가 string을 선택한 경우
  console.log("문자열 결과:", utils.capitalize("hello world"));
} else {
  // (3) 사용자가 값을 입력하지 않은 경우
  console.log("수학 결과:", utils.add(5, 3));
  console.log("문자열 결과:", utils.capitalize("hello world"));
}

// 또 다른 예시: 함수 내에서 조건부 require를 사용합니다.
function getFormatterForType(type) {
  if (type === "number") {
    return require("./math-utils.cjs");
  } else {
    return require("./string-utils.cjs");
  }
}

console.log("\n함수 내에서 동적 로딩:");
const formatter = getFormatterForType("string");
console.log("포맷된 결과:", formatter.capitalize("dynamic loading"));
