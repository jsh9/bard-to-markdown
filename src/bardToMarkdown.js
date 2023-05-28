const consoleSave = require('./utils/consoleSave');
const extractAndParse = require('./utils/extractAndParse');

(function chatGptToMarkdown() {
  markdown = extractAndParse(document);

  if (typeof markdown === 'string' && markdown.trim().length > 0) {
    consoleSave(console, 'md');
    console.save(markdown);
  }

  return markdown;
})();
