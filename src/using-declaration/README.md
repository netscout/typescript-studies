# Typescript: Using 문으로 리소스 관리

## 목차

- [이 글에서 사용된 환경 설정](#이-글에서-사용된-환경-설정)
- [개요](#개요)
- [C#의 using 문](#c의-using-문)
- [Javascript는?](#javascript는)
- [Typescript의 using 문](#typescript의-using-문)
- [리소스 해제 순서](#리소스-해제-순서)
- [비동기 호출이 필요한 경우](#비동기-호출이-필요한-경우)
- [매번 인터페이스로 구현해야 한다고?](#매번-인터페이스로-구현해야-한다고)
- [핵심 개념 요약](#핵심-개념-요약)
- [참고자료](#참고자료)

## 이 글에서 사용된 환경 설정

- **Node.js**: 22.14.0
- **TypeScript**: 5.5.3

## 개요

어떤 종류의 앱이든 만들다 보면 리소스 할당과 해제는 매우 중요한 문제입니다. 메모리를 자동으로 관리해주는 GC의 동작 방식을 보면, 특정한 절차를 통해 더 이상 참조되지 않는 객체를 찾아서 삭제해주는 작업을 반복합니다. 리소스를 할당만 하고 제대로 해제하지 않는다면 이미 사용이 끝난 리소스가 계속해서 메모리와 CPU 리소스를 점유하게 되고 이런 문제가 계속 발생한다면 심각한 앱은 심각한 메모리 누수 문제를 겪게 되겠죠.

C#과 같은 언어에서는 초장기 부터 이런 문제를 해결하기 위해서(당시에는 C, C++의 포인터를 사용할 때 메모리 관리가 어려웠습니다.) 할당한 리소스를 자동으로 해제할 수 있는 방법을 제공했습니다.

## C#의 using 문

C#에서는 `IDisposable` 또는 `IAsyncDisposable` 인터페이스를 구현하여 리소스를 할당한 후 사용이 끝나면 자동으로 해제되는 방법을 제공합니다.

다음과 같은 텍스트 파일이 있고, 이 파일을 조금씩 읽어서 콘솔에 출력하는 코드를 예시로 들어볼까요?

```text
// csharp-using/text.txt
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla consectetur enim lorem, vestibulum egestas nibh consectetur quis. Nam a fringilla est, eu fringilla dui. Vestibulum neque quam, dignissim ut blandit in, suscipit laoreet dolor. Cras hendrerit urna at elit pellentesque, in bibendum libero laoreet. Nam interdum sapien id metus scelerisque facilisis. Praesent venenatis viverra lacus, nec varius mi mattis at. Sed malesuada velit risus, et pharetra arcu rhoncus sed. Duis sit amet tincidunt nisl, vel gravida ante.

Morbi egestas eu nisl et bibendum. Duis placerat sodales nulla, sed dictum libero mattis vel. Suspendisse velit sapien, scelerisque vel massa quis, ultrices vestibulum mauris. Vestibulum sit amet viverra leo, quis euismod sem. Aliquam dignissim arcu nec lectus lacinia, at pretium urna aliquam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Duis lectus nunc, hendrerit eget lobortis nec, rutrum ut risus. Morbi porta orci velit, et viverra magna ullamcorper ac. Praesent commodo, turpis ut facilisis scelerisque, felis enim efficitur risus, et elementum sapien arcu vel tellus. Praesent feugiat aliquet consequat. Mauris in leo suscipit, molestie erat ut, cursus nibh. In luctus dui et nulla luctus, a elementum libero aliquet. Mauris finibus bibendum vestibulum. Quisque rhoncus purus at turpis hendrerit accumsan. Praesent posuere sapien dolor, vel feugiat sem fermentum vel. Donec massa dui, pulvinar eget quam a, aliquet malesuada arcu.

Curabitur non lorem ut justo luctus luctus. Vivamus ac congue nunc, ac tincidunt velit. Praesent nulla nisl, sollicitudin sed venenatis id, pharetra id neque. Donec tellus magna, dignissim nec faucibus vel, facilisis quis ligula. Nullam eget aliquam nisi. Mauris imperdiet nunc sed augue iaculis euismod. Duis sollicitudin posuere mauris eget accumsan. Etiam vestibulum est at sagittis maximus. Pellentesque mollis diam quis purus venenatis, vel cursus risus dictum. Vivamus elementum, magna ac eleifend rutrum, velit tellus mollis odio, sed volutpat quam felis quis tellus. Morbi a feugiat metus. Nullam sodales sem eu ligula pulvinar, a pellentesque tellus vehicula. Curabitur nec mi ornare, laoreet mi eu, molestie arcu. Curabitur ex lacus, ultricies a dui nec, placerat finibus enim. Vestibulum euismod a dolor eu vulputate.

Donec ac malesuada nisl, ut tincidunt neque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean rhoncus eros non maximus fringilla. Curabitur lobortis ac lacus in aliquam. Morbi id arcu dui. Cras quis erat cursus, aliquam dolor et, vestibulum risus. Sed eleifend hendrerit nulla, sed maximus risus pellentesque at. Phasellus a placerat metus, vel maximus justo. Sed semper gravida risus, vel pulvinar diam pharetra at. Sed pellentesque libero mi, vitae semper ligula porta in. Suspendisse ornare, arcu nec euismod suscipit, lectus sem placerat nulla, id eleifend nisl mauris et purus. Duis in eros a nibh venenatis posuere.

Morbi rhoncus orci tortor. Vivamus cursus dolor in magna efficitur, a iaculis ligula imperdiet. Curabitur nec consectetur lectus, non bibendum quam. Nullam mollis posuere auctor. Quisque scelerisque luctus ante, vel auctor justo finibus quis. Aenean efficitur massa non nisi blandit, nec ullamcorper lectus egestas. In sed sodales dolor, sed accumsan mi. Nunc tincidunt porttitor arcu in semper. Phasellus rhoncus felis elementum justo tempor, sed congue turpis condimentum. Nam aliquet felis in pharetra convallis. Ut vestibulum hendrerit odio, et aliquet massa fringilla vitae. Fusce est risus, varius nec turpis sit amet, varius consectetur elit. Nam tristique nulla nisl, sed venenatis nunc pretium a.
```

다음은 이 파일을 읽어서 콘솔에 출력하는 코드입니다.

```csharp
// csharp-using/main.cs
using System.IO;

var buffer = new char[50];
using (var reader = new StreamReader("text.txt"))
{
  int charsRead = 0;
  while (reader.Peek() != -1)
  {
    charsRead = reader.Read(buffer, 0, buffer.Length);
    Console.Write(buffer, 0, charsRead);
  }
}
```

이 코드를 실행하려면, cs 파일을 스크립트로 실행할 수 있게 해주는 `dotnet-script`를 설치해야 합니다.

```bash
> dotnet tool install -g dotnet-script
...
You can invoke the tool using the following command: dotnet-script
Tool 'dotnet-script' (version '1.6.0') was successfully installed.

> dotnet script main.cs
...Nam tristique nulla nisl, sed venenatis nunc pretium a.
```

코드가 중간 언어(IL)로 변환될 때 using 블록으로 감싸진 리소스를 try-finally 블록으로 변환하고 finally 블록 안에서 `IDisposable` 인터페이스의 `Dispose()` 메서드를 호출합니다.

```csharp
finally
{
    streamReader?.Dispose();
}
```

리소스를 해제하는 걸 일일이 기억할 필요 없이 using 문을 사용하면 리소스의 해제가 자동으로 일어나게 되는 거죠. 정신 없이 코딩하다보면 리소스 해제를 놓치는 경우는 생각보다 자주 일어납니다...그게 개발이죠!

## Javascript는?

Javascript는... 이런 기능을 제공하진 않았습니다.

텍스트 파일에 내용을 추가하는 간단한 예제를 볼까요?

```typescript
// typescript-using/append-file.ts
import fs from "fs";

function appendToFile(filePath: string, content: string): void {
  let fd: number | null = null;

  try {
    // Open file for appending
    fd = fs.openSync(filePath, "a");

    const buffer = Buffer.from(content, "utf8");
    fs.writeSync(fd, buffer);

    console.log(`텍스트 추가 성공 ${filePath}`);
  } catch (error) {
    console.error("텍스트 추가 실패:", error);
  } finally {
    if (fd !== null) {
      fs.closeSync(fd);
    }
  }
}

appendToFile("test.txt", "Hello, world!");
appendToFile("test.txt", "Hello, World!");
```

보시는 것 처럼 finally 블록에서 직접 리소스를 해제 하도록 하는 코드를 작성해줘야 합니다. 만약 해제를 까먹는다면 어떻게 될까요?

위 코드에서 fs.closeSync(fd)를 주석 처리하고 실행해봐도 실행에는 문제가 없지만, 메모리 누수가 생기겠죠? 그리고 OS의 File Descriptor 또한 계속 차지하다가 `Too many open files` 에러도 발생할 수 있습니다.

이런 문제가 있다보니 Javascript에서도 리소스 관리를 좀 더 스마트하게 할 수 있는 방법을 제공하기 위한 논의가 진행되었습니다. [tc39](https://github.com/tc39/proposal-explicit-resource-management) 에 의해 이미 스펙은 정의되었고, 각 브라우저/런타임 등에서 구현이 시작된 상태입니다.

## Typescript의 using 문

Typescript 5.2 버전에서는 Javascript의 스펙에 발 맞춰 `using` 키워드를 통해 어떤 리소스가 자동으로 해제되는지 선언할 수 있게 되었습니다.

```typescript
// typescript-using/using-append-file.ts
import fs from "fs";

class FileDescriptor implements Disposable {
  private fd: number;

  constructor(filePath: string, mode: string) {
    this.fd = fs.openSync(filePath, mode);
  }

  get descriptor(): number {
    return this.fd;
  }

  /**
   * 파일 디스크립터가 선언된 스코프를 벗어날 때, 자동으로 파일 디스크립터를 해제합니다.
   */
  [Symbol.dispose](): void {
    if (this.fd !== null) {
      fs.closeSync(this.fd);
      console.log("File descriptor closed automatically");
    }
  }
}

function appendToFileWithUsing(filePath: string, content: string): void {
  try {
      // using 카워드로 선언된 객체는 선언된 스코프를 벗어날 때 자동으로 Symbol.dispose를 호출합니다.
      using file = new FileDescriptor(filePath, "a");

      const buffer = Buffer.from(content, "utf8");
      fs.writeSync(file.descriptor, buffer);

    console.log(`Successfully appended to ${filePath}`);
  } catch (error) {
    console.error("Error appending to file:", error);
    // 에러가 발생하더라도 파일 디스크립터는 자동으로 해제됩니다!
  }
}

appendToFileWithUsing("test.txt", "Hello, world!");
appendToFileWithUsing("test.txt", "Hello, World!");
```

`FileDescriptor` 클래스는 `Disposable` 인터페이스를 통해 `Symbol.dispose` 메서드를 구현하고 있습니다. `Disposable` 인터페이스는 파일 디스크립터가 선언된 스코프를 벗어날 때 자동으로 파일 디스크립터를 해제합니다.

위 코드를 실행하면 다음과 같은 결과를 얻을 수 있습니다.

```bash
> npx ts-node ./using-append-file.ts
Successfully appended to test.txt
File descriptor closed automatically
Successfully appended to test.txt
File descriptor closed automatically
```

`npx tsc` 명령으로 빌드된 소스코드를 보면 뭔가 복잡하긴 하지만, 핵심은 이렇습니다.

```typescript
function appendToFileWithUsing(filePath, content) {
  try {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
      // using 카워드로 선언된 객체는 선언된 스코프를 벗어날 때 자동으로 Symbol.dispose를 호출합니다.
      const file = __addDisposableResource(
        env_1,
        new FileDescriptor(filePath, "a"),
        false
      );
      const buffer = Buffer.from(content, "utf8");
      fs_1.default.writeSync(file.descriptor, buffer);
      console.log(`Successfully appended to ${filePath}`);
    } catch (e_1) {
      env_1.error = e_1;
      env_1.hasError = true;
    } finally {
      __disposeResources(env_1);
    }
  } catch (error) {
    console.error("Error appending to file:", error);
    // 에러가 발생하더라도 파일 디스크립터는 자동으로 해제됩니다!
  }
}
```

finally 블록을 통해 리소스를 해제하는 코드로 변환되었습니다. 앞서 보신 코드들과 비슷하죠?

## 리소스 해제 순서

using 문을 통해 리소스를 사용하면, 해당 using 문이 포함된 스코프를 벗어날 때 리소스가 해제됩니다. 그 순서를 확인해볼까요? 다음은 Typescript의 공식 문서에 포함된 예제입니다.

```typescript
function syncLoggy(id: string): Disposable {
  console.log(`Creating ${id}`);
  return {
      [Symbol.dispose]() {
          console.log(`Disposing ${id}`);
      }
  }
}

function syncFunc() {
  using a = syncLoggy("a");
  using b = syncLoggy("b");
  {
      using c = syncLoggy("c");
      using d = syncLoggy("d");
  }
  using e = syncLoggy("e");
  return;
  // return 문 이후의 코드는 실행되지 않습니다.
  using f = syncLoggy("f");
}

syncFunc();
```

실행 결과는 다음과 같습니다.

```bash
> npx ts-node ./dispose-order.ts
Creating a
Creating b
Creating c
Creating d
Disposing d
Disposing c
Creating e
Disposing e
Disposing b
Disposing a
```

생성된 리소스는 역순으로 해제되며, 가장 안쪽 스코프에 포함된 c, d가 먼저 해제되는 걸 볼 수 있습니다.

### 비동기 호출이 필요한 경우

리소스를 해제할 때 비동기 호출이 필요한 경우는 `AsyncDisposable` 인터페이스를 통해 `Symbol.asyncDispose` 메서드를 구현하면 됩니다. 역시 Typescript의 공식 문서에 포함된 예제를 통해 확인해볼까요?

```typescript
async function doWork() {
  // 0.5초 동안 대기합니다.
  await new Promise(resolve => setTimeout(resolve, 500));
}

function asyncLoggy(id: string): AsyncDisposable {
  console.log(`Constructing ${id}`);
  return {
      async [Symbol.asyncDispose]() {
          console.log(`Disposing (async) ${id}`);
          await doWork();
      },
  }
}

async function asyncFunc() {
  await using a = asyncLoggy("a");
  await using b = asyncLoggy("b");
  {
      await using c = asyncLoggy("c");
      await using d = asyncLoggy("d");
  }
  await using e = asyncLoggy("e");
  return;
}
asyncFunc();
```

실행 결과는 다음과 같습니다.

```bash
> npx ts-node ./async-dispose.ts
Constructing a
Constructing b
Constructing c
Constructing d
Disposing (async) d
Disposing (async) c
Constructing e
Disposing (async) e
Disposing (async) b
Disposing (async) a
```

## 매번 인터페이스로 구현해야 한다고?

그런데 말입니다... 뭔 코드를 작성할 때 마다 이렇게 클래스를 정의해서 `Disposable` 인터페이스를 구현해야만 하는 걸까요? 그래서 `DisposableStack`, `AsyncDisposableStack` 역시 제공됩니다. 이 객체를 이용하면, 별도의 클래스를 정의하지 않고 해제되어야 할 리소스를 명시할 수 있습니다.

> 2025년 8월 31일 현재 `DisposableStack`은 Node.js 에서 구현되지 않았기 때문에 `@whatwg-node/disposablestack` 패키지를 사용합니다. `npm i @whatwg-node/disposablestack` 명령으로 설치해주세요.

```typescript
// typescript-using/disposableTimer.ts
import { DisposableStack } from "@whatwg-node/disposablestack"

async function disposableTimerFunc() {
  using disposer = new DisposableStack();
  // disposer.use(disposableTimer(() => console.log("timer tick"), 1000));
  const timer = setInterval(() => console.log("timer tick"), 1000);
  disposer.defer(() => {
    clearInterval(timer);
    console.log("timer disposed");
  });

  console.log("5초 동안 타이머를 기다립니다...");
  await new Promise(resolve => setTimeout(resolve, 5000));
}

disposableTimerFunc();
```

그리고 결과를 볼까요?

```bash
> npx ts-node ./disposableTimer.ts
5초 동안 타이머를 기다립니다...
timer tick
timer tick
timer tick
timer tick
timer disposed
```

별도로 인터페이스를 구현하지 않더라도, defer 메서드로 전달한 리소스 해제 코드를 통해 리소스를 해제할 수 있습니다. 단, 주의해야 할 점이 있습니다. `반드시 리소스를 선언한 직후에 defer 메서드로 리소스 해제 코드를 전달해야 합니다.` `DisposableStack`은 stack과 유사한 형태로 `마지막에 들어온 게 가장 먼저 나간다` 는 원리로 작동합니다. 그래서 불분명한 리소스 해제로 인해서 문제가 발생하지 않으려면 꼭 선언된 직후에 defer 메서드로 리소스 해제 코드를 전달해야 합니다.

## 핵심 개념 요약

| 개념                | 설명                                    | 예시                                     |
| ------------------- | --------------------------------------- | ---------------------------------------- |
| **using 선언**      | 스코프를 벗어날 때 자동으로 리소스 해제 | `using file = new FileDescriptor(...)`   |
| **Disposable**      | 동기 리소스 해제 인터페이스             | `[Symbol.dispose](): void`               |
| **AsyncDisposable** | 비동기 리소스 해제 인터페이스           | `[Symbol.asyncDispose](): Promise<void>` |
| **DisposableStack** | 여러 리소스를 스택으로 관리             | `disposer.defer(() => cleanup())`        |
| **해제 순서**       | LIFO (Last In, First Out) 방식          | 마지막에 생성된 것부터 해제              |

## 참고자료

- [TypeScript 5.2](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management)
- [JavaScript resource management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Resource_management)
- [tc39/proposal-explicit-resource-management](https://github.com/tc39/proposal-explicit-resource-management)
- [https://www.npmjs.com/package/@whatwg-node/disposablestack](https://github.com/whatwg-node/disposablestack)
- [IDisposable을 구현하는 개체 사용](https://learn.microsoft.com/ko-kr/dotnet/standard/garbage-collection/using-objects)
