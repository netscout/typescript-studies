// string-utils.mjs
console.log("string-utils.mjs 로딩 중");

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function reverse(str) {
  return str.split("").reverse().join("");
}

export function truncate(str, length) {
  return str.length > length ? str.substring(0, length) + "..." : str;
}
