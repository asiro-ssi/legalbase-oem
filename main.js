(function () {
  "use strict";

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // HTMLタグ（<strong>等）を含む文字列はそのまま、プレーンテキストは改行のみ変換
  function renderParagraph(raw) {
    // すでにHTMLタグが含まれる場合はそのまま使用（faq-data.js で <strong> を使っている）
    const hasHtml = /<[a-z][\s\S]*>/i.test(raw);
    const lines = raw.split("\n");
    return lines.map(function (line, i) {
      const text = hasHtml ? line : escapeHtml(line);
      return i === 0 ? text : "<br>" + text;
    }).join("");
  }

  function buildAnswerHtml(paragraphs) {
    return paragraphs.map(function (p) {
      return '<p class="paragraph-block">' + renderParagraph(p) + "</p>";
    }).join("");
  }

  function buildNoteHtml(note) {
    if (!note) return "";
    const lines = note.body.split("\n\n");
    const bodyHtml = lines.map(function (block) {
      const subLines = block.split("\n");
      return '<p class="note-block">' + subLines.map(function (line, i) {
        const hasHtml = /<[a-z][\s\S]*>/i.test(line);
        const text = hasHtml ? line : escapeHtml(line);
        return i === 0 ? text : "<br>" + text;
      }).join("") + "</p>";
    }).join("");

    return (
      '<div class="note-box">' +
        '<p class="note-box-title">' + escapeHtml(note.title) + "</p>" +
        '<div class="note-box-body">' + bodyHtml + "</div>" +
      "</div>"
    );
  }

  function buildItem(item, idx) {
    const noteHtml = item.note ? buildNoteHtml(item.note) : "";
    return (
      '<div>' +
        '<details class="qa-item">' +
          '<summary>' +
            '<span class="q-badge">Q</span>' +
            '<span class="q-text">' + escapeHtml(item.q) + "</span>" +
            '<span class="q-arrow">▼</span>' +
          "</summary>" +
          '<div class="answer-area">' +
            '<div class="answer-inner">' +
              '<span class="a-badge">A</span>' +
              '<div class="a-body">' + buildAnswerHtml(item.a) + noteHtml + "</div>" +
            "</div>" +
          "</div>" +
        "</details>" +
      "</div>"
    );
  }

  function buildCategory(cat) {
    const itemsHtml = cat.items.map(buildItem).join("");
    return (
      '<section class="category-section">' +
        '<div class="category-header">' +
          '<span class="badge">' + escapeHtml(cat.label) + "</span>" +
          '<span class="badge-count">' + cat.items.length + "件</span>" +
        "</div>" +
        '<div class="accordion-list">' + itemsHtml + "</div>" +
      "</section>"
    );
  }

  function render() {
    var root = document.getElementById("faq-root");
    if (!root) return;
    root.innerHTML = FAQ_DATA.map(buildCategory).join("");
  }

  document.addEventListener("DOMContentLoaded", render);
})();
