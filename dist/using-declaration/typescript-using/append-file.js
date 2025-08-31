"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function appendToFile(filePath, content) {
    let fd = null;
    try {
        // Open file for appending
        fd = fs_1.default.openSync(filePath, "a");
        const buffer = Buffer.from(content, "utf8");
        fs_1.default.writeSync(fd, buffer);
        console.log(`텍스트 추가 성공 ${filePath}`);
    }
    catch (error) {
        console.error("텍스트 추가 실패:", error);
    }
    finally {
        if (fd !== null) {
            fs_1.default.closeSync(fd);
        }
    }
}
appendToFile("test.txt", "Hello, world!");
appendToFile("test.txt", "Hello, World!");
