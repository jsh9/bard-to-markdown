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
  ['nested_bullet_points.html', 'nested_bullet_points.md'],
  ['block_quotes_0.html', 'block_quotes_0.md'],
  ['table_and_paragraphs.html', 'table_and_paragraphs.md'],
  ['table_with_complex_cells.html', 'table_with_complex_cells.md'],
])('%s => %s', (htmlFileName, mdFileName) => {
  const inputHtml = fs.readFileSync(testCaseDir + htmlFileName, encoding);
  const dom = new JSDOM(inputHtml);
  global.document = dom.window.document;
  parsedMd = extractAndParse(dom.window.document);
  const expectedMd = fs.readFileSync(testCaseDir + mdFileName, encoding);
  expect(parsedMd).toEqual(expectedMd);
});
