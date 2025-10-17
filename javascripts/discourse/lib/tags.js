import { onNodeInserted } from "./utils";

function allTagsClick() {
  window._oaReport("click", {
    target: this.textContent.trim(),
    module: "all-tags",
    $url: location.href,
  });
}

export function reportTagsClick() {
  window.addEventListener("afterRouteChange", ({ detail }) => {
    if (detail.to === "/tags") {
      onNodeInserted(
        ".all-tag-lists .tags-list",
        (node) => {
          node.querySelectorAll(".tag-box")?.forEach((el) => {
            el.querySelector("a").addEventListener("click", allTagsClick);
          });
        },
        true
      );
    }
  });
}
