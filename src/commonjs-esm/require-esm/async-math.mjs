// async-math.mjs
console.log("async-math.mjs 로딩 중 (최상위 await가 있는 ESM)");

// 이 최상위 await는 require()가 작동하지 않게 합니다
const config = await Promise.resolve({ multiplier: 2 });

export function calculate(x, y) {
  return x * y * config.multiplier;
}

export const version = "1.0.0";
