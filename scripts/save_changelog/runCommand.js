const { exec } = require("child_process");

module.exports = function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }

      if (stderr) {
        return reject(new Error(stderr.trim()));
      }

      return resolve(stdout.trim());
    });
  });
};
