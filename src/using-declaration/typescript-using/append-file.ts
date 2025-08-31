import fs from "fs";

function appendToFile(filePath: string, content: string): void {
  let fd: number | null = null;

  try {
    // Open file for appending
    fd = fs.openSync(filePath, "a");

    const buffer = Buffer.from(content, "utf8");
    fs.writeSync(fd, buffer);

    console.log(`텍스트 추가 성공 ${filePath}`);
  } catch (error) {
    console.error("텍스트 추가 실패:", error);
  } finally {
    if (fd !== null) {
      fs.closeSync(fd);
    }
  }
}

appendToFile("test.txt", "Hello, world!");
appendToFile("test.txt", "Hello, World!");
