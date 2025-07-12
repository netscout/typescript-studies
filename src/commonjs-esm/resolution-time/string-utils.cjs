// string-utils.js
console.log("string-utils.js 로딩 중");

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function reverse(str) {
  return str.split("").reverse().join("");
}

function truncate(str, length) {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

module.exports = {
  capitalize,
  reverse,
  truncate,
};
