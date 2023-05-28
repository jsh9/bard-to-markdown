const fs = require('fs');
const { JSDOM } = require('jsdom');
const extractAndParse = require('../../src/utils/extractAndParse');
const testCaseDir = './tests/utils/test_cases/';
const encoding = 'utf8';

// We are mocking Node because it's only available in the browser
global.Node = {
  ELEMENT_NODE: 1,
  TEXT_NODE: 3,
};

test.each([
  ['code_block.html', 'code_block.md'],
  ['table.html', 'table.md'],
])('%s => %s', (htmlFileName, mdFileName) => {
  const inputHtml = fs.readFileSync(testCaseDir + htmlFileName, encoding);
  const dom = new JSDOM(inputHtml);
  global.document = dom.window.document;
  parsedMd = extractAndParse(dom.window.document);
  const expectedMd = fs.readFileSync(testCaseDir + mdFileName, encoding);
  expect(parsedMd).toEqual(expectedMd);
});
