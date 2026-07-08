declare module "*.mdx" {
  import type { ComponentType } from "react";
  const MDXComponent: ComponentType;
  export default MDXComponent;
  export const frontmatter: Record<string, unknown>;
}

declare module "*.md" {
  import type { ComponentType } from "react";
  const MDXComponent: ComponentType;
  export default MDXComponent;
  export const frontmatter: Record<string, unknown>;
}
