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
    //throw new Error("test");
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
