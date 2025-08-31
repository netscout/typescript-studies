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