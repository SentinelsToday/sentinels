import { notFound } from "next/navigation";
import { Header } from "@/components/sentinel/header";
import { Footer } from "@/components/sentinel/footer";
import { docSections } from "@/lib/docs-data";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function generateStaticParams() {
  return docSections.map((doc) => ({ slug: doc.slug }));
}

function extractHeadings(content: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[`*_~]/g, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      headings.push({ id, text, level });
    }
  }
  return headings;
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = docSections.findIndex((d) => d.slug === slug);
  if (idx === -1) notFound();
  const doc = docSections[idx];
  const prev = idx > 0 ? docSections[idx - 1] : null;
  const next = idx < docSections.length - 1 ? docSections[idx + 1] : null;
  const headings = extractHeadings(doc.content);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex gap-10 lg:gap-16">
            {/* Left Sidebar - Navigation */}
            <aside className="hidden lg:block w-56 shrink-0">
              <nav className="sticky top-24 space-y-1">
                <Link href="/docs" className="flex items-center gap-1.5 font-mono text-xs text-steel hover:text-foreground transition-colors mb-6">
                  <ArrowLeft className="h-3 w-3" />
                  All Docs
                </Link>
                {docSections.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/docs/${d.slug}`}
                    className={`block px-3 py-2 rounded-md text-[13px] transition-colors ${
                      d.slug === slug
                        ? "bg-sentinel/5 text-sentinel font-medium border-l-2 border-sentinel"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {d.title}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <article className="flex-1 min-w-0 max-w-[720px]">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-[13px] text-muted-foreground mb-8">
                <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
                <span className="text-border">/</span>
                <span className="text-foreground">{doc.title}</span>
              </div>

              {/* Title */}
              <div className="mb-10">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-sentinel">
                  {doc.category}
                </span>
                <h1 className="text-[2.25rem] font-bold tracking-tight text-foreground mt-3 leading-tight">
                  {doc.title}
                </h1>
              </div>

              {/* Markdown Content */}
              <div className="docs-prose">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => {
                      const text = String(children).replace(/[`*_~]/g, "");
                      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      return (
                        <h2 id={id} className="text-[1.375rem] font-semibold tracking-tight text-foreground mt-14 mb-4 pb-3 border-b border-border scroll-mt-24">
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const text = String(children).replace(/[`*_~]/g, "");
                      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      return (
                        <h3 id={id} className="text-[1.1rem] font-semibold text-foreground mt-10 mb-3 scroll-mt-24">
                          {children}
                        </h3>
                      );
                    },
                    p: ({ children }) => (
                      <p className="text-[15px] leading-[1.8] text-muted-foreground mb-5">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="space-y-2 mb-6 pl-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="space-y-2 mb-6 pl-1 list-decimal list-inside">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-[15px] leading-[1.8] text-muted-foreground flex gap-2">
                        <span className="text-sentinel mt-[2px] shrink-0">•</span>
                        <span>{children}</span>
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                    code: ({ className, children }) => {
                      const isBlock = className?.includes("language-");
                      if (isBlock) {
                        return (
                          <code className={`${className} text-[13px]`}>
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code className="text-[13px] font-mono text-sentinel bg-sentinel/5 px-1.5 py-0.5 rounded border border-sentinel/10">
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="bg-[#0f0f11] text-gray-200 border border-border rounded-lg px-5 py-4 mb-6 overflow-x-auto text-[13px] leading-[1.7] font-mono">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-sentinel/40 pl-4 py-1 my-6 bg-sentinel/[0.02] rounded-r-md">
                        {children}
                      </blockquote>
                    ),
                    hr: () => <hr className="border-border my-10" />,
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-6 rounded-lg border border-border">
                        <table className="w-full text-[13px] font-mono">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-muted/50 border-b border-border">
                        {children}
                      </thead>
                    ),
                    th: ({ children }) => (
                      <th className="text-left px-4 py-2.5 text-[12px] font-semibold text-steel uppercase tracking-wider">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-2.5 text-muted-foreground border-t border-border">
                        {children}
                      </td>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} className="text-sentinel hover:text-sentinel/80 underline underline-offset-2 transition-colors">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {doc.content}
                </ReactMarkdown>
              </div>

              {/* Prev/Next Navigation */}
              <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
                {prev ? (
                  <Link href={`/docs/${prev.slug}`} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span>{prev.title}</span>
                  </Link>
                ) : <div />}
                {next ? (
                  <Link href={`/docs/${next.slug}`} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <span>{next.title}</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ) : <div />}
              </div>
            </article>

            {/* Right Sidebar - On This Page */}
            {headings.length > 0 && (
              <aside className="hidden xl:block w-52 shrink-0">
                <div className="sticky top-24">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-steel mb-4">
                    On This Page
                  </p>
                  <nav className="space-y-1">
                    {headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        className={`block text-[13px] leading-snug transition-colors hover:text-foreground ${
                          h.level === 3 ? "pl-3 text-muted-foreground/70" : "text-muted-foreground"
                        } py-1`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
