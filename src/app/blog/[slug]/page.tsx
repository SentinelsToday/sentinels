import { notFound } from "next/navigation";
import { Header } from "@/components/sentinels/header";
import { Footer } from "@/components/sentinels/footer";
import { posts } from "@/lib/blog-data";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16">
        <article className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Back */}
            <Link href="/blog" className="inline-flex items-center gap-1.5 font-mono text-xs text-steel hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Blog
            </Link>

            {/* Header */}
            <div className="mb-10">
              <span className="inline-flex items-center gap-1.5 rounded border border-sentinels/20 bg-sentinels/5 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-sentinels mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {post.title}
              </h1>
              <div className="mt-4 flex items-center gap-4 text-sm text-steel font-mono">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime}
                </span>
                <span>{post.author}</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-neutral max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground prose-code:text-sentinels prose-code:bg-sentinels/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-[#1A1A1D] prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-table:font-mono prose-table:text-sm prose-th:text-steel prose-th:font-semibold prose-th:uppercase prose-th:text-[11px] prose-th:tracking-wider">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
