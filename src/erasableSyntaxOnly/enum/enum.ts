// 원래 코드
// enum Direction {
//   UP,
//   DOWN,
//   LEFT,
//   RIGHT,
// }

// const direction = Direction.UP;

// console.log(direction);

// erasableSyntaxOnly 옵션에서 사용가능한 enum
const Direction = {
  Up: "up",
  Down: "down",
  Left: "left",
  Right: "right",
} as const;

type DirectionType = (typeof Direction)[keyof typeof Direction];

const direction: DirectionType = Direction.Up;

console.log(direction);

// 좀 더 간단한 버전
// type Direction = "up" | "down" | "left" | "right";

// const direction: Direction = "up";

// console.log(direction);
