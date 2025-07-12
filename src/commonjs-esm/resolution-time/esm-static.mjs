// esm-static.mjs
console.log("=== ESM 정적 해석 데모 ===");

// ESM을 임포트는 컴파일 타임에 로드할 모듈이 결정됩니다.
import { add, multiply } from "./math-utils.mjs";
import { capitalize, reverse } from "./string-utils.mjs";

console.log("모든 임포트가 컴파일 타임에 해석되었습니다!");

// 사용자의 입력을 받습니다.
const userChoice = process.argv[2];
console.log(`사용자가 선택한 값: ${userChoice}`);

// 모듈이 이미 로드되어 있으므로, 사용할 함수를 선택합니다.
if (userChoice === "math") {
  // (1) 사용자가 math를 선택한 경우
  console.log("수학 결과:", add(5, 3));
  console.log("수학 결과:", multiply(4, 7));
} else if (userChoice === "string") {
  // (2) 사용자가 string을 선택한 경우
  console.log("문자열 결과:", capitalize("hello world"));
  console.log("문자열 결과:", reverse("hello"));
} else {
  console.log("수학 결과:", add(5, 3));
  console.log("문자열 결과:", capitalize("hello world"));
}
