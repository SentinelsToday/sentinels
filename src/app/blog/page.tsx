"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/sentinel/header";
import { Footer } from "@/components/sentinel/footer";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { posts } from "@/lib/blog-data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const categories = ["All", "Announcement", "Engineering", "Technical", "Security", "Enterprise"];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16">
        <section className="relative grid-bg py-16 sm:py-20 bg-white border-b border-border">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">Blog</h1>
              <p className="mt-4 max-w-xl mx-auto text-base text-muted-foreground leading-relaxed">
                Engineering insights, product updates, and deep dives into robotics trust infrastructure.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-4 bg-surface border-b border-border">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`shrink-0 rounded-md px-3 py-1.5 font-mono text-xs transition-colors ${
                    cat === "All" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post, i) => (
                <motion.article
                  key={post.slug}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } } }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block rounded-lg border border-border bg-white p-6 transition-colors hover:border-sentinel/40 hover:shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-sentinel bg-sentinel/5 border border-sentinel/20 px-2 py-0.5 rounded">
                        {post.category}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-foreground group-hover:text-sentinel transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[11px] text-steel font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-steel opacity-0 group-hover:opacity-100 group-hover:text-sentinel transition-all" />
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
