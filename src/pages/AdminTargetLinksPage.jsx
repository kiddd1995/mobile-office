import { useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, Inbox, Link2, Search } from "lucide-react";
import { pageResources } from "../data/config.js";
import { targetLinkCategories, targetLinks } from "../data/targetLinks.js";
import { navigateToPage } from "../utils/navigation.js";

export function AdminTargetLinksPage() {
  const page = pageResources["admin/links"];
  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");

  const activeLinks = useMemo(() => targetLinks.filter((link) => link.isActive), []);

  const filteredLinks = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return activeLinks.filter((link) => {
      const matchesCategory = activeCategory === "全部" || link.category === activeCategory;
      const searchableText = [link.title, link.description, link.category, link.linkType]
        .join(" ")
        .toLowerCase();
      const matchesKeyword = !normalizedKeyword || searchableText.includes(normalizedKeyword);

      return matchesCategory && matchesKeyword;
    });
  }, [activeCategory, activeLinks, keyword]);

  const hasActiveLinks = activeLinks.length > 0;

  return (
    <section className="py-10">
      <button
        type="button"
        onClick={() => navigateToPage(page.backHref)}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-semibold text-apple-muted shadow-sm backdrop-blur-xl transition hover:text-apple-text"
      >
        <ArrowLeft size={16} />
        {page.backLabel}
      </button>

      <div className="mb-8 grid gap-6 lg:grid-cols-[0.85fr_0.15fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-apple-blue">
            {page.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{page.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-apple-muted">{page.subtitle}</p>
        </div>
        <div className="hidden justify-self-end rounded-[2rem] bg-white/80 p-6 text-apple-blue shadow-soft backdrop-blur-xl lg:grid">
          <Link2 size={46} />
        </div>
      </div>

      <div className="mb-6 grid gap-4 rounded-[1.75rem] border border-white/80 bg-white/80 p-4 shadow-soft backdrop-blur-xl md:grid-cols-[1fr_auto] md:items-center">
        <label className="relative block">
          <span className="sr-only">搜尋標的連結</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-apple-muted"
            size={18}
          />
          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜尋連結名稱、說明、分類或類型"
            className="w-full rounded-full border border-apple-line/70 bg-white/85 py-3 pl-11 pr-4 text-sm text-apple-text outline-none transition placeholder:text-apple-muted/75 focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/10"
          />
        </label>

        <div className="flex flex-wrap gap-2 md:justify-end">
          {targetLinkCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category
                  ? "bg-apple-blue text-white shadow-sm"
                  : "bg-apple-bg text-apple-muted hover:text-apple-text"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {!hasActiveLinks ? (
        <EmptyState
          title="目前尚無可用連結"
          description="新增連結資料後，這裡會顯示可快速前往的商品網頁、查詢系統與外部工具。"
        />
      ) : filteredLinks.length === 0 ? (
        <EmptyState
          title="找不到符合條件的連結"
          description="請試著調整關鍵字，或切換到其他分類查看。"
        />
      ) : (
        <div className="grid gap-4">
          {filteredLinks.map((link) => {
            const linkUrl = link.url?.trim();

            return (
              <article
                key={link.id}
                className="rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-soft backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-apple-bg text-apple-blue">
                    <Link2 size={22} />
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold tracking-tight">{link.title}</h2>
                      {link.isNew ? (
                        <span className="rounded-full bg-apple-blue px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white">
                          NEW
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 leading-7 text-apple-muted">{link.description}</p>
                    <dl className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-apple-muted">
                      <LinkMeta label="分類" value={link.category} />
                      <LinkMeta label="類型" value={link.linkType} />
                      <LinkMeta label="更新" value={link.updatedAt} />
                    </dl>
                  </div>

                  {linkUrl ? (
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-apple-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lift md:w-auto"
                    >
                      <ExternalLink size={16} />
                      前往
                    </a>
                  ) : (
                    <span className="inline-flex w-full items-center justify-center rounded-full bg-apple-bg px-5 py-3 text-sm font-semibold text-apple-muted md:w-auto">
                      連結尚未提供
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function LinkMeta({ label, value }) {
  return (
    <div className="rounded-full bg-apple-bg px-3 py-1">
      <dt className="sr-only">{label}</dt>
      <dd>
        {label}：{value}
      </dd>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-apple-line bg-white/70 px-6 py-12 text-center shadow-soft backdrop-blur-xl">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-apple-bg text-apple-blue">
        <Inbox size={26} />
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl leading-7 text-apple-muted">{description}</p>
    </div>
  );
}
