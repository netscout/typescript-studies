import fs from "fs";

class FileDescriptor implements Disposable {
  private fd: number;

  constructor(filePath: string, mode: string) {
    this.fd = fs.openSync(filePath, mode);
  }

  get descriptor(): number {
    return this.fd;
  }

  /**
   * 파일 디스크립터가 선언된 스코프를 벗어날 때, 자동으로 파일 디스크립터를 해제합니다.
   */
  [Symbol.dispose](): void {
    if (this.fd !== null) {
      fs.closeSync(this.fd);
      console.log("File descriptor closed automatically");
    }
  }
}

function appendToFileWithUsing(filePath: string, content: string): void {
  try {
      // using 카워드로 선언된 객체는 선언된 스코프를 벗어날 때 자동으로 Symbol.dispose를 호출합니다.
      using file = new FileDescriptor(filePath, "a");
      
      const buffer = Buffer.from(content, "utf8");
      fs.writeSync(file.descriptor, buffer);
      
    console.log(`Successfully appended to ${filePath}`);
  } catch (error) {
    console.error("Error appending to file:", error);
    // 에러가 발생하더라도 파일 디스크립터는 자동으로 해제됩니다!
  }
}

appendToFileWithUsing("test.txt", "Hello, world!");
appendToFileWithUsing("test.txt", "Hello, World!");