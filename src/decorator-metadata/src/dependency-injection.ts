// /**
//  * Injectable 데코레이터
//  * 클래스를 DI 컨테이너에 등록합니다.
//  * @param token 클래스 이름
//  * @returns 데코레이터 함수
//  */
// function Injectable(token?: string) {
//   return function (target: any) {
//     const registry = new Map();
//     // token: Logger, target.name: LoggerService, target: LoggerService 클래스
//     registry.set(token || target.name, target);

//     // 환경에 상관없이 사용할 수 있도록 globalThis에 글로벌 컨테이너를 설정합니다.
//     (globalThis as any).diContainer =
//       (globalThis as any).diContainer || new Map();

//     // 글로벌 컨테이너에 등록합니다.
//     for (const [key, value] of registry) {
//       (globalThis as any).diContainer.set(key, value);
//     }
//   };
// }

// /**
//  * Inject 데코레이터
//  * 클래스 필드에 DI로 객체의 인스턴스를 주입합니다.
//  * @param token 클래스 이름
//  * @returns 데코레이터 함수
//  */
// function Inject(token: string) {
//   return function (target: any, context: ClassFieldDecoratorContext) {
//     return function (this: any, initialValue: any) {
//       // Inject 데코레이터를 전달되는 token(ex: Logger)에 해당하는 서비스 클래스를 찾습니다.
//       const container = (globalThis as any).diContainer;
//       const serviceClass = container.get(token);

//       if (!serviceClass) {
//         throw new Error(`컨테이너에서 ${token} 클래스를 찾을 수 없습니다.`);
//       }

//       return new serviceClass();
//     };
//   };
// }

// /**
//  * LoggerService 클래스
//  */
// @Injectable("Logger")
// class LoggerService {
//   constructor() {
//     console.log("LoggerService constructor");
//   }

//   log(message: string) {
//     console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
//   }
// }

// /**
//  * DatabaseService 클래스
//  */
// @Injectable("Database")
// class DatabaseService {
//   @Inject("Logger")
//   private logger!: LoggerService;

//   query(sql: string) {
//     this.logger.log(`Executing: ${sql}`);
//     return { rows: [] };
//   }
// }

// /**
//  * UserService 클래스
//  */
// @Injectable("UserService")
// class UserService {
//   @Inject("Database")
//   private db!: DatabaseService;

//   @Inject("Logger")
//   private logger!: LoggerService;

//   getUser(id: number) {
//     this.logger.log(`Getting user ${id}`);
//     return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
//   }
// }

// /**
//  * 사용 예제
//  */
// const userService = new UserService();
// userService.getUser(123);
