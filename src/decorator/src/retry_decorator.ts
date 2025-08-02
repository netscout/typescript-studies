/**
 * 재시도 옵션 인터페이스
 */
interface RetryOptions {
  maxRetries?: number; // 최대 재시도 횟수
  initialDelay?: number; // 초기 대기 시간 (밀리초)
}

/**
 * 특정 시간동안 대기하는 함수
 * @param ms - 대기 시간 (밀리초)
 * @returns 대기 완료 후 프로미스 반환
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 재시도 데코레이터
 * @param options - 재시도 옵션
 * @returns 재시도 데코레이터 함수
 */
function retry(options: RetryOptions = {}) {
  const { maxRetries = 3, initialDelay = 1000 } = options;

  return function (
    originalMethod: Function,
    context: ClassMethodDecoratorContext
  ) {
    const methodName = String(context.name);

    async function replacementMethod(this: any, ...args: any[]) {
      let lastError: any;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const result = originalMethod.apply(this, args);

          // 비동기 메서드의 경우 await 키워드를 사용하여 비동기 작업 완료를 기다림
          if (result && typeof result.then === "function") {
            return await result;
          }

          return result;
        } catch (error) {
          lastError = error;

          if (attempt < maxRetries) {
            // Exponential backoff: 대기 시간 = initialDelay * 2^attempt
            const delay = initialDelay * Math.pow(2, attempt);
            const errorMessage =
              error instanceof Error ? error.message : String(error);

            console.log(
              `🔄 ${delay}ms 후 재시도 ${
                attempt + 1
              }/${maxRetries} - 오류: ${errorMessage}`
            );
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
class TestService {
  private asyncAttemptCount = 0;
  private syncAttemptCount = 0;

  // 비동기 메서드에 적용(마지막에 성공하는 케이스)
  @retry({ maxRetries: 3, initialDelay: 500 })
  async unreliableAsyncMethod() {
    this.asyncAttemptCount++;
    console.log(
      `📡 비동기 메서드 테스트 (2번 실패 후 성공) - 시도 ${this.asyncAttemptCount}`
    );

    if (this.asyncAttemptCount < 3) {
      throw new Error(
        `비동기 메서드 테스트 (2번 실패 후 성공) - 시도 ${this.asyncAttemptCount} 회 실패`
      );
    }

    console.log("✅ 비동기 메서드 테스트 (2번 실패 후 성공) - 성공!");

    return "비동기 메서드 테스트 (2번 실패 후 성공) - 성공!";
  }
}

// 결과 테스트
(async () => {
  const service = new TestService();

  console.log("=== 비동기 메서드 테스트 (2번 실패 후 성공) ===");
  try {
    const result = await service.unreliableAsyncMethod();
    console.log("Result:", result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("Final error:", errorMessage);
  }
})();
