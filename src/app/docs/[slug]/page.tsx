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

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = docSections.findIndex((d) => d.slug === slug);
  if (idx === -1) notFound();
  const doc = docSections[idx];
  const prev = idx > 0 ? docSections[idx - 1] : null;
  const next = idx < docSections.length - 1 ? docSections[idx + 1] : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex gap-12">
            {/* Sidebar */}
            <aside className="hidden lg:block w-56 shrink-0">
              <nav className="sticky top-24 space-y-1">
                <Link href="/docs" className="flex items-center gap-1.5 font-mono text-xs text-steel hover:text-foreground transition-colors mb-4">
                  <ArrowLeft className="h-3 w-3" />
                  All Docs
                </Link>
                {docSections.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/docs/${d.slug}`}
                    className={`block px-3 py-1.5 rounded text-sm transition-colors ${
                      d.slug === slug ? "bg-sentinel/5 text-sentinel font-medium" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d.title}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Content */}
            <article className="flex-1 min-w-0">
              <div className="mb-8">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-sentinel">{doc.category}</span>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-2">{doc.title}</h1>
              </div>

              <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-code:text-sentinel prose-code:bg-sentinel/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-[#1A1A1D] prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-table:font-mono prose-table:text-sm prose-th:text-steel prose-th:font-semibold">
                <ReactMarkdown>{doc.content}</ReactMarkdown>
              </div>

              {/* Prev/Next */}
              <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                {prev ? (
                  <Link href={`/docs/${prev.slug}`} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                    {prev.title}
                  </Link>
                ) : <div />}
                {next ? (
                  <Link href={`/docs/${next.slug}`} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {next.title}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ) : <div />}
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
