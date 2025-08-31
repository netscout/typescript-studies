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
/**
 * 특정 시간동안 대기하는 함수
 * @param ms - 대기 시간 (밀리초)
 * @returns 대기 완료 후 프로미스 반환
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * 재시도 데코레이터
 * @param options - 재시도 옵션
 * @returns 재시도 데코레이터 함수
 */
function retry(options = {}) {
    const { maxRetries = 3, initialDelay = 1000 } = options;
    return function (originalMethod, context) {
        const methodName = String(context.name);
        async function replacementMethod(...args) {
            let lastError;
            for (let attempt = 0; attempt <= maxRetries; attempt++) {
                try {
                    const result = originalMethod.apply(this, args);
                    // 비동기 메서드의 경우 await 키워드를 사용하여 비동기 작업 완료를 기다림
                    if (result && typeof result.then === "function") {
                        return await result;
                    }
                    return result;
                }
                catch (error) {
                    lastError = error;
                    if (attempt < maxRetries) {
                        // Exponential backoff: 대기 시간 = initialDelay * 2^attempt
                        const delay = initialDelay * Math.pow(2, attempt);
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        console.log(`🔄 ${delay}ms 후 재시도 ${attempt + 1}/${maxRetries} - 오류: ${errorMessage}`);
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
let TestService = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _unreliableAsyncMethod_decorators;
    return _a = class TestService {
            constructor() {
                this.asyncAttemptCount = (__runInitializers(this, _instanceExtraInitializers), 0);
                this.syncAttemptCount = 0;
            }
            // 비동기 메서드에 적용(마지막에 성공하는 케이스)
            async unreliableAsyncMethod() {
                this.asyncAttemptCount++;
                console.log(`📡 비동기 메서드 테스트 (2번 실패 후 성공) - 시도 ${this.asyncAttemptCount}`);
                if (this.asyncAttemptCount < 3) {
                    throw new Error(`비동기 메서드 테스트 (2번 실패 후 성공) - 시도 ${this.asyncAttemptCount} 회 실패`);
                }
                console.log("✅ 비동기 메서드 테스트 (2번 실패 후 성공) - 성공!");
                return "비동기 메서드 테스트 (2번 실패 후 성공) - 성공!";
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _unreliableAsyncMethod_decorators = [retry({ maxRetries: 3, initialDelay: 500 })];
            __esDecorate(_a, null, _unreliableAsyncMethod_decorators, { kind: "method", name: "unreliableAsyncMethod", static: false, private: false, access: { has: obj => "unreliableAsyncMethod" in obj, get: obj => obj.unreliableAsyncMethod }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
// 결과 테스트
(async () => {
    const service = new TestService();
    console.log("=== 비동기 메서드 테스트 (2번 실패 후 성공) ===");
    try {
        const result = await service.unreliableAsyncMethod();
        console.log("Result:", result);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log("Final error:", errorMessage);
    }
})();
