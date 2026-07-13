import { useMemo, useState } from "react";
import { ArrowLeft, Download, FileDown, Inbox, Search } from "lucide-react";
import { pageResources } from "../data/config.js";
import { downloadFiles } from "../data/downloadFiles.js";
import { navigateToPage } from "../utils/navigation.js";

const categories = ["全部", "常用表單", "行政申請", "要保書範例", "商品文件", "其他資料"];

export function AdminDownloadsPage() {
  const page = pageResources["admin/downloads"];
  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");

  const activeFiles = useMemo(() => downloadFiles.filter((file) => file.isActive), []);

  const filteredFiles = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return activeFiles.filter((file) => {
      const matchesCategory = activeCategory === "全部" || file.category === activeCategory;
      const searchableText = [file.title, file.description, file.category, file.fileType, file.fileName]
        .join(" ")
        .toLowerCase();
      const matchesKeyword = !normalizedKeyword || searchableText.includes(normalizedKeyword);

      return matchesCategory && matchesKeyword;
    });
  }, [activeCategory, activeFiles, keyword]);

  const hasActiveFiles = activeFiles.length > 0;

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
          <Download size={46} />
        </div>
      </div>

      <div className="mb-6 grid gap-4 rounded-[1.75rem] border border-white/80 bg-white/80 p-4 shadow-soft backdrop-blur-xl md:grid-cols-[1fr_auto] md:items-center">
        <label className="relative block">
          <span className="sr-only">搜尋下載文件</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-apple-muted"
            size={18}
          />
          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜尋檔案名稱、說明、分類或格式"
            className="w-full rounded-full border border-apple-line/70 bg-white/85 py-3 pl-11 pr-4 text-sm text-apple-text outline-none transition placeholder:text-apple-muted/75 focus:border-apple-blue focus:ring-4 focus:ring-apple-blue/10"
          />
        </label>

        <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:justify-end md:overflow-visible md:pb-0">
          {categories.map((category) => (
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

      {!hasActiveFiles ? (
        <EmptyState
          title="尚無可下載文件"
          description="文件上傳到 public/downloads 後，請在 src/data/downloadFiles.js 新增對應資料。"
        />
      ) : filteredFiles.length === 0 ? (
        <EmptyState
          title="找不到符合條件的文件"
          description="請試著調整關鍵字，或切換到其他分類查看。"
        />
      ) : (
        <div className="grid gap-4">
          {filteredFiles.map((file) => {
            const fileHref = `${import.meta.env.BASE_URL}downloads/${file.fileName}`;

            return (
              <article
                key={file.id}
                className="rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-soft backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-apple-bg text-apple-blue">
                    <FileDown size={22} />
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold tracking-tight">{file.title}</h2>
                      {file.isNew ? (
                        <span className="rounded-full bg-apple-blue px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white">
                          NEW
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 leading-7 text-apple-muted">{file.description}</p>
                    <dl className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-apple-muted">
                      <FileMeta label="分類" value={file.category} />
                      <FileMeta label="格式" value={file.fileType} />
                      <FileMeta label="更新" value={file.updatedAt} />
                    </dl>
                  </div>

                  <a
                    href={fileHref}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-apple-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lift md:w-auto"
                  >
                    <Download size={16} />
                    下載
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function FileMeta({ label, value }) {
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
