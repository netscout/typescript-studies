# TypeScript: Decorator

## 📚 목차 (Table of Contents)

1. [개요](#개요)
2. [기존에 작성했던 데코레이터 (Legacy)](#기존에-작성했던-데코레이터)
3. [TypeScript 5.0+의 데코레이터 (Modern)](#typescript-50의-데코레이터)
4. [좀 더 확장해보기](#좀-더-확장해보기)
5. [참고자료](#참고자료)

---

## 개요

예전에 퇴사했던 직원이 작성했던 프로젝트를 유지보수하기 위해 코드를 들여다 본적이 있었습니다. 그 프로젝트를 A라고 해보죠. 4-5개의 프로젝트를 동시에 띄워놓고 동작을 확인해야 했어서 정신없이 프로젝트를 실행하고 동작을 확인하던 중 A에서 뭔가 제대로 동작하지 않는다는 걸 확인했습니다. 그래서 로그를 확인해보다 놀랐습니다! A에는 로그를 남기는 코드가 단 한 줄도 없었거든요...

그래서 일단 요청을 처리하는 각 메서드 마다 시작과 끝을 로그로 남겨야겠다는 생각에 로그를 추가하다가 문득 얼마전 지나가듯이 봤던 Typescript의 데코레이터(Decorator)가 기억났습니다. 그래서 무작정 찾아보며 코드를 작성하기 시작했습니다.

## 기존에 작성했던 데코레이터

우선 tsconfig.json 파일을 다음과 같이 설정합니다.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

그리고 데코레이터를 작성합니다.

```ts
// src/legacy_decorator.ts

/**
 * 메서드의 시작과 끝을 기록하는 데코레이터
 */
export function loggedMethod(headMessage = "🚩"): MethodDecorator {
  return function actualDecorator<T>(
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): void | TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value as unknown as (
      ...args: any[]
    ) => any;
    const methodName = String(propertyKey);

    function replacementMethod(this: any, ...args: any[]) {
      console.log(`${headMessage} Entering method '${methodName}'.`);
      const result = originalMethod.apply(this, args);
      console.log(`${headMessage} Exiting method '${methodName}'.`);
      return result;
    }

    descriptor.value = replacementMethod as unknown as T;
    return descriptor;
  };
}

class MyClass {
  // @ts-ignore - Typescript 5.8의 데코레이터 타입 체크를 일단 해제
  @loggedMethod() // 메서드에 데코레이터 적용
  myMethod() {
    console.log("myMethod called");
  }
}

const myClass = new MyClass();
myClass.myMethod();
```

> 참고로 해당 코드는 Typescript 5.1 에서 작성되었으나, 글을 작성하는 현재 최신 버전인 5.8에서의 실행을 위해 일단 @ts-ignore를 적용했습니다.

그리고 실행해보면 결과는 아래와 같습니다.

```bash
❯ npx ts-node legacy_decorator.ts
🚩 Entering method 'myMethod'.
myMethod called
🚩 Exiting method 'myMethod'.
```

메서드가 호출될 때마다 로그가 출력되는걸 볼 수 있습니다.

그런데 이 데코레이터는 몇가지 문제점이 있습니다. 현재 이 데코레이터는 비동기 함수에 대해서는 제대로 동작하지 않습니다. 비동기 함수 역시 지원하려면 좀 복잡한 로직을 작성해야만 합니다. 그리고 이게 더 큰 문제인데요, 이 데코레이터는 ECMAscript의 [TC39](https://github.com/tc39/proposal-decorators)에서 제시된 데코레이터 시그니처와 맞지 않습니다. 언젠가는 사라질 운명이라는 거죠.

## Typescript 5.0+의 데코레이터

그래서 Typescript 5.0+에서는 표준과 발맞추도록 데코레이터를 개선했습니다. 앞서 보셨던 코드와 동일한 작업을 하는 코드입니다. 이 코드를 실행하기 위해서 tsconfig.json 파일을 다음과 같이 설정합니다.

```json
{
  "compilerOptions": {
    "target": "es2022"
  }
}
```

그리고 데코레이터를 작성합니다.

```ts
// src/new_decorator.ts

function loggedMethod(headMessage = "🚩") {
  return function (
    originalMethod: Function,
    context: ClassMethodDecoratorContext
  ) {
    const methodName = String(context.name);

    function replacementMethod(this: any, ...args: any[]) {
      console.log(`${headMessage} Entering method '${methodName}'.`);
      const result = originalMethod.apply(this, args);
      console.log(`${headMessage} Exiting method '${methodName}'.`);
      return result;
    }

    return replacementMethod;
  };
}

class MyClass {
  @loggedMethod()
  myMethod() {
    console.log("myMethod called");
  }
}

const myClass = new MyClass();
myClass.myMethod();
```

그럼 코드를 실행해 볼까요?

```bash
❯ npx ts-node new_decorator.ts
🚩 Entering method 'myMethod'.
myMethod called
🚩 Exiting method 'myMethod'.
```

잘 동작합니다! 그러면 비동기 함수를 하나 추가해보면 어떨까요?

```ts
// src/new_decorator.ts

function loggedMethod(headMessage = "🚩") {
  return function (
    originalMethod: Function,
    context: ClassMethodDecoratorContext
  ) {
    const methodName = String(context.name);

    function replacementMethod(this: any, ...args: any[]) {
      console.log(`${headMessage} Entering method '${methodName}'.`);
      const result = originalMethod.apply(this, args);
      console.log(`${headMessage} Exiting method '${methodName}'.`);
      return result;
    }

    return replacementMethod;
  };
}

class MyClass {
  @loggedMethod()
  myMethod() {
    console.log("myMethod called");
  }

  // 비동기 메서드
  @loggedMethod()
  async myAsyncMethod() {
    console.log("async method start");
    await new Promise((r) => setTimeout(r, 500));
    console.log("async method end");
  }
}

const myClass = new MyClass();
myClass.myMethod();
myClass.myAsyncMethod();
```

실행 결과는 다음과 같습니다.

```bash
❯ npx ts-node new_decorator.ts
🚩 Entering method 'myMethod'.
myMethod called
🚩 Exiting method 'myMethod'.
🚩 Entering method 'myAsyncMethod'.
async method start
🚩 Exiting method 'myAsyncMethod'. <---- 비동기 함수가 끝나기 전에 로그가 출력되었습니다.
async method end
```

비동기 함수가 끝나는 걸 기다리지 않고, 바로 메서드 종료 로그가 출력되었죠? 이제 비동기 함수를 지원하도록 변경해볼까요?

```ts
// src/new_decorator.ts

function loggedMethod(headMessage = "🚩") {
  return function (
    originalMethod: Function,
    context: ClassMethodDecoratorContext
  ) {
    const methodName = String(context.name);

    function replacementMethod(this: any, ...args: any[]) {
      console.log(`${headMessage} Entering method '${methodName}'.`);
      const result = originalMethod.apply(this, args);

      // 비동기 메서드인 경우, Promise가 완료된 후 로그를 출력
      if (result && typeof result.then === "function") {
        return result.finally(() => {
          console.log(`${headMessage} Exiting method '${methodName}'.`);
        });
      }

      console.log(`${headMessage} Exiting method '${methodName}'.`);
      return result;
    }

    return replacementMethod;
  };
}

class MyClass {
  @loggedMethod()
  myMethod() {
    console.log("myMethod called");
  }

  // 비동기 메서드
  @loggedMethod()
  async myAsyncMethod() {
    console.log("async method start");
    await new Promise((r) => setTimeout(r, 500));
    console.log("async method end");
  }
}

const myClass = new MyClass();
myClass.myMethod();
myClass.myAsyncMethod();
```

원본 메서드릐 실행 결과를 받아서 Promise 인지 여부를 확인하는 코드를 추가했습니다. 결과를 볼까요?

```bash
🚩 Entering method 'myMethod'.
myMethod called
🚩 Exiting method 'myMethod'.
🚩 Entering method 'myAsyncMethod'.
async method start
async method end
🚩 Exiting method 'myAsyncMethod'.
```

이제 비동기 함수도 잘 기다려주는 군요! 이제 마지막으로 한 가지만 더 확인해보겠습니다. 예외가 발생했을 때 말이죠!

```ts
function loggedMethod(headMessage = "🚩") {
  return function (
    originalMethod: Function,
    context: ClassMethodDecoratorContext
  ) {
    const methodName = String(context.name);

    function replacementMethod(this: any, ...args: any[]) {
      console.log(`${headMessage} Entering method '${methodName}'.`);
      const result = originalMethod.apply(this, args);

      // 비동기 메서드인 경우, Promise가 완료된 후 로그를 출력
      if (result && typeof result.then === "function") {
        return result.finally(() => {
          console.log(`${headMessage} Exiting method '${methodName}'.`);
        });
      }

      console.log(`${headMessage} Exiting method '${methodName}'.`);
      return result;
    }

    return replacementMethod;
  };
}

class MyClass {
  @loggedMethod()
  myMethod() {
    console.log("myMethod called");
    throw new Error("test"); // 동기 작업에서 오류 발생
  }

  // 비동기 메서드
  @loggedMethod()
  async myAsyncMethod() {
    console.log("async method start");
    await new Promise((res, rej) =>
      setTimeout(() => {
        rej(new Error("test")); // 비동기 작업에서 오류 발생
      }, 500)
    );
    console.log("async method end");
  }
}

const myClass = new MyClass();
myClass.myMethod();
myClass.myAsyncMethod();
```

위 작업에서 두 메서드 중 하나에서 오류가 발생하도록 해보면 결과는 다음과 같습니다.

```bash
❯ npx ts-node new_decorator.ts
🚩 Entering method 'myMethod'.
myMethod called
/Users/onlifecoding/src/test/typescript-studies/src/decorator/src/new_decorator.ts:31
    throw new Error("test");
          ^
Error: test
    at MyClass.myMethod (/Users/onlifecoding/src/test/typescript-studies/src/decorator/src/new_decorator.ts:31:11)
    at MyClass.replacementMethod (/Users/onlifecoding/src/test/typescript-studies/src/decorator/src/new_decorator.ts:10:37)
    at Object.<anonymous> (/Users/onlifecoding/src/test/typescript-studies/src/decorator/src/new_decorator.ts:48:9)
    at Module._compile (node:internal/modules/cjs/loader:1554:14)
    at Module.m._compile (/Users/onlifecoding/.npm/_npx/1bf7c3c15bf47d04/node_modules/ts-node/src/index.ts:1618:23)
    at node:internal/modules/cjs/loader:1706:10
    at Object.require.extensions.<computed> [as .ts] (/Users/onlifecoding/.npm/_npx/1bf7c3c15bf47d04/node_modules/ts-node/src/index.ts:1621:12)
    at Module.load (node:internal/modules/cjs/loader:1289:32)
    at Function._load (node:internal/modules/cjs/loader:1108:12)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
```

뭐 이거도 그렇게 나쁘진 않지만, 데코레이터가 제대로 메서드의 종료를 출력하진 못하고 있죠. 수정해볼까요?

```ts
function loggedMethod(headMessage = "🚩") {
  return function (
    originalMethod: Function,
    context: ClassMethodDecoratorContext
  ) {
    const methodName = String(context.name);

    function replacementMethod(this: any, ...args: any[]) {
      console.log(`${headMessage} Entering method '${methodName}'.`);

      try {
        const result = originalMethod.apply(this, args);

        // 비동기 메서드인 경우, Promise가 완료된 후 로그를 출력
        if (result && typeof result.then === "function") {
          return result.finally(() => {
            console.log(`${headMessage} Exiting method '${methodName}'.`);
          });
        }

        console.log(`${headMessage} Exiting method '${methodName}'.`);
        return result;
      } catch (error) {
        console.log(
          `${headMessage} Exiting method '${methodName}' with error.`
        );
        throw error;
      }
    }

    return replacementMethod;
  };
}

class MyClass {
  @loggedMethod()
  myMethod() {
    console.log("myMethod called");
    throw new Error("test");
  }

  // 비동기 메서드
  @loggedMethod()
  async myAsyncMethod() {
    console.log("async method start");
    await new Promise((res, rej) =>
      setTimeout(() => {
        rej(new Error("test"));
      }, 500)
    );
    console.log("async method end");
  }
}

const myClass = new MyClass();
myClass.myMethod();
myClass.myAsyncMethod();
```

이제 함수에서 발생하는 오류를 확인해볼까요?

```bash
❯ npx ts-node new_decorator.ts
🚩 Entering method 'myMethod'.
myMethod called
🚩 Exiting method 'myMethod' with error.
/Users/onlifecoding/src/test/typescript-studies/src/decorator/src/new_decorator.ts:39
    throw new Error("test");
          ^
Error: test
    at MyClass.myMethod (/Users/onlifecoding/src/test/typescript-studies/src/decorator/src/new_decorator.ts:39:11)
    at MyClass.replacementMethod (/Users/onlifecoding/src/test/typescript-studies/src/decorator/src/new_decorator.ts:12:39)
    at Object.<anonymous> (/Users/onlifecoding/src/test/typescript-studies/src/decorator/src/new_decorator.ts:56:9)
    at Module._compile (node:internal/modules/cjs/loader:1554:14)
    at Module.m._compile (/Users/onlifecoding/.npm/_npx/1bf7c3c15bf47d04/node_modules/ts-node/src/index.ts:1618:23)
    at node:internal/modules/cjs/loader:1706:10
    at Object.require.extensions.<computed> [as .ts] (/Users/onlifecoding/.npm/_npx/1bf7c3c15bf47d04/node_modules/ts-node/src/index.ts:1621:12)
    at Module.load (node:internal/modules/cjs/loader:1289:32)
    at Function._load (node:internal/modules/cjs/loader:1108:12)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
```

함수가 오류 때문에 종료되었다고 명확하게 표시되는 걸 확인할 수 있습니다.

## 좀 더 확장해보기

데코레이터는 더 다양한 상황에서 유용하게 사용할 수 있는데요, 그 중에서 API 호출이 실패할 때 지정된 횟수만큼 재시도하도록 하는 데코레이터를 구현해보겠습니다.

### 📊 Exponential Backoff 재시도 데코레이터

`Exponential Backoff` 는 API 호출 등이 실패할 때, 지정된 횟수만큼 재시도하되, 재시도 사이에 시간 간격을 지수적으로 증가시키는 방법입니다. 뭔가 서비스가 일시적으로 오류가 발생했을 때, 복구하는 데 시간이 좀 걸릴 수 있으므로 그걸 대비해서 시간을 늘려가면서 재시도하는 거죠.

```ts
// src/retry_decorator.ts

/**
 * 재시도 옵션 인터페이스
 */
interface RetryOptions {
  maxRetries?: number; // 최대 재시도 횟수
  initialDelay?: number; // 초기 대기 시간 (밀리초)
}

/**
 * 특정 시간동안 대기하는 함수
 * @param ms - 대기 시간 (밀리초)
 * @returns 대기 완료 후 프로미스 반환
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 재시도 데코레이터
 * @param options - 재시도 옵션
 * @returns 재시도 데코레이터 함수
 */
function retry(options: RetryOptions = {}) {
  const { maxRetries = 3, initialDelay = 1000 } = options;

  return function (
    originalMethod: Function,
    context: ClassMethodDecoratorContext
  ) {
    const methodName = String(context.name);

    async function replacementMethod(this: any, ...args: any[]) {
      let lastError: any;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const result = originalMethod.apply(this, args);

          // 비동기 메서드의 경우 await 키워드를 사용하여 비동기 작업 완료를 기다림
          if (result && typeof result.then === "function") {
            return await result;
          }

          return result;
        } catch (error) {
          lastError = error;

          if (attempt < maxRetries) {
            // Exponential backoff: 대기 시간 = initialDelay * 2^attempt
            const delay = initialDelay * Math.pow(2, attempt);
            const errorMessage =
              error instanceof Error ? error.message : String(error);

            console.log(
              `🔄 ${delay}ms 후 재시도 ${
                attempt + 1
              }/${maxRetries} - 오류: ${errorMessage}`
            );
            await sleep(delay);
          }
        }
      }

      console.log(`❌ All retries failed for '${methodName}'`);
      throw lastError;
    }

    return replacementMethod;
  };
}

// 예제 사용: Exponential Backoff 재시도 데코레이터
class TestService {
  private asyncAttemptCount = 0;
  private syncAttemptCount = 0;

  // 비동기 메서드에 적용(마지막에 성공하는 케이스)
  @retry({ maxRetries: 3, initialDelay: 500 })
  async unreliableAsyncMethod() {
    this.asyncAttemptCount++;
    console.log(
      `📡 비동기 메서드 테스트 (2번 실패 후 성공) - 시도 ${this.asyncAttemptCount}`
    );

    if (this.asyncAttemptCount < 3) {
      throw new Error(
        `비동기 메서드 테스트 (2번 실패 후 성공) - 시도 ${this.asyncAttemptCount} 회 실패`
      );
    }

    console.log("✅ 비동기 메서드 테스트 (2번 실패 후 성공) - 성공!");

    return "비동기 메서드 테스트 (2번 실패 후 성공) - 성공!";
  }
}

// 결과 테스트
(async () => {
  const service = new TestService();

  console.log("=== 비동기 메서드 테스트 (2번 실패 후 성공) ===");
  try {
    const result = await service.unreliableAsyncMethod();
    console.log("Result:", result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("Final error:", errorMessage);
  }
})();
```

실행 해보면 결과는 다음과 같습니다.

```bash
❯ npx ts-node retry_decorator.ts
=== 비동기 메서드 테스트 (2번 실패 후 성공) ===
📡 비동기 메서드 테스트 (2번 실패 후 성공) - 시도 1
🔄 500ms 후 재시도 1/3 - 오류: 비동기 메서드 테스트 (2번 실패 후 성공) - 시도 1 회 실패
📡 비동기 메서드 테스트 (2번 실패 후 성공) - 시도 2
🔄 1000ms 후 재시도 2/3 - 오류: 비동기 메서드 테스트 (2번 실패 후 성공) - 시도 2 회 실패
📡 비동기 메서드 테스트 (2번 실패 후 성공) - 시도 3
✅ 비동기 메서드 테스트 (2번 실패 후 성공) - 성공!
Result: 비동기 메서드 테스트 (2번 실패 후 성공) - 성공!
```

### 추가 확장 아이디어

이 패턴을 기반으로 다음과 같이 확장해볼 수도 있을 겁니다.

| 데코레이터       | 설명             | 적용 예시                                       |
| ---------------- | ---------------- | ----------------------------------------------- |
| **@Cache()**     | 메서드 결과 캐싱 | `@Cache({ ttl: 5000 })`                         |
| **@RateLimit()** | 호출 빈도 제한   | `@RateLimit({ maxCalls: 10, windowMs: 60000 })` |
| **@Timeout()**   | 실행 시간 제한   | `@Timeout(5000)`                                |
| **@Measure()**   | 성능 측정        | `@Measure({ threshold: 1000 })`                 |
| **@Authorize()** | 권한 검증        | `@Authorize(['admin', 'user'])`                 |

## 참고자료

- [Exploring the Power of TypeScript Decorators: Extending and Modifying Code with Ease](https://dev.to/rajrathod/exploring-the-power-of-typescript-decorators-extending-and-modifying-code-with-ease-424l)
- [Using TypeScript Decorators in Practise](https://blog.bitsrc.io/using-typescript-decorators-in-practise-d09cc1c0f8f4)
- [TypeScript 5.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)
- [tc39/proposal-decorators](https://github.com/tc39/proposal-decorators)
- [TypeScript Handbook - Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
