const { appendFileSync, unlinkSync, existsSync } = require("fs");

const logFilePath = "./log.txt";
if (existsSync(logFilePath)) unlinkSync(logFilePath);

exports.log = function log(obj) {
  // console.log(obj);
  // appendFileSync(logFilePath, JSON.stringify(obj, null, 2));
};
