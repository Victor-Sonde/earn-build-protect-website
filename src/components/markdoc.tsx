import Markdoc, { type Node } from '@markdoc/markdoc';
import React from 'react';

/**
 * Renders editor-written Markdoc. Markdoc builds React elements from a parsed tree, so raw HTML in
 * content is shown as text and never executed. Links are limited to safe schemes.
 */
export function RichText({ node }: { node: unknown }) {
  const tree = Markdoc.transform(node as Node, {
    nodes: {
      link: {
        render: 'a',
        attributes: { href: { type: String }, title: { type: String } },
        transform(n, config) {
          const href = String(n.attributes.href ?? '');
          const safe = /^(https?:\/\/|mailto:|\/|#)/i.test(href) ? href : '#';
          const external = /^https?:\/\//i.test(safe);
          return new Markdoc.Tag(
            'a',
            { href: safe, ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}) },
            n.transformChildren(config),
          );
        },
      },
    },
  });
  return <>{Markdoc.renderers.react(tree, React)}</>;
}

export function hasContent(node: unknown): boolean {
  const n = node as Node | null;
  return Boolean(n && Array.isArray(n.children) && n.children.length > 0);
}
