/**
 * Transforms a container-directive style block into an editorial pull quote:
 *
 *   :::pullquote
 *   The future of healthcare is borderless.
 *   — Dr. Anil Kumar, Chief Cardiac Surgeon
 *   :::
 *
 * Emits a semantic <blockquote class="pullquote"> with an attribution
 * paragraph (class "pq-attr") — no raw HTML, so no dangerousHtml flag needed.
 */
type MdNode = {
  type: string;
  value?: string;
  children?: MdNode[];
  data?: { hProperties?: Record<string, unknown> };
};

export function remarkPullquote() {
  return (tree: any) => {
    const newChildren: MdNode[] = [];
    let i = 0;

    while (i < tree.children.length) {
      const node = tree.children[i];
      const openText = getText(node);
      if (node.type === "paragraph" && openText.trim() === ":::pullquote") {
        const inner: string[] = [];
        let j = i + 1;
        let closed = false;
        while (j < tree.children.length) {
          const n = tree.children[j];
          const t = getText(n);
          if (n.type === "paragraph" && t.trim() === ":::") {
            closed = true;
            break;
          }
          inner.push(t.trim());
          j++;
        }
        if (!closed) {
          newChildren.push(node);
          i++;
          continue;
        }

        const joined = inner.join("\n\n").trim();
        const attrMatch = joined.match(/(?:^|\n)\s*[—–-]\s*(.+)$/);
        let quote = joined;
        let attribution = "";
        if (attrMatch) {
          quote = joined.slice(0, attrMatch.index).trim();
          attribution = attrMatch[1].trim();
        }

        const blockquote: MdNode = {
          type: "blockquote",
          data: { hProperties: { className: ["pullquote"] } },
          children: [{ type: "paragraph", children: [{ type: "text", value: quote }] }],
        };
        if (attribution) {
          blockquote.children!.push({
            type: "paragraph",
            data: { hProperties: { className: ["pq-attr"] } },
            children: [{ type: "text", value: `— ${attribution}` }],
          });
        }
        newChildren.push(blockquote);
        i = j + 1;
        continue;
      }

      newChildren.push(node);
      i++;
    }

    tree.children = newChildren;
  };
}

function getText(node: MdNode): string {
  if (node.type === "paragraph" && node.children) {
    return node.children
      .map((c) => (c.type === "text" ? (c.value as string) ?? "" : ""))
      .join("");
  }
  return "";
}
