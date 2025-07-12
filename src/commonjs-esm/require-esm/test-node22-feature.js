// test-node22-feature.js
console.log("=== Node.js 22 require(ESM) 기능 테스트 ===");
console.log("Node.js 버전:", process.version);

// 기능이 사용 가능한지 확인
if (process.features && process.features.require_module) {
  console.log("✅ require(ESM) 기능이 사용 가능합니다");
} else {
  console.log("❌ require(ESM) 기능이 사용 불가능합니다");
  console.log("다음과 같은 이유일 수 있습니다:");
  console.log("1. Node.js 22+ 버전을 사용하지 않는 경우");
  console.log("2. --experimental-require-module 플래그를 활성화해야 하는 경우");
}

console.log("\n" + "=".repeat(50));

// 테스트 1: 일반 CommonJS require
console.log("\n테스트 1: 일반 CommonJS 모듈");
try {
  const regularModule = require("./math.mjs");
  console.log("✅ ESM 모듈 require 성공");
  console.log("결과 타입:", typeof regularModule);
  console.log("사용 가능한 익스포트:", Object.keys(regularModule));
} catch (error) {
  console.log("❌ ESM 모듈 require 실패");
  console.log("오류:", error.code || error.message);
}

console.log("\n" + "=".repeat(50));

// 테스트 2: 최상위 await가 있는 ESM
console.log("\n테스트 2: 최상위 await가 있는 ESM");
try {
  const asyncModule = require("./async-math.mjs");
  console.log("✅ 이것은 작동하지 않아야 합니다!");
} catch (error) {
  console.log(
    "❌ 예상된 실패 - 최상위 await가 있는 ESM은 require할 수 없습니다"
  );
  console.log("오류:", error.code || error.message);
}

console.log("\n" + "=".repeat(50));

// 테스트 3: ESM import
console.log("\n테스트 3: 최상위 await가 있는 ESM import");
(async () => {
  try {
    const asyncModule = await import("./async-math.mjs");
    console.log("✅ ESM 모듈 import 성공");
    console.log("결과 타입:", typeof asyncModule);
    console.log("사용 가능한 익스포트:", Object.keys(asyncModule));
  } catch (error) {
    console.log("❌ 비동기 import로 ESM import 실패");
    console.log("오류:", error.code || error.message);
  }
})();
