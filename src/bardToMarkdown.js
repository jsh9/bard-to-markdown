const consoleSave = require('./utils/consoleSave');
const parseElements = require('./utils/parseElements');

(function chatGptToMarkdown() {
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

  if (typeof markdown === 'string' && markdown.trim().length > 0) {
    consoleSave(console, 'md');
    console.save(markdown);
  }

  return markdown;
})();
