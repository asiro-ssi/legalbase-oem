(function () {
  "use strict";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildAnswerHtml(paragraphs) {
    return paragraphs.map(function (p) {
      var lines = p.split("\n");
      var html = lines.map(function (line, i) {
        return i === 0 ? escapeHtml(line) : "<br>" + escapeHtml(line);
      }).join("");
      return '<p class="paragraph-block">' + html + "</p>";
    }).join("");
  }

  function buildItem(item) {
    return (
      "<details class=\"qa-item\">" +
        "<summary>" +
          "<span class=\"q-badge\">Q</span>" +
          "<span class=\"q-text\">" + escapeHtml(item.q) + "</span>" +
          "<span class=\"q-arrow\">▼</span>" +
        "</summary>" +
        "<div class=\"answer-area\">" +
          "<div class=\"answer-inner\">" +
            "<span class=\"a-badge\">A</span>" +
            "<div class=\"a-body\">" + buildAnswerHtml(item.a) + "</div>" +
          "</div>" +
        "</div>" +
      "</details>"
    );
  }

  function buildCategory(cat) {
    return (
      "<section class=\"category-section\">" +
        "<div class=\"category-header\">" +
          "<span class=\"badge\">" + escapeHtml(cat.label) + "</span>" +
          "<span class=\"badge-count\">" + cat.items.length + "件</span>" +
        "</div>" +
        "<div class=\"accordion-list\">" +
          cat.items.map(buildItem).join("") +
        "</div>" +
      "</section>"
    );
  }

  function showError(root, msg) {
    root.innerHTML =
      "<div class=\"error-box\">" +
        "<p class=\"error-title\">⚠️ データの取得に失敗しました</p>" +
        "<p class=\"error-msg\">" + escapeHtml(msg) + "</p>" +
      "</div>";
  }

  function showLoading(root) {
    root.innerHTML = "<p class=\"loading\">読み込み中...</p>";
  }

  async function loadFaq(root) {
    showLoading(root);
    try {
      var res = await fetch("/api/faq");
      if (!res.ok) {
        var err = await res.json().catch(function () { return { error: res.statusText }; });
        showError(root, err.error || res.statusText);
        return;
      }
      var data = await res.json();
      root.innerHTML = data.categories.map(buildCategory).join("");
    } catch (e) {
      showError(root, e.message);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("faq-root");
    if (root) loadFaq(root);
  });
})();
