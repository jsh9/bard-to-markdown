function cleanUpString(inputString) {
  return trimEachLine(
    trimAndAddTrailingNewline(
      consolidateEmptyLines(inputString),
    ),
  );
}

function consolidateEmptyLines(inputString) {
  return inputString.replace(/\n{3,}/g, '\n\n');
}

function trimAndAddTrailingNewline(inputString) {
  return inputString.trim() + '\n';
}

function trimEachLine(str) {
  let lines = str.split('\n');
  let trimmedLines = lines.map((line) => line.trimRight());
  let trimmedStr = trimmedLines.join('\n');
  return trimmedStr;
}

module.exports = cleanUpString;
