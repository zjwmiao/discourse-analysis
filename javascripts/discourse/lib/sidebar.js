import $ from "jquery";
import { onNodeInserted } from "./utils.js";

export function reportSidebarClick() {
  onNodeInserted("#sidebar-section-content-categories", (node) => {
    $(node)
      .children()
      .on("click", (ev) => {
        window._oaReport("click", {
          target: ev.currentTarget.textContent.trim(),
          type: "类别",
          module: "sidebar",
          $url: location.href,
        });
      });
  });
  onNodeInserted("#sidebar-section-content-tags", (node) => {
    $(node)
      .children()
      .on("click", (ev) => {
        window._oaReport("click", {
          target: ev.currentTarget.textContent.trim(),
          type: "标签",
          module: "sidebar",
          $url: location.href,
        });
      });
  });
}
