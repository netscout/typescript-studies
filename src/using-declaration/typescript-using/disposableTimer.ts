import { DisposableStack } from "@whatwg-node/disposablestack"

// function disposableTimer(callback: () => void, interval: number): Disposable {
//   const timer = setTimeout(callback, interval);
//   return {
//     [Symbol.dispose]() {
//       clearTimeout(timer);
//       console.log("timer disposed");
//     },
//   };
// }

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
