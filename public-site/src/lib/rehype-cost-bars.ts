import type { Root, Element, RootContent, ElementContent } from "hast";

const COST_KEYWORDS = [
  "cost", "price", "avg ", "average", "usa", "uk ", "india",
  "thailand", "turkey", "mexico", "germany", "france", "canada",
  "australia", "uae", "kenya", "nigeria", "tanzania", "oman",
  "switzerland", "singapore", "netherlands",
];
const CURRENCY_RE = /[\$€£₹¥]/;

const FLAGS: Record<string, string> = {
  usa: "🇺🇸", "united states": "🇺🇸", "uk": "🇬🇧", "united kingdom": "🇬🇧",
  india: "🇮🇳", thailand: "🇹🇭", turkey: "🇹🇷", mexico: "🇲🇽",
  germany: "🇩🇪", france: "🇫🇷", canada: "🇨🇦", australia: "🇦🇺",
  uae: "🇦🇪", kenya: "🇰🇪", nigeria: "🇳🇬", tanzania: "🇹🇿",
  oman: "🇴🇲", switzerland: "🇨🇭", singapore: "🇸🇬", netherlands: "🇳🇱",
};

function el(tag: string, props: Record<string, string>, ...children: (ElementContent | string)[]): Element {
  return {
    type: "element",
    tagName: tag,
    properties: Object.keys(props).length > 0 ? props : {},
    children: children.map((c) => typeof c === "string" ? ({ type: "text", value: c } as ElementContent) : c),
  };
}

function txt(value: string): ElementContent {
  return { type: "text", value } as ElementContent;
}

function getText(node: RootContent | ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(getText).join("");
  return "";
}

function isCostTable(table: Element): boolean {
  const text = getText(table).toLowerCase();
  if (!text) return false;
  const kwCount = COST_KEYWORDS.filter((kw) => text.includes(kw)).length;
  const currencyCount = (text.match(CURRENCY_RE) || []).length;
  return kwCount >= 2 || (kwCount >= 1 && currencyCount >= 2);
}

function parseCost(s: string): number | null {
  const cleaned = s.replace(/,/g, "").trim();
  const m = cleaned.match(/[\$€£₹¥]?\s*([0-9]+(?:\.[0-9]+)?)/);
  if (m) return parseFloat(m[1]);
  const rm = cleaned.match(/[\$€£₹¥]?\s*([0-9,]+)\s*[-–]\s*[\$€£₹¥]?\s*([0-9,]+)/);
  if (rm) return (parseFloat(rm[1].replace(/,/g, "")) + parseFloat(rm[2].replace(/,/g, ""))) / 2;
  return null;
}

function getFlag(country: string): string {
  return FLAGS[country.toLowerCase().trim()] || "";
}

interface CostRow {
  country: string;
  cost: number;
  costText: string;
  extra: string;
  flag: string;
}

function buildPriceBars(table: Element): Element {
  const rows = table.children.filter(
    (c): c is Element => c.type === "element" && (c.tagName === "tr" || c.tagName === "thead")
  );
  const headerRow = rows.find((r) => r.tagName === "thead");
  const bodyRows = rows.filter((r) => r.tagName !== "thead");

  const parsed: CostRow[] = bodyRows.map((row) => {
    const cells = row.children.filter((c): c is Element => c.type === "element" && c.tagName === "td");
    if (cells.length < 2) return null;
    const country = getText(cells[0]).trim();
    const costText = getText(cells[1]).trim();
    const cost = parseCost(costText);
    const extra = cells[2] ? getText(cells[2]).trim() : "";
    if (cost === null) return null;
    return { country, cost, costText, extra, flag: getFlag(country) };
  }).filter((c): c is CostRow => c !== null);

  if (parsed.length < 2) return table;

  const maxCost = Math.max(...parsed.map((c) => c.cost));
  const cheapest = parsed.reduce((min, c) => (c.cost < min.cost ? c : min));

  const children: ElementContent[] = [];

  // Header
  if (headerRow) {
    const hcells = headerRow.children.filter((c): c is Element => c.type === "element" && c.tagName === "th");
    const title = getText(hcells[0] || headerRow);
    const savings = Math.round((1 - cheapest.cost / maxCost) * 100);
    children.push(
      el("div", { className: "flex items-center justify-between mb-4" },
        el("span", { className: "text-sm font-semibold text-gray-500 uppercase tracking-wider" }, txt(title)),
        el("span", { className: "inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold" }, txt(`Save up to ${savings}%`))
      )
    );
  }

  // Price bars
  for (const c of parsed) {
    const isCheapest = c.country === cheapest.country;
    const pct = maxCost > 0 ? (c.cost / maxCost) * 100 : 0;
    const barClass = isCheapest ? "price-fill cheapest" : "price-fill";

    const rowChildren: ElementContent[] = [
      el("span", { className: "price-flag" }, txt(c.flag)),
      el("span", { className: "price-country" }, txt(c.country)),
      el("div", { className: "price-track" },
        el("div", { className: barClass, style: `width:${Math.max(pct, 5)}%` })
      ),
      el("span", { className: "price-value" }, txt(c.costText)),
    ];
    if (isCheapest) {
      rowChildren.push(el("span", { className: "price-savings" }, txt("Best Price")));
    }
    children.push(el("div", { className: "price-row" }, ...rowChildren));
  }

  return el("div", { className: "cost-comparison-wrapper" }, ...children);
}

export function rehypeCostBars() {
  return (tree: Root) => {
    function walk(nodes: (RootContent | ElementContent)[]) {
      for (const child of nodes) {
        if (child.type !== "element") continue;
        const node = child as Element;
        if (node.tagName === "table" && isCostTable(node)) {
          const replacement = buildPriceBars(node);
          node.tagName = replacement.tagName;
          node.properties = replacement.properties;
          node.children = replacement.children;
        } else {
          walk(node.children);
        }
      }
    }
    walk(tree.children);
  };
}
