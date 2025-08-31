"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
function loggedMethod(headMessage = "🚩") {
    return function (originalMethod, context) {
        const methodName = String(context.name);
        function replacementMethod(...args) {
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
            }
            catch (error) {
                console.log(`${headMessage} Exiting method '${methodName}' with error.`);
                throw error;
            }
        }
        return replacementMethod;
    };
}
let MyClass = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _myMethod_decorators;
    let _myAsyncMethod_decorators;
    return _a = class MyClass {
            myMethod() {
                console.log("myMethod called");
                //throw new Error("test");
            }
            // 비동기 메서드
            async myAsyncMethod() {
                console.log("async method start");
                await new Promise((res, rej) => setTimeout(() => {
                    rej(new Error("test"));
                }, 500));
                console.log("async method end");
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _myMethod_decorators = [loggedMethod()];
            _myAsyncMethod_decorators = [loggedMethod()];
            __esDecorate(_a, null, _myMethod_decorators, { kind: "method", name: "myMethod", static: false, private: false, access: { has: obj => "myMethod" in obj, get: obj => obj.myMethod }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _myAsyncMethod_decorators, { kind: "method", name: "myAsyncMethod", static: false, private: false, access: { has: obj => "myAsyncMethod" in obj, get: obj => obj.myAsyncMethod }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
const myClass = new MyClass();
myClass.myMethod();
myClass.myAsyncMethod();
