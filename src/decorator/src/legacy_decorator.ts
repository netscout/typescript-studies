/**
 * A decorator that logs when a method is entered and exited.
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
  @loggedMethod()
  myMethod() {
    console.log("myMethod called");
  }
}

const myClass = new MyClass();
myClass.myMethod();
