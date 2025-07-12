// esm-dynamic.mjs
console.log("=== ESM 동적 임포트 데모 ===");

// 사용자의 입력을 받습니다.
const userChoice = process.argv[2];
console.log(`사용자가 선택한 값: ${userChoice}`);

// ESM에서 동적으로 모듈을 로드합니다.
let utils;
if (userChoice === "math") {
  // (1) 사용자가 math를 선택한 경우
  console.log("수학 유틸리티를 동적으로 임포트 중...");
  utils = await import("./math-utils.mjs");
} else if (userChoice === "string") {
  // (2) 사용자가 string을 선택한 경우
  console.log("문자열 유틸리티를 동적으로 임포트 중...");
  utils = await import("./string-utils.mjs");
} else {
  // (3) 사용자가 값을 입력하지 않은 경우
  console.log("두 유틸리티를 모두 동적으로 임포트 중...");
  const [mathUtils, stringUtils] = await Promise.all([
    import("./math-utils.mjs"),
    import("./string-utils.mjs"),
  ]);
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

// 함수 내에서 동적으로 모듈을 로드합니다.
async function getFormatterForType(type) {
  if (type === "number") {
    return await import("./math-utils.mjs");
  } else {
    return await import("./string-utils.mjs");
  }
}

console.log("\n함수 내에서 동적 로딩:");
const formatter = await getFormatterForType("string");
console.log("포맷된 결과:", formatter.capitalize("dynamic loading"));
