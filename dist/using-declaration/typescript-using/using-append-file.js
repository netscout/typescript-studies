"use strict";
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class FileDescriptor {
    fd;
    constructor(filePath, mode) {
        this.fd = fs_1.default.openSync(filePath, mode);
    }
    get descriptor() {
        return this.fd;
    }
    /**
     * 파일 디스크립터가 선언된 스코프를 벗어날 때, 자동으로 파일 디스크립터를 해제합니다.
     */
    [Symbol.dispose]() {
        if (this.fd !== null) {
            fs_1.default.closeSync(this.fd);
            console.log("File descriptor closed automatically");
        }
    }
}
function appendToFileWithUsing(filePath, content) {
    try {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            // using 카워드로 선언된 객체는 선언된 스코프를 벗어날 때 자동으로 Symbol.dispose를 호출합니다.
            const file = __addDisposableResource(env_1, new FileDescriptor(filePath, "a"), false);
            const buffer = Buffer.from(content, "utf8");
            fs_1.default.writeSync(file.descriptor, buffer);
            console.log(`Successfully appended to ${filePath}`);
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    }
    catch (error) {
        console.error("Error appending to file:", error);
        // 에러가 발생하더라도 파일 디스크립터는 자동으로 해제됩니다!
    }
}
appendToFileWithUsing("test.txt", "Hello, world!");
appendToFileWithUsing("test.txt", "Hello, World!");
