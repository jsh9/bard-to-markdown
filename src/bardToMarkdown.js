const consoleSave = require('./utils/consoleSave');
const parseElements = require('./utils/parseElements');

(function chatGptToMarkdown() {
  const questions = document.querySelectorAll("[class*='query-text']");
  const answers = document.querySelectorAll("[class*='model-response-text']");
  const questionsMd = parseElements(questions);
  const answersMd = parseElements(answers);

  if (typeof answersMd === 'string' && answersMd.trim().length > 0) {
    consoleSave(console, 'md');
    console.save(answersMd);
  }

  return answersMd;
})();
