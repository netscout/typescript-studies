import type { A } from "./a";

export class B {
  a: A | undefined;
  constructor() {
    //this.a = new A();
    console.log("B created");
  }
}
