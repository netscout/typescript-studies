// Symbol.metadata 를 지원하기 위한 polyfill
(Symbol as any).metadata ??= Symbol("Symbol.metadata");

// 데코레이터 메타데이터 사용할 심볼
const INJECTION_TOKENS_KEY = Symbol("injection-tokens");

/**
 * Injectable 데코레이터
 * 클래스를 DI 컨테이너에 등록합니다.
 * @param token 클래스 이름
 * @returns 데코레이터 함수
 */
function Injectable(token?: string) {
  return function (target: any) {
    const registry = new Map();
    // token: Logger, target.name: LoggerService, target: LoggerService 클래스
    registry.set(token || target.name, target);

    // 환경에 상관없이 사용할 수 있도록 globalThis에 글로벌 컨테이너를 설정합니다.
    (globalThis as any).diContainer =
      (globalThis as any).diContainer || new Map();

    // 글로벌 컨테이너에 등록합니다.
    for (const [key, value] of registry) {
      (globalThis as any).diContainer.set(key, value);
    }
  };
}

/**
 * Inject 데코레이터
 * 클래스 필드에 DI로 객체의 인스턴스를 주입합니다.
 * @param token 클래스 이름
 * @returns 데코레이터 함수
 */
function Inject(token: string) {
  return function (target: any, context: ClassFieldDecoratorContext) {
    const fieldName = context.name as string;
    console.log(`\n=== '${fieldName}' 필드에 @Inject('${token}') 설정 중 ===`);

    const metadata = context.metadata;

    // 메타데이터 객체에 injection tokens 정보가 없으면 생성
    metadata[INJECTION_TOKENS_KEY] ??= new Map<string, string>();

    // TypeScript의 메타데이터에 필드명과 토큰 매핑 저장
    const injectionTokens = metadata[INJECTION_TOKENS_KEY] as Map<
      string,
      string
    >;
    injectionTokens.set(fieldName, token);

    console.log("→ 메타데이터에 저장된 의존성 주입 정보:", injectionTokens);

    return function (this: any, initialValue: any) {
      const container = (globalThis as any).diContainer;
      const serviceClass = container.get(token);
      if (!serviceClass) {
        throw new Error(`컨테이너에서 ${token} 클래스를 찾을 수 없습니다.`);
      }
      return new serviceClass();
    };
  };
}

// 메타데이터를 확인하기 위한 유틸리티 함수들

/**
 * 클래스 인스턴스에서 TypeScript 메타데이터로부터 DI 정보를 확인합니다.
 * @param instance 클래스 인스턴스
 * @returns DI로 주입된 정보
 */
function getInjectionInfo(instance: object): Map<string, string> | undefined {
  const constructor = instance.constructor;
  const metadata = (constructor as any)[Symbol.metadata];

  if (!metadata) {
    return undefined;
  }

  return metadata[INJECTION_TOKENS_KEY] as Map<string, string>;
}

/**
 * 클래스의 생성자를 통해 TypeScript 메타데이터로부터 DI 정보를 확인합니다.
 * @param constructor 클래스 생성자
 * @returns DI로 주입된 정보
 */
function getClassInjectionInfo(
  constructor: Function
): Map<string, string> | undefined {
  const metadata = (constructor as any)[Symbol.metadata];

  if (!metadata) {
    return undefined;
  }

  return metadata[INJECTION_TOKENS_KEY] as Map<string, string>;
}

/**
 * 클래스 인스턴스에서 TypeScript 메타데이터의 DI 정보를 디버깅합니다.
 * @param instance 클래스 인스턴스
 */
function debugInstance(instance: object) {
  const className = instance.constructor.name;
  const injections = getInjectionInfo(instance);

  console.log(`\n=== ${className} 메타데이터의 의존성 주입 정보 ===`);
  if (injections && injections.size > 0) {
    for (const [field, token] of injections) {
      console.log(`  ${field} <- ${token}`);
    }
  } else {
    console.log("  메타데이터에 의존성 주입 정보가 없습니다.");
  }
}

/**
 * 클래스의 전체 TypeScript 메타데이터 구조를 확인합니다.
 * @param constructor 클래스 생성자
 */
function inspectMetadata(constructor: Function) {
  const metadata = (constructor as any)[Symbol.metadata];
  const className = constructor.name;

  console.log(`\n=== ${className} 메타데이터 구조 ===`);

  if (!metadata) {
    console.log("  메타데이터가 없습니다.");
    return;
  }

  const injectionTokens = metadata[INJECTION_TOKENS_KEY];
  if (injectionTokens) {
    console.log("  의존성 주입 토큰:", injectionTokens);
  } else {
    console.log("  의존성 주입 토큰이 없습니다.");
  }
}

/**
 * LoggerService 클래스
 */
@Injectable("Logger")
class LoggerService {
  log(message: string) {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
  }
}

/**
 * DatabaseService 클래스
 */
@Injectable("Database")
class DatabaseService {
  @Inject("Logger")
  private logger!: LoggerService;

  query(sql: string) {
    this.logger.log(`Executing: ${sql}`);
    return { rows: [] };
  }
}

/**
 * UserService 클래스
 */
@Injectable("UserService")
class UserService {
  @Inject("Database")
  private db!: DatabaseService;

  @Inject("Logger")
  private logger!: LoggerService;

  getUser(id: number) {
    this.logger.log(`Getting user ${id}`);
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// DEMO: 데코레이터 메타데이터를 통한 DI 정보 확인
console.log("=== 데코레이터 메타데이터를 통한 DI 정보 확인 ===");

// 전체 메타데이터 구조 확인
inspectMetadata(LoggerService);
inspectMetadata(DatabaseService);
inspectMetadata(UserService);

// 생성된 클래스에서 TypeScript 메타데이터의 DI 정보 확인
const userService = new UserService();
debugInstance(userService);
debugInstance(new DatabaseService());
debugInstance(new LoggerService());

console.log("\n=== 서비스 실행 ===");
userService.getUser(123);
