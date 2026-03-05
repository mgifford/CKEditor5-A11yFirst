(function () {
  const shell = document.getElementById("doc-root");
  if (!shell) return;

  const source = shell.getAttribute("data-source");
  if (!source) {
    shell.innerHTML = '<div class="render-error">No Markdown source configured.</div>';
    return;
  }

  function normalizeLinks(container) {
    const anchors = container.querySelectorAll("a[href]");
    anchors.forEach((a) => {
      const href = a.getAttribute("href");
      if (!href) return;
      if (/^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("#")) return;

      const parts = href.split("#");
      const path = parts[0];
      const hash = parts[1] ? `#${parts[1]}` : "";

      if (path.endsWith(".md")) {
        a.setAttribute("href", `${path.slice(0, -3)}.html${hash}`);
      }
    });
  }

  fetch(source)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Could not load ${source} (${response.status})`);
      }
      return response.text();
    })
    .then((markdown) => {
      if (!window.marked) {
        throw new Error("Markdown renderer is unavailable.");
      }
      marked.setOptions({ gfm: true, breaks: false, headerIds: true, mangle: false });
      shell.innerHTML = marked.parse(markdown);
      normalizeLinks(shell);
      document.querySelectorAll("pre code").forEach((block) => {
        if (window.hljs) {
          window.hljs.highlightElement(block);
        }
      });
    })
    .catch((error) => {
      shell.innerHTML = `<div class="render-error">Failed to render Markdown: ${error.message}</div>`;
    });
})();
