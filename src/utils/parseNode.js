/*
A part of this file is adapted from: https://github.com/ryanschiang/chatgpt-export/blob/b5edd91ff21c07653570d57f06370ea6cdb4ef9f/src/exportMarkdown.js

The original code repository has MIT license. Below is the original license:

Copyright 2023 Ryan Chiang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

const replaceString = require('./replaceString');
const blockQuoteUtils = require('./blockQuoteUtils');

function parseNode(node, level) {
  var nodeMarkdown = '';

  if (node.nodeType === Node.TEXT_NODE) {
    nodeMarkdown += node.textContent;
    nodeMarkdown += '\n\n';
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const childNodes = node.childNodes;

    if (node.className.includes('markdown prose')) {
      nodeMarkdown += `## Answer\n\n`;
    }

    if (node.tagName === 'OL') {
      nodeMarkdown += parseOrderedList(node, level);
    } else if (node.tagName === 'UL') {
      nodeMarkdown += parseUnorderedList(node, level);
    } else if (['P', 'LI', 'DIV'].includes(node.tagName)) {
      for (var i = 0; i < childNodes.length; i++) {
        const childNode = childNodes[i];

        if (childNode.nodeType == Node.TEXT_NODE) {
          nodeMarkdown += childNode.textContent;
        }

        if (childNode.nodeType === Node.ELEMENT_NODE) {
          const tag = childNode.tagName;

          if (['P', 'LI', 'STRONG', 'EM', 'DEL'].includes(tag)) {
            nodeMarkdown += parseParagraph(childNode);
          }
          if (tag === 'BLOCKQUOTE') {
            nodeMarkdown += parseBlockQuote(childNode, level);
          }
          if (tag === 'OL') {
            nodeMarkdown += parseOrderedList(childNode, level);
          }
          if (tag === 'UL') {
            nodeMarkdown += parseUnorderedList(childNode, level);
          }
          if (tag === 'PRE') {
            nodeMarkdown += parseCodeBlock(childNode);
          }
          if (tag === 'TABLE') {
            nodeMarkdown += parseTable(childNode);
          }
          if (tag === 'CODE') {
            nodeMarkdown += parseInlineCode(childNode);
          }
          if (tag === 'DIV') {
            let tables = childNode.querySelectorAll('table');
            for (let j = 0; j < tables.length; j++) {
              nodeMarkdown += parseTable(tables[j], level);
            }
          }
          if (tag === 'CODE-BLOCK') {
            let codeBlocks = childNode.querySelectorAll('pre');
            console.log(codeBlocks);
            for (let j = 0; j < codeBlocks.length; j++) {
              nodeMarkdown += parseCodeBlock(codeBlocks[j], level);
            }
          }

          if (!['CODE', 'STRONG', 'EM', 'DEL'].includes(tag)) {
            nodeMarkdown += '\n\n';
          }
        }
      }
    } else {
      throw new Error(
        `Edge case encountered: node.tagName: ${node.tagName}\n` +
          'Please contact the author.',
      );
    }
  }
  return nodeMarkdown;
}

function parseParagraph(node) {
  return replaceString(node.outerHTML);
}

function parseBlockQuote(node, level) {
  var blockQuoteMarkdown = '\n';
  const spaces = getSpaces(level);
  const quoteHead = blockQuoteUtils.makeQuoteHead(spaces);
  const childNodes = node.childNodes;

  for (var i = 0; i < childNodes.length; i++) {
    const blockQuoteNode = childNodes[i];
    if (blockQuoteNode.tagName === 'BLOCKQUOTE') {
      blockQuoteMarkdown += parseBlockQuote(blockQuoteNode, level);
    } else {
      blockQuoteMarkdown += '\n' + parseNode(blockQuoteNode, level + 1) + '\n';
    }
  }

  const withQuoteHead =
    quoteHead +
    blockQuoteUtils
      .trimAndAddPaddingNewlines(blockQuoteMarkdown)
      .replace(/\n/g, quoteHead);
  const qhReplaced = blockQuoteUtils.replaceQuoteHeadFromEnd(withQuoteHead);
  const qhRemoved = blockQuoteUtils.removeRedundantQuoteHeads(qhReplaced);
  return qhRemoved;
}

function parseOrderedList(node, level) {
  var orderedListMarkdown = '\n';
  const spaces = getSpaces(level);
  const childNodes = node.childNodes;

  for (var i = 0; i < childNodes.length; i++) {
    const listItemNode = childNodes[i];

    if (
      listItemNode.nodeType === Node.ELEMENT_NODE &&
      listItemNode.tagName === 'LI'
    ) {
      orderedListMarkdown += `${spaces}${i + node.start}. ${parseNode(
        listItemNode,
        level + 1,
      )}\n`;
    }
  }

  return orderedListMarkdown + '\n';
}

function parseUnorderedList(node, level) {
  var unorderedListMarkdown = '\n';
  const spaces = getSpaces(level);
  const childNodes = node.childNodes;

  for (var i = 0; i < childNodes.length; i++) {
    const listItemNode = childNodes[i];

    if (
      listItemNode.nodeType === Node.ELEMENT_NODE &&
      listItemNode.tagName === 'LI'
    ) {
      unorderedListMarkdown += `${spaces}- ${parseNode(
        listItemNode,
        level + 1,
      ).trimStart()}\n`;
    }
  }

  return unorderedListMarkdown + '\n';
}

function parseCodeBlock(node) {
  console.log(node.textContent);
  const code = node.textContent.trim();
  return `\`\`\`\n${code}\n\`\`\`\n`;
}

function parseInlineCode(node) {
  return '`' + node.textContent + '`';
}

function parseTable(node) {
  let tableMarkdown = '\n';

  for (var i = 0; i < node.childNodes.length; i++) {
    tableSectionNode = node.childNodes[i];
    if (
      tableSectionNode.nodeType === Node.ELEMENT_NODE &&
      (tableSectionNode.tagName === 'THEAD' ||
        tableSectionNode.tagName === 'TBODY')
    ) {
      // Get table rows
      let tableRows = '';

      for (var j = 0; j < tableSectionNode.childNodes.length; j++) {
        tableRowNode = tableSectionNode.childNodes[j];
        if (
          tableRowNode.nodeType === Node.ELEMENT_NODE &&
          tableRowNode.tagName === 'TR'
        ) {
          // Get table cells
          let tableCells = '';

          for (var k = 0; k < tableRowNode.childNodes.length; k++) {
            tableCellNode = tableRowNode.childNodes[k];

            if (
              tableCellNode.nodeType === Node.ELEMENT_NODE &&
              (tableCellNode.tagName === 'TD' || tableCellNode.tagName === 'TH')
            ) {
              tableCells += `| ${replaceString(tableCellNode.outerHTML)} `;
            }
          }

          tableRows += `${tableCells}|\n`;

          if (j === 0) {
            headerRowDivider = '|';
            for (var k = 0; k < tableRowNode.childNodes.length; k++) {
              headerRowDivider += '---|';
            }
            headerRowDivider += '\n';
            tableRows += headerRowDivider;
          }
        }
      }

      tableMarkdown += tableRows;
    }
  }

  return tableMarkdown;
}

function getSpaces(level) {
  if (level === undefined) {
    throw new Error('Please pass in `level` to `getSpaces()`');
  }

  // Multiply the level by 3 to get the number of spaces
  // We use 3 instead of 2 or 4 here, because:
  //    * 2 only sufficient for adding a level for unordered list
  //      (for ordered list, we need at least 3)
  //    # 4 is too much because it sometimes creates a quoted code block
  const numSpaces = level * 3;

  // Create a new string with the specified number of spaces
  return ' '.repeat(numSpaces);
}

module.exports = parseNode;
