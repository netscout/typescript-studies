import { type User } from "./types";

// 여기서 User는 컴파일 타임의 타입 체크 용도로만 사용되고 있습니다.
const user: User = {
  name: "John",
  age: 30,
};

console.log(user);
