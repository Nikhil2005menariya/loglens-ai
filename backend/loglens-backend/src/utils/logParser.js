exports.parseLog = (rawLogs) => {
  const result = {
    errorType: null,
    message: null,
    files: [],
    severity: "error"
  };

  if (!rawLogs) return result;

  const errorMatch = rawLogs.match(
    /(TypeError|ReferenceError|SyntaxError|MongoError|MongooseError|Error):\s*(.*)/
  );

  if (errorMatch) {
    result.errorType = errorMatch[1];
    result.message = errorMatch[2];
  }

  const fileRegex = /\(?([a-zA-Z0-9_./-]+\.js):(\d+)(?::(\d+))?\)?/g;
  let match;

  while ((match = fileRegex.exec(rawLogs)) !== null) {
    result.files.push({
      filePath: match[1],
      line: Number(match[2]),
      column: match[3] ? Number(match[3]) : null
    });
  }

  return result;
};
