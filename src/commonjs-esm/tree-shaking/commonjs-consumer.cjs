// commonjs-consumer.js
console.log("=== CommonJS Consumer ===");
console.log("large-utils.js에서 임포트 중...");

// CommonJS는 전체 모듈을 임포트합니다
//const utils = require('./large-utils');
const utils = require("./large-utils.cjs");

console.log("\nadd 함수만 사용:");
console.log("결과:", utils.add(5, 3));

console.log("\n주의: 'add'만 사용하지만, 모든 함수가 로드됩니다!");
console.log("이는 CommonJS가 전체 모듈 네임스페이스를 로드하기 때문입니다.");
