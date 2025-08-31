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