// esm-consumer.mjs
console.log("=== ESM Consumer ===");
console.log("large-utils.mjs에서 임포트 중...");

// ESM은 특정 함수만 임포트합니다
import { add } from "./large-utils.mjs";

console.log("\nadd 함수만 사용:");
console.log("결과:", add(5, 3));

console.log("\n주의: 'add' 함수만 임포트됩니다!");
console.log("다른 함수들은 이 모듈의 범위에 포함되지 않습니다.");
