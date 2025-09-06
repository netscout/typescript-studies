// Symbol.metadata polyfill
(Symbol as any).metadata ??= Symbol("Symbol.metadata");

// 매우 간단한 예제를 위한 Context 인터페이스
interface Context {
  name: string;
  metadata: Record<PropertyKey, unknown>;
}

/**
 * 데코레이터 메타데이터에 필드의 이름을 추가하는 데코레이터
 * @param _target 데코레이터가 적용된 클래스
 * @param context 데코레이터 컨텍스트
 */
function setMetadata(_target: any, context: Context) {
  // 데코레이터 메타데이터에 해당 필드의 이름을 추가합니다.
  context.metadata[context.name] = true;
}

class SomeClass {
  @setMetadata
  foo = 123;

  @setMetadata
  accessor bar = "hello!";

  @setMetadata
  baz() {}
}

// 데코레이터 메타데이터를 확인합니다.
const ourMetadata = SomeClass[Symbol.metadata];
console.log(JSON.stringify(ourMetadata));
// 출력: { "bar": true, "baz": true, "foo": true }
