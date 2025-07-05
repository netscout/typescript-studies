# TypeScript: 타입 전용 import & export와 import 생략(Import Elision)

# 들어가며

최근에 typescript로 간단한 테스트 프로젝트를 설정할 일이 있었습니다. 폴더를 만들고 간단한 테스트를 위해서 기존 프로젝트에서 코드를 조금씩 복사해서 테스트 프로젝트를 구성하던 중 [처음 보는 lint 오류](https://typescript-eslint.io/rules/consistent-type-imports/)를 발견했습니다. 타입 정보로만 사용되는 import에 type을 붙여라! 는 거였죠.

최대한 간단하게 테스트를 해보려던 저는 머리가 복잡해졌죠. 아니 이게 도대체 뭔데 프로젝트 여기저기서 난리가 난걸까 하고 말이죠. 그래서 일단 eslint의 룰을 해제하고 작업을 이어갔습니다.

그리고 나중에 시간이 좀 생겼을 때 관련해서 찾아보니 타입 전용 import, export 그리고 import 생략(elision)에 대해 알게 되었죠.

import 생략은 typescript가 코드를 js로 컴파일 및 변환하는 과정에서 타입 정보로만 사용되는 import를 자동으로 제거한다는 것입니다. 생각해보면, js에서는 딱히 타입을 체크하지 않으니 typescript에서 타입을 체크하기 위해 사용하는 정보가 필요없겠구나 싶긴 했지만 그렇다면 왜 굳이 import에 이게 타입을 위한 import인지 적어야 할까 하는 생각이 들었습니다.

그래서 좀 알아본 뒤, 나름 이해한 내용에 대해 잊어먹지 않기 위해 이 글을 적게 되었죠.

## 타입 전용(type only) import & export 란?

타입 전용 import & export는 컴파일 타임에 타입을 체크하기 위한 용도로 사용되는 import와 실제 런타임에서 사용되는 import 값들을 구분하기 위해 사용됩니다. 기존 import, export에 type을 붙여서 `import type`, `export type` 으로 사용합니다.

```typescript
// 타입 전용 import
import type { User, Status } from "./types";

// 타입 전용 export
export type { User, Status };

// 혼합된 import (TypeScript 4.5+)
import { type User, api, config } from "./module";

// 타입 전용 import로 가져온 타입을 다시 타입 전용 export로 내보내기
export type { User } from "./user";
```

여기서 가장 중요한 점은 `import type`으로 가져온 타입 관련 코드는 컴파일 과정에서 완전히 사라진다는 겁니다. 다음과 같이 테스트해볼 수 있습니다.

우선 `ex1/types.ts` 파일에 간단한 타입을 하나 작성합니다.

```typescript
export interface User {
  name: string;
  age: number;
}
```

그리고 `ex1/main.ts` 파일에서 위에서 작성한 타입을 사용합니다.

```typescript
import { type User } from "./types";

// 여기서 User는 컴파일 타임의 타입 체크 용도로만 사용되고 있습니다.
const user: User = {
  name: "John",
  age: 30,
};

console.log(user);
```

이제 `npx tsc` 명령어를 통해 컴파일을 하고 `dist/type-only-import/ex1/main.js` 파일을 확인해보면 다음과 같이 타입 정보로만 사용되는 import가 제거된 것을 확인할 수 있습니다.

```typescript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 여기서 User는 컴파일 타임의 타입 체크 용도로만 사용되고 있습니다.
const user = {
  name: "John",
  age: 30,
};
console.log(user);
```

## 왜 이게 중요한가요?

큰 프로젝트를 빌드하다보면, 모듈 간의 의존성이 복잡해집니다. 어디서 뭘 export하고 import 하는지가 명확하지 않고 외부 라이브러리 까지 복잡하게 얽히면 파악하기 더 어려워집니다. 그리고 빌드 및 번들링과정을 거치면 파일 크기가 커지고 빌드도 오래걸리며, 앱이 실행될 때 덩치가 큰 파일을 로드해야 하니까 메모리 사용도 늘어납니다.

그런데 타입 전용 import & export를 사용하면 컴파일 타임에 타입 정보로만 사용되는 import를 제거하고, 런타임에는 필요한 값들만 남기기 때문에 빌드 시간과 메모리 사용량을 줄일 수 있습니다.

게다가 이해하기 힘든 순환 참조, 사이드 이펙트 등의 오류도 방지할 수 있습니다.

### 순환 참조 오류

```typescript
// src/ex2/a.ts
import { B } from "./b";

export class A {
  b: B;
  constructor() {
    this.b = new B();
    console.log("A created");
  }
}

// src/ex2/b.ts
import { A } from "./a";

export class B {
  a: A;
  constructor() {
    this.a = new A();
    console.log("B created");
  }
}

// src/ex2/main.ts
import { A } from "./a";

const a = new A();
```

위 예제를 빌드 후 `node dist/type-only-import/ex2/main.js` 명령어를 통해 실행해보면 다음과 같은 오류가 발생합니다.

```
/Users/onlifecoding/src/test/typescript-studies/dist/type-only-import/ex2/b.js:7
        this.a = new a_1.A();
        ^

RangeError: Maximum call stack size exceeded
    at new B (/Users/onlifecoding/src/test/typescript-studies/dist/ex2/b.js:7:9)
    at new A (/Users/onlifecoding/src/test/typescript-studies/dist/ex2/a.js:7:18)
    at new B (/Users/onlifecoding/src/test/typescript-studies/dist/ex2/b.js:7:18)
    at new A (/Users/onlifecoding/src/test/typescript-studies/dist/ex2/a.js:7:18)
    at new B (/Users/onlifecoding/src/test/typescript-studies/dist/ex2/b.js:7:18)
    at new A (/Users/onlifecoding/src/test/typescript-studies/dist/ex2/a.js:7:18)
    at new B (/Users/onlifecoding/src/test/typescript-studies/dist/ex2/b.js:7:18)
    at new A (/Users/onlifecoding/src/test/typescript-studies/dist/ex2/a.js:7:18)
    at new B (/Users/onlifecoding/src/test/typescript-studies/dist/ex2/b.js:7:18)
    at new A (/Users/onlifecoding/src/test/typescript-studies/dist/ex2/a.js:7:18)

Node.js v22.14.0
```

클래스 A, B가 각각 타입으로 상대방을 참조하고 있기 때문에 순환참조 오류가 발생합니다. 위 코드에서 타입 전용 import를 사용해볼까요?

```typescript
// src/ex2/a.ts
import type { B } from "./b";

export class A {
  b: B | undefined;
  constructor() {
    //this.b = new B(); <- 값이 아닌 타입으로만 사용하도록 변경 했습니다.
    console.log("A created");
  }
}

// src/ex2/b.ts
import type { A } from "./a";

export class B {
  a: A | undefined;
  constructor() {
    //this.a = new A(); <- 값이 아닌 타입으로만 사용하도록 변경 했습니다.
    console.log("B created");
  }
}
```

이제 다시 빌드 후 실행하면 오류가 발생하지 않습니다.

### 사이드 이펙트 오류

타입 전용 import는 컴파일 과정에서 완전 제거 되기 때문에 import로 인한 예상하지 못한 동작을 방지할 수 있습니다.

```typescript
// analytics.ts
console.log("Analytics module loaded!"); // 모듈이 로드될 때 실행될 console.log

export interface TrackingEvent {
  name: string;
  data: Record<string, any>;
}

// main.ts
// 타입 전용 import는 console.log가 실행되지 않습니다.
import type { TrackingEvent } from "./analytics";

// 타입과 사이드 이펙트 모두 필요할 때는 따로 명시해줘야 합니다.
import type { TrackingEvent } from "./analytics";
import "./analytics"; // 사이드 이펙트 발생
```

## 타입 전용 import & export 사용 시 주의사항

### 코드 가독성을 위한 구조화

다음과 같이 같은 파일에서 import하더라도 타입 전용 import와 런타임에 값으로 사용되는 import를 명확하게 구분하는 게 좋습니다.

```typescript
// 타입 전용 import
import type { ComponentProps } from "./components";

// 런타임에 사용되는 import
import { Button, Modal } from "./components";
```

### isolatedModules 옵션 사용시 type 전용 export 사용

Babel, SWC등의 빌드 툴을 사용하는 경우 전체 프로젝트를 한 번에 분석하지 않기 때문에 각 파일이 독립적으로 transpile 될 수 있도록 isolatedModules 옵션을 사용합니다. 이 옵션을 사용할 때는 type 전용 export를 사용해서 타입 정보를 내보내야 합니다.

```typescript
// 잘못된 방식 - isolatedModules에서 컴파일 에러
export { User } from "./user";
export { Post } from "./post";

// 올바른 방식
export type { User } from "./user";
export type { Post } from "./post";
```

### verbatimModuleSyntax 옵션 사용

tsconfig.json에서 `verbatimModuleSyntax` 옵션을 사용하면 다음과 같이 타입 전용 import, export의 사용 규칙이 명확해집니다.

- 타입 전용 import, export는 빌드 과정에서 완전히 제거됩니다.
- `type` 키워드가 사용되지 않은 import, export는 빌드 후에도 유지됩니다.
- typescript가 import에 대해서 타입으로 사용되는지 아닌지 검사하지 않도록 합니다. 따라서 typescript가 자동으로 수행하던 import 생략(elision)을 수행하지 않습니다.

# 참고 자료

- [Verbatim Module Syntax](https://www.typescriptlang.org/tsconfig/#verbatimModuleSyntax)
- [Consistent Type Imports and Exports: Why and How](https://typescript-eslint.io/blog/consistent-type-imports-and-exports-why-and-how/)
- [Type-Only Imports](https://typestronglab.in/tutorial/type-imports)
- [Circular dependency caused by importing typescript type](https://stackoverflow.com/questions/48418317/circular-dependency-caused-by-importing-typescript-type)
- [Issue: no-circular does not follow dependencyTypesNot: ['type-only'] over entire cycle](https://github.com/sverweij/dependency-cruiser/issues/695)
