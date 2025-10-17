import $ from "jquery";
import { debounce, onNodeInserted } from "./utils.js";

let searchKey = "";

function onClickSearchInput() {
  window._oaReport("click", {
    type: "search-input",
    module: "search",
    $url: location.href,
  });
}

function onInputSearchInput(ev) {
  window._oaReport("input", {
    type: "search-input",
    module: "search",
    content: ev.currentTarget.value.trim(),
    $url: location.href,
  });
}

function onClickSearchHistory(ev) {
  window._oaReport("click", {
    type: "search-history",
    module: "search",
    target: ev.currentTarget.textContent.trim(),
    $url: location.href,
  });
}

function onClearSearchHistoryClick() {
  window._oaReport("click", {
    type: "clear-search-history",
    module: "search",
    $url: location.href,
  });
}

function onClickSuggestion(ev) {
  window._oaReport("click", {
    type: "search-suggestion",
    module: "search",
    target: ev.currentTarget.textContent.trim(),
    searchContent: searchKey,
    detail: ev.currentTarget.href,
    $url: location.href,
  });
}

function onClickSearchResultTopic(ev) {
  const current$ = $(ev.currentTarget);
  window._oaReport("click", {
    type: "search-result",
    module: "search",
    target: current$.find(".first-line").text().trim(),
    searchContent: searchKey,
    path: ev.currentTarget.href,
    categories: current$.find(".badge-category__name").text().trim(),
    tags: current$.find(".discourse-tags").text().trim(),
    $url: location.href,
  });
}

function onAIClick(ev) {
  if (ev.currentTarget.disabled) {
    return;
  }
  window._oaReport("click", {
    type: "ai-toggle",
    module: "search",
    searchContent: decodeURIComponent(location.search.match(/\bq=([^&]+)/)[1]),
    detail: ev.currentTarget.getAttribute("aria-checked"),
    $url: location.href,
  });
}

// 搜索结果页帖子的点击
function onClickSearchResultPageTopic(ev) {
  let link = ev.target;
  if (link === ev.currentTarget) {
    return;
  }
  while (!link.classList.contains("search-link")) {
    link = link.parentElement;
    if (link === ev.currentTarget || !link) {
      return;
    }
  }

  let root = link;
  while (!root.classList.contains("fps-result")) {
    root = root.parentElement;
    if (root === ev.currentTarget || !root) {
      return;
    }
  }
  const rank = [...root.parentElement.children].indexOf(root) + 1;

  const target$ = $(root);
  window._oaReport("click", {
    type: "search-result",
    module: "search",
    target: $(link).text().trim(),
    searchContent: decodeURIComponent(location.search.match(/\bq=([^&]+)/)[1]),
    rank,
    path: $(link).attr("href"),
    categories: target$.find(".badge-category__name").text().trim(),
    tags: target$.find(".discourse-tags").text().trim(),
    $url: location.href,
  });
}

export default function reportSearch() {
  onNodeInserted(".search-input-wrapper input", (node) => {
    $(node).on("focus", onClickSearchInput);
    $(node).on("input", debounce(onInputSearchInput, 300));
    $(node).on("keydown", (ev) => {
      if (ev.key === "Enter") {
        window._oaReport("input", {
          type: "search",
          module: "search",
          content: ev.currentTarget.value.trim(),
          $url: location.href,
        });
      }
    });
  });

  // 历史记录点击
  onNodeInserted(".search-menu-panel .search-menu-recent", (node) => {
    $(node)
      .children(".search-menu-assistant-item")
      .on("click", onClickSearchHistory);
    // 清除历史记录
    $(node)
      .find(".clear-recent-searches")
      .on("click", onClearSearchHistoryClick);
  });

  // 联想/帖子结果点击
  onNodeInserted(
    ".search-menu-panel .results div[class^=search-result]",
    (node) => {
      searchKey = $(".search-input-wrapper input").get(0).value;
      if (node.classList.contains("search-result-topic")) {
        // 话题结果点击
        $(node).find(".list .item a").on("click", onClickSearchResultTopic);
      } else {
        // 联想结果点击
        $(node).find(".list .item a").on("click", onClickSuggestion);
      }
    }
  );

  window.addEventListener("afterRouteChange", ({ detail }) => {
    if (detail.to === "/search") {
      // 监听是否显示AI搜索结果的点击
      onNodeInserted(
        ".search-advanced .semantic-search__results-toggle",
        (el) => {
          $(el).on("click", onAIClick);
        }
      );

      onNodeInserted(
        ".search-results .fps-result:first-child",
        () => {
          $(".search-results .fps-result-entries").on(
            "click",
            onClickSearchResultPageTopic
          );
        },
        true
      );
    }
  });
}
