# TypeScript: 인덱스 시그니처와 인덱스 액세스 타입

## 목차 (Table of Contents)

1. [개요](#개요)
2. [용어 정리](#용어-정리)
3. [인덱스 시그니처 (Index Signatures)](#인덱스-시그니처-index-signatures)
   - [기본 개념과 문법](#기본-개념과-문법)
   - [실제 사용 예시](#실제-사용-예시)
   - [제약사항과 주의점](#제약사항과-주의점)
4. [인덱스 액세스 타입 (Index Access Types)](#인덱스-액세스-타입-index-access-types)
   - [기본 문법과 사용법](#기본-문법과-사용법)
   - [typeof와 keyof 연산자](#typeof와-keyof-연산자)
   - [배열과 튜플에서의 사용](#배열과-튜플에서의-사용)
5. [다양한 활용 방법](#다양한-활용-방법)
   - [API 응답 타입에서 특정 데이터 추출](#api-응답-타입에서-특정-데이터-추출)
   - [설정 객체에서 특정 설정 타입 추출](#설정-객체에서-특정-설정-타입-추출)
   - [함수 파라미터와 반환 타입 추출](#함수-파라미터와-반환-타입-추출)
   - [조건부 타입과의 활용](#조건부-타입과의-활용)
6. [권장 사항](#권장-사항)
   - [명시적 인터페이스 vs 인덱스 시그니처](#명시적-인터페이스-vs-인덱스-시그니처)
7. [요약](#요약)
8. [참고 자료](#참고-자료)

---

## 개요

[이전에 작성했던 글](../erasableSyntaxOnly/README.md)에서 enum 타입 대신에 사용할 수 있는 방법 중 이런 코드가 있었습니다.

```ts
const Direction = {
  Up: "up",
  Down: "down",
  Left: "left",
  Right: "right",
} as const;

// 바로 여기가 인덱스 액세스 타입입니다!
type DirectionType = (typeof Direction)[keyof typeof Direction];
```

저는 이 코드를 처음 봤을 때 `이게 뭐지?` 싶었습니다. 좀 찾아본 뒤에 이해한대로 해석을 적긴했지만 완전히 이해되진 않았었습니다. 그래서 이 글은 제가 이해하고 싶어서 정리해본 내용을 적었는데요. TypeScript의 `인덱스 시그니처(Index Signatures)`와 `인덱스 액세스 타입(Index Access Types)`에 대해서 좀 더 자세히 알아보겠습니다.

## 용어 정리

글을 쓰면서 저도 용어가 좀 헷갈리기 시작했습니다. 우선 혼동을 방지하기 위해 먼저 핵심 용어들을 정리하겠습니다:

| 한국어             | 문법                 | 용도                              |
| ------------------ | -------------------- | --------------------------------- |
| 인덱스 시그니처    | `[key: string]: any` | 동적 키를 가진 객체의 타입 정의   |
| 인덱스 액세스 타입 | `Type[Key]`          | 기존 타입에서 특정 속성 타입 추출 |
| typeof 연산자      | `typeof value`       | 값의 타입을 추론                  |
| keyof 연산자       | `keyof Type`         | 타입의 모든 키를 유니온으로 추출  |

---

## 인덱스 시그니처 (Index Signatures)

### 기본 개념과 문법

인덱스 시그니처는 **객체의 키가 미리 정해지지 않았지만, 키와 값의 타입을 알고 있을 때** 사용하는 타입 정의 방법입니다.

```ts
// 기본 문법
interface Dictionary {
  [key: string]: any;
}

// 실제 사용 예시
const dict: Dictionary = {
  john: { name: "John", age: 30, isStudent: true },
  jane: { name: "Jane", age: 25, isStudent: false },
};

console.log(dict.john); // { name: "John", age: 30, isStudent: true }
console.log(dict.jane); // { name: "Jane", age: 25, isStudent: false }
```

다음과 같이 더 구체적인 타입을 지정할 수도 있습니다:

```ts
interface PersonDict {
  [key: string]: {
    name: string;
    age: number;
    isStudent: boolean;
  };
}

const people: PersonDict = {
  john: { name: "John", age: 30, isStudent: true },
  jane: { name: "Jane", age: 25, isStudent: false },
};
```

### 실제 사용 예시

인덱스 시그니처는 다음과 같은 경우에 유용하게 사용할 수 있습니다.

**API 응답 데이터 처리:**

예를 들어 API 응답 데이터가 여러 사용자의 데이터를 객체로 반환하는 경우, 각 사용자 속성의 타입을 인덱스 시그니처로 정의할 수 있습니다.

```ts
interface ApiResponseData {
  [userId: string]: {
    name: string;
    email: string;
    lastLogin: Date;
  };
}

const userData: ApiResponseData = {
  user_123: {
    name: "Alice",
    email: "alice@example.com",
    lastLogin: new Date(),
  },
  user_456: { name: "Bob", email: "bob@example.com", lastLogin: new Date() },
};
```

**설정 객체:**

설정 값이 너무 많아서 일일이 타입으로 선언하기 어려운 경우, 대략적으로 허용되는 값들을 인덱스 시그니처로 정의할 수 있습니다.

```ts
interface AppConfig {
  [feature: string]: boolean | string | number;
  theme: "light" | "dark"; // 명시적 속성도 함께 사용 가능
  version: string;
}

const config: AppConfig = {
  theme: "dark",
  version: "1.0.0",
  enableNotifications: true,
  maxRetries: 3,
  apiEndpoint: "https://api.example.com",
};
```

### 제약사항과 주의점

**1. Record 타입 사용 권장:**

객체의 타입을 정의할 때는 인덱스 시그니처 보다 Record 타입을 사용하는 것이 더 간결하고 명확합니다.

```ts
// 인덱스 시그니처 대신 Record 타입 사용
interface Person {
  name: string;
  age: number;
  isStudent: boolean;
}

// 이렇게 하는 것이 더 명확합니다
const people: Record<string, Person> = {
  john: { name: "John", age: 30, isStudent: true },
  jane: { name: "Jane", age: 25, isStudent: false },
};
```

**2. 타입 안전성 한계:**

런타임에 실제로 존재하지 않는 속성도 컴파일 타입에는 오류 없이 접근할 수 있습니다.

```ts
interface FlexibleObject {
  [key: string]: string | number;
}

const obj: FlexibleObject = { name: "Alice", age: 30 };

// 컴파일 타임에는 에러가 없지만 런타임에 undefined일 수 있음
console.log(obj.nonExistentKey); // undefined (타입상으로는 string | number)
```

---

## 인덱스 액세스 타입 (Index Access Types)

### 기본 문법과 사용법

인덱스 액세스 타입은 **기존 타입에서 특정 속성의 타입을 추출**할 때 사용합니다.

```ts
interface Car {
  make: string;
  model: string;
  year: number;
  color: {
    red: string;
    green: string;
    blue: string;
  };
}

// 기본 사용법
type CarMake = Car["make"]; // string
type CarColor = Car["color"]; // { red: string; green: string; blue: string; }
type CarRedValue = Car["color"]["red"]; // string

// 여러 속성을 한번에 유니온으로 추출
type CarBasicInfo = Car["make" | "model"]; // string | string = string
type CarMixedInfo = Car["make" | "year"]; // string | number
```

### typeof와 keyof 연산자

이제 처음에 보여드렸던 복잡한 코드를 단계별로 분석해보겠습니다:

```ts
const Direction = {
  Up: "up",
  Down: "down",
  Left: "left",
  Right: "right",
} as const;

type DirectionType = (typeof Direction)[keyof typeof Direction];
```

위 코드를 이해하기 위해 IDE의 도움을 받으면서 하나씩 분석해보겠습니다.

**1단계: typeof 연산자**

`typeof` 연산자는 객체 등의 값의 타입을 추론해서 반환합니다.

```ts
type DirectionObject = typeof Direction;
// 결과: {
//   readonly Up: "up";
//   readonly Down: "down";
//   readonly Left: "left";
//   readonly Right: "right";
// }
```

Direction이 const로 선언되었으므로, 각 속성이 readonly로 나타나고 있습니다.

**2단계: keyof 연산자**

`keyof` 연산자는 타입의 모든 키를 유니온으로 추출합니다.

```ts
type DirectionKeys = keyof typeof Direction;
// 결과: "Up" | "Down" | "Left" | "Right"
```

**3단계: 인덱스 액세스 타입으로 값 추출**

이제 인덱스 엑세스 타입으로 각 속성의 타입을 추출해보겠습니다.

```ts
type DirectionTypeUp = (typeof Direction)["Up"]; // "up"
type DirectionTypeX = (typeof Direction)["Left" | "Right"]; // "left" | "right"
type DirectionTypeAll = (typeof Direction)["Up" | "Down" | "Left" | "Right"]; // "up" | "down" | "left" | "right"
```

특정 속성만을 지정할 수도 있고, 유니온 타입으로 여러 속성을 지정할 수도 있습니다. 마지막의 `DirectionTypeAll`은 모든 속성을 유니온 타입으로 지정한 것인데요, 직관적이긴 하지만 속성 개수가 많아지면 이렇게 작성하긴 어려울 겁니다.

여기서 `keyof` 연산자를 사용해서 타입의 모든 속성을 유니온 타입으로 추출할 수 있습니다.

```ts
type AllKeys = keyof typeof Direction; // "Up" | "Down" | "Left" | "Right"
type DirectionTypeAll = (typeof Direction)[AllKeys]; // "up" | "down" | "left" | "right"
```

위 코드를 좀 더 단순화 하면 다음과 같습니다.

```ts
type DirectionType = (typeof Direction)[keyof typeof Direction]; // "up" | "down" | "left" | "right"
```

### 배열과 튜플에서의 사용

객체 뿐만 아니라 배열과 튜플같이 인덱스로 요소를 접근하는 타입에서도 인덱스 액세스 타입을 사용할 수 있습니다.

**배열에서의 인덱스 액세스:**

```ts
const arr = [
  { name: "John", age: 30, isStudent: true },
  { name: "Jane", age: 25 },
];

/**
 * ({
 *  name: string;
 *  age: number;
 *  isStudent: boolean;
 * } | {
 *  name: string;
 *  age: number;
 *  isStudent?: boolean;
 * })[]
 */
type PersonArray = typeof arr; // 배열 타입
/**
 * {
 *  name: string;
 *  age: number;
 *  isStudent: boolean;
 * } | {
 *  name: string;
 *  age: number;
 *  isStudent?: boolean;
 * }
 */
type Person = (typeof arr)[0]; // 배열 타입의 첫 번째 요소 타입
/**
 * {
 *  name: string;
 *  age: number;
 *  isStudent?: boolean;
 * } | {
 *  name: string;
 *  age: number;
 *  isStudent?: boolean;
 * }
 */
type Person2 = (typeof arr)[1]; // 배열 타입의 두 번째 요소 타입
/**
 * {
 *  name: string;
 *  age: number;
 *  isStudent: boolean;
 * } | {
 *  name: string;
 *  age: number;
 *  isStudent?: boolean;
 * }
 */
type PersonAll = (typeof arr)[number]; // 배열 타입의 모든 요소 타입
```

흥미로운 점은 배열 타입은 모든 요소의 타입이 동일하다는 점입니다. 그래서 특정 인덱스의 요소 타입을 사용하든, 모든 요소의 타입을 사용하든 상관없이 타입이 동일합니다.

**튜플에서의 인덱스 액세스:**

```ts
const tuple = [1, "hello", true] as const;

type FirstElement = (typeof tuple)[0]; // 1
type SecondElement = (typeof tuple)[1]; // "hello"
type ThirdElement = (typeof tuple)[2]; // true
type AllElements = (typeof tuple)[number]; // 1 | "hello" | true
```

튜플은 배열과 다르게 각 인덱스마다 서로 다른 타입을 가질 수 있습니다!

**배열 vs 튜플 비교:**

```ts
// 배열: 모든 인덱스에서 동일한 타입
const numbers: number[] = [1, 2, 3];
type NumberArrayElement = (typeof numbers)[0]; // number
type NumberArrayAny = (typeof numbers)[number]; // number

// 튜플: 각 인덱스마다 다른 타입
const mixedTuple: [string, number, boolean] = ["hello", 42, true];
type TupleFirst = (typeof mixedTuple)[0]; // string
type TupleSecond = (typeof mixedTuple)[1]; // number
type TupleUnion = (typeof mixedTuple)[number]; // string | number | boolean
```

---

## 다양한 활용 방법

이제 실제로 인덱스 엑세스 타입을 사용하는 예시를 살펴보겠습니다.

### API 응답 타입에서 특정 데이터 추출

API 응답 타입에서 특정 데이터를 추출하는 경우 인덱스 엑세스 타입을 사용할 수 있습니다.

```ts
interface ApiResponse {
  users: Array<{
    id: string;
    name: string;
    email: string;
    profile: {
      avatar: string;
      bio: string;
    };
  }>;
  meta: {
    total: number;
    page: number;
  };
}

type User = ApiResponse["users"][0]; // 개별 사용자 타입
type UserProfile = User["profile"]; // 사용자 프로필 타입
type MetaInfo = ApiResponse["meta"]; // 메타 정보 타입
```

### 설정 객체에서 특정 설정 타입 추출

```ts
const appConfig = {
  database: {
    host: "localhost",
    port: 5432,
    name: "myapp",
  },
  cache: {
    ttl: 3600,
    maxSize: 1000,
  },
  features: {
    enableNewUI: true,
    enableBetaFeatures: false,
  },
} as const;

type DatabaseConfig = (typeof appConfig)["database"];
type CacheConfig = (typeof appConfig)["cache"];
type FeatureFlags = (typeof appConfig)["features"];
```

### 함수 파라미터와 반환 타입 추출

```ts
function processUser(user: { id: string; name: string; age: number }) {
  return {
    processed: true,
    user: user,
    timestamp: new Date(),
  };
}

type UserParam = Parameters<typeof processUser>[0]; // { id: string; name: string; age: number }
type ProcessResult = ReturnType<typeof processUser>; // { processed: boolean; user: { id: string; name: string; age: number; }; timestamp: Date }
```

### 조건부 타입과의 활용

```ts
/**
 * 함수 타입에서 반환 타입이 Promise인지 확인하고 언래핑
 *
 * Promise 타입인 경우, U의 타입을 추론해서 U를 리턴합니다.
 * Promise 타입이 아닌 경우, T를 리턴합니다.
 */
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

interface ServiceMethods {
  getUser: () => Promise<{ id: string; name: string }>;
  getUserSync: () => { id: string; name: string };
  deleteUser: (id: string) => Promise<void>;
}

type UserData = UnwrapPromise<ReturnType<ServiceMethods["getUser"]>>; // { id: string; name: string }
type UserDataSync = UnwrapPromise<ReturnType<ServiceMethods["getUserSync"]>>; // { id: string; name: string }
```

위 에제에서는 getUser 함수의 반환 타입이 `Promise<{ id: string; name: string }>` 이므로, U의 타입으로 `{ id: string; name: string }` 을 추론해서 `UnwrapPromise` 타입은 `{ id: string; name: string }` 을 리턴합니다.

---

## 권장 사항

### 명시적 인터페이스 vs 인덱스 시그니처

```ts
// ❌ 너무 관대한 타입
interface BadConfig {
  [key: string]: any;
}

// ✅ 구체적인 타입 정의
interface GoodConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
  [feature: string]: string | number | boolean; // 추가 기능용
}
```

**2. Record 타입 활용:**

```ts
// ❌ 인덱스 시그니처
interface UserPermissions {
  [userId: string]: "read" | "write" | "admin";
}

// ✅ Record 타입 사용
type UserPermissions = Record<string, "read" | "write" | "admin">;
```

**3. 타입 안전성을 위한 검증:**

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30 };
const userName = getProperty(user, "name"); // string (타입 안전)
// const invalid = getProperty(user, 'invalid'); // 컴파일 에러
```

### 성능 고려사항

**1. 컴파일 시간:**

- 복잡한 인덱스 액세스 타입은 컴파일 시간을 증가시킬 수 있습니다.
- 필요한 경우에만 사용하고, 가능하면 명시적 타입을 정의해야 합니다.

**2. 런타임 영향 없음:**

- 모든 타입 정보는 컴파일 시에만 존재하기 때문에 런타임에는 아무런 영향을 주지 않습니다.

---

## 요약

### 주요 패턴 요약

| 패턴                 | 문법                       | 용도                  | 예시                         |
| -------------------- | -------------------------- | --------------------- | ---------------------------- |
| 인덱스 시그니처      | `[key: string]: ValueType` | 동적 키 객체 정의     | `{ [userId: string]: User }` |
| 기본 인덱스 액세스   | `Type[Key]`                | 속성 타입 추출        | `User['name']`               |
| typeof 인덱스 액세스 | `(typeof value)[Key]`      | 값에서 속성 타입 추출 | `(typeof config)['api']`     |
| keyof와 조합         | `Type[keyof Type]`         | 모든 속성값의 유니온  | `User[keyof User]`           |
| 배열 요소 타입       | `ArrayType[number]`        | 배열 요소 타입 추출   | `Users[number]`              |
| 튜플 특정 요소       | `TupleType[Index]`         | 튜플 특정 위치 타입   | `[string, number][0]`        |

### 연산자 비교

| 연산자      | 입력        | 출력                  | 예시                                            |
| ----------- | ----------- | --------------------- | ----------------------------------------------- |
| `typeof`    | 값 (value)  | 타입 (type)           | `typeof user` → `{ name: string; age: number }` |
| `keyof`     | 타입 (type) | 키 유니온 (key union) | `keyof User` → `"name" \| "age"`                |
| `Type[Key]` | 타입, 키    | 속성 타입             | `User["name"]` → `string`                       |

### 사용 시나리오별 권장사항

| 시나리오                   | 권장 방법                                      | 이유                      |
| -------------------------- | ---------------------------------------------- | ------------------------- |
| API 응답 타입 정의         | 명시적 인터페이스 + 필요시 인덱스 액세스       | 타입 안전성과 가독성      |
| 설정 객체                  | Record 타입 또는 명시적 속성 + 인덱스 시그니처 | 유연성과 타입 안전성 균형 |
| 상수 객체에서 값 타입 추출 | `as const` + `typeof` + `keyof` 조합           | 리터럴 타입 보장          |
| 배열/튜플 요소 타입        | `ArrayType[number]` 또는 `TupleType[Index]`    | 정확한 요소 타입 추출     |

---

## 정리

### 핵심 개념 정리

1. **인덱스 시그니처**는 동적인 키를 가진 객체의 타입을 정의할 때 사용합니다
2. **인덱스 액세스 타입**은 기존 타입에서 특정 속성의 타입을 추출할 때 사용합니다
3. **typeof 연산자**는 값의 타입을 추론하고, **keyof 연산자**는 타입의 모든 키를 추출합니다
4. 배열에서는 모든 요소가 같은 타입을 가지지만, 튜플에서는 각 위치마다 다른 타입을 가질 수 있습니다

## 참고 자료

- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
- [Typeof Type Operator](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)
- [Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
- [Exploring the Power of Square Brackets in TypeScript](https://alexop.dev/posts/exploring-the-power-of-square-brackets-in-typescript/)
- [TypeScript keyof with Examples](https://refine.dev/blog/typescript-keyof/#typescript-keyof-with-generic-type-mappers)
- [A Deep Dive into TypeScript's infer Keyword](https://dev.to/leapcell/a-deep-dive-into-typescripts-infer-keyword-1o4b)
