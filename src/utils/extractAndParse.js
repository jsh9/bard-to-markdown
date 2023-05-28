const parseElements = require('./parseElements');

function extractAndParse(document) {
  const questions = document.querySelectorAll("[class*='query-text']");
  const answers = document.querySelectorAll("[class*='model-response-text']");

  markdown = '';
  minLength = Math.min(questions.length, answers.length);
  for (var i = 0; i < minLength; i++) {
    if (i > 0) {
      // Note: the newline at the beginning of the string is necessary
      markdown += '\n----------\n';
    }
    markdown += '\n## Question\n\n'
    markdown += parseElements([questions[i]]);
    markdown += '\n## Answer\n\n'
    markdown += parseElements([answers[i]]);
  }

  return markdown.trim() + '\n';  // keep newline at the end of file
}

module.exports = extractAndParse;
