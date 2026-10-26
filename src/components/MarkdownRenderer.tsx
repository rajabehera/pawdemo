import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentListItems: string[] = [];
  let inList = false;

  // Simple, safe parser for bold and italic text
  const parseInlineMarkdown = (text: string): React.ReactNode => {
    let html = text;
    // Replace escape characters
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Italic: *text*
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  const flushList = (key: number) => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="list-disc pl-5 my-3.5 space-y-1.5 text-stone-700 dark:text-stone-300">
          {currentListItems.map((item, idx) => (
            <li key={`li-${key}-${idx}`} className="text-stone-650 dark:text-stone-300 antialiased leading-relaxed">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Headings
    if (trimmed.startsWith("### ")) {
      flushList(index);
      inList = false;
      elements.push(
        <h4 key={`h4-${index}`} className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 mt-5 mb-2 font-sans tracking-tight">
          {parseInlineMarkdown(trimmed.substring(4))}
        </h4>
      );
    } else if (trimmed.startsWith("## ")) {
      flushList(index);
      inList = false;
      elements.push(
        <h3 key={`h3-${index}`} className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 mt-6 mb-3 font-sans tracking-tight">
          {parseInlineMarkdown(trimmed.substring(3))}
        </h3>
      );
    } else if (trimmed.startsWith("# ")) {
      flushList(index);
      inList = false;
      elements.push(
        <h2 key={`h2-${index}`} className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 mt-7 mb-4 font-sans tracking-tight">
          {parseInlineMarkdown(trimmed.substring(2))}
        </h2>
      );
    }
    // Bullet pointer lists
    else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      inList = true;
      currentListItems.push(trimmed.substring(2));
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(trimmed)) {
      flushList(index);
      inList = false;
      const match = trimmed.match(/^\d+\.\s(.*)/);
      const number = trimmed.split(".")[0];
      elements.push(
        <div key={`ol-${index}`} className="pl-4 my-2.5 flex items-start gap-2 text-stone-700 dark:text-stone-300 leading-relaxed font-sans text-xs sm:text-sm">
          <span className="font-mono text-xs text-teal-700 font-extrabold whitespace-nowrap">{number}.</span>
          <div className="text-stone-650 dark:text-stone-300">{parseInlineMarkdown(match ? match[1] : trimmed)}</div>
        </div>
      );
    }
    // Empty line to clear formats
    else if (trimmed === "") {
      flushList(index);
      inList = false;
    }
    // Simple narrative paragraph
    else {
      flushList(index);
      inList = false;
      elements.push(
        <p key={`p-${index}`} className="text-stone-650 dark:text-stone-400 text-xs sm:text-sm leading-relaxed mb-3 font-sans antialiased">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    }
  });

  // Flush remaining elements
  flushList(lines.length);

  return <div className="markdown-renderer-body space-y-1">{elements}</div>;
}
