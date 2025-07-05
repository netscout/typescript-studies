import type { B } from "./b";

export class A {
  b: B | undefined;
  constructor() {
    //this.b = new B();
    console.log("A created");
  }
}
