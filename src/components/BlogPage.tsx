import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  BookOpen, Heart, MessageSquare, ChevronLeft, ChevronRight, ArrowLeft,
  ExternalLink, Sparkles, Tag,
} from "lucide-react";
import MotionWrapper from "./MotionWrapper";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Blog, BlogComment } from "../types";

type ToastType = "success" | "error" | "info" | "warning";

interface BlogPageProps {
  blogs: Blog[];
  /** Selected article lives in App because the URL / router depends on it. */
  selectedBlog: Blog | null;
  onSelectBlog: (blog: Blog | null) => void;
  currentUser: any;
  onRequireLogin: () => void;
  onUpdateBlog: (blog: Blog) => void;
  onOpenLightbox: (index: number) => void;
  onToast: (message: string, type?: ToastType) => void;
}

const BLOGS_PER_PAGE = 10;
const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

const catBtnClass = (active: boolean) =>
  `text-xs px-4 py-2.5 rounded-xl font-bold tracking-wide transition-all border flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap ${
    active
      ? "bg-[#1f2d29] dark:bg-[#2c3e38] text-white border-[#1f2d29] shadow-sm"
      : "bg-white text-stone-700 hover:bg-stone-50 dark:bg-stone-900 dark:text-stone-300 border-stone-200 dark:border-stone-800"
  }`;

const countBadge = (active: boolean) =>
  `text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold shrink-0 ${
    active ? "bg-teal-905 text-white" : "bg-stone-105 text-stone-500 dark:bg-stone-800 dark:text-stone-450"
  }`;

/* ───────────────────────── Blog card ───────────────────────── */
const BlogCard: React.FC<{ blog: Blog; onOpen: (b: Blog) => void }> = ({ blog: b, onOpen }) => {
  const likesCount = b.likes?.length || 0;
  const commCount = b.comments?.length || 0;
  const hasGallery = !!(b.galleryImages && b.galleryImages.length > 0);

  return (
    <div
      id={`blog-card-${b.id}`}
      onClick={() => onOpen(b)}
      className="bg-white dark:bg-stone-950 border border-stone-150 dark:border-stone-850 rounded-2xl overflow-hidden cursor-pointer group flex flex-col shadow-sm hover:shadow-md transition-opacity duration-300 text-left"
    >
      <div className="h-44 bg-stone-100 overflow-hidden relative">
        <img src={b.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-102 transition duration-500" referrerPolicy="no-referrer" />
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm border border-stone-100 dark:border-stone-800 px-2.5 py-1 rounded-lg">
          <span className="text-[8px] font-bold text-teal-800 dark:text-teal-400 font-mono tracking-widest uppercase">{b.category}</span>
        </div>
        {hasGallery && (
          <div className="absolute bottom-3 right-3 bg-stone-950/80 backdrop-blur-3xs border border-stone-850 px-2 py-1 rounded-lg text-white text-[9px] font-bold font-mono flex items-center gap-1 shadow-sm">
            <span>📷</span> {b.galleryImages!.length} Photos
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
        <div className="space-y-1.5">
          <p className="text-[10px] items-center gap-1.5 text-stone-400 font-mono">
            Written by <span className="font-semibold text-stone-700 dark:text-stone-300">{b.author}</span> • {b.readTime}
          </p>
          <h3 className="font-bold text-base sm:text-md font-serif italic text-stone-955 dark:text-stone-100 leading-snug group-hover:text-teal-750 transition-colors">
            {b.title}
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">{b.summary}</p>
        </div>

        <div className="pt-3 border-t border-stone-100 space-y-2">
          {b.tags && b.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {b.tags.map((tag, tagIdx) => (
                <span key={`${b.id}-tag-${tag}-${tagIdx}`} className="text-[9px] bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 text-stone-500 px-2 py-0.5 rounded-md uppercase font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-mono text-[10px] text-stone-400">
              <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-rose-400" />{likesCount} likes</span>
              <span>•</span>
              <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3 text-teal-500" />{commCount} comments</span>
            </div>
            <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-widest font-mono flex items-center gap-0.5 hover:translate-x-0.5 transition-transform">
              {b.category === "Events & Gallery" || hasGallery ? "Open Gallery 📷 →" : "Read Essay →"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────── Article reader ───────────────────────── */
interface BlogReaderProps {
  blog: Blog;
  blogs: Blog[];
  currentUser: any;
  onBack: () => void;
  onSelectBlog: (b: Blog) => void;
  onRequireLogin: () => void;
  onUpdateBlog: (b: Blog) => void;
  onOpenLightbox: (i: number) => void;
  onToast: BlogPageProps["onToast"];
}

const BlogReader: React.FC<BlogReaderProps> = ({
  blog, blogs, currentUser, onBack, onSelectBlog, onRequireLogin, onUpdateBlog, onOpenLightbox, onToast,
}) => {
  const [newCommentText, setNewCommentText] = useState("");

  const blogLikes = blog.likes || [];
  const userId = currentUser?.uid || currentUser?.email || "mock_visitor";
  const hasLiked = !!currentUser && blogLikes.includes(userId);

  const curIndex = blogs.findIndex((bg) => bg.id === blog.id);
  const previousArticle = curIndex > 0 ? blogs[curIndex - 1] : null;
  const nextArticle = curIndex < blogs.length - 1 ? blogs[curIndex + 1] : null;

  const toggleLike = () => {
    if (!currentUser) return onRequireLogin();
    const updated = hasLiked ? blogLikes.filter((id) => id !== userId) : [...blogLikes, userId];
    onUpdateBlog({ ...blog, likes: updated });
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    if (!currentUser) return onRequireLogin();

    const newComment: BlogComment = {
      id: "c_" + Date.now(),
      userName: currentUser.email || "Community Member",
      userEmail: currentUser.email || "",
      userId: currentUser.uid || "mock_uid",
      comment: newCommentText.trim(),
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    onUpdateBlog({ ...blog, comments: [newComment, ...(blog.comments || [])] });
    setNewCommentText("");
    onToast("Comment posted successfully! Thank you for sharing. 💬", "success");
  };

  const goTo = (b: Blog) => {
    onSelectBlog(b);
    scrollTop();
  };

  return (
    <div className="space-y-6 bg-white dark:bg-stone-950 p-5 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
      <button
        id="go-back-blog"
        onClick={onBack}
        className="text-xs font-bold text-stone-600 dark:text-stone-450 hover:text-stone-900 dark:hover:text-white flex items-center gap-1 font-mono uppercase tracking-wider"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to care archives
      </button>

      <div className="h-56 sm:h-80 bg-stone-100 rounded-2xl overflow-hidden shadow-inner relative">
        <img src={blog.imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border border-stone-100 px-3 py-1.5 rounded-xl shadow-xs">
          <span className="text-[9px] font-bold tracking-widest text-[#9d7d4c] uppercase font-mono">{blog.category}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4.5xl font-serif italic font-extrabold text-stone-955 dark:text-stone-100 tracking-wide leading-tight">
          {blog.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-[10px] text-stone-400 font-mono border-b border-stone-150 pb-4">
          <span className="font-semibold text-stone-700 dark:text-stone-300">Written by {blog.author}</span>
          <span>•</span>
          <span>Published {blog.createdAt}</span>
          <span>•</span>
          <span className="bg-teal-50 dark:bg-stone-900 border border-teal-100 dark:border-teal-900/40 text-teal-800 dark:text-teal-400 py-0.5 px-2 rounded-lg font-bold">
            {blog.readTime}
          </span>
        </div>
      </div>

      <div className="prose max-w-none text-xs sm:text-sm text-stone-650 dark:text-stone-400 leading-relaxed font-sans">
        <MarkdownRenderer content={blog.content} />
      </div>

      {/* Gallery */}
      {blog.galleryImages && blog.galleryImages.length > 0 && (
        <div className="mt-8 pt-8 border-t border-stone-150 dark:border-stone-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-850 pb-3">
            <div className="text-left">
              <h3 className="text-sm font-extrabold text-[#1c2e2b] dark:text-teal-400 flex items-center gap-2 font-sans tracking-tight">
                <span>📷</span> Atelier Event Photo Archive
              </h3>
              <p className="text-[11px] text-stone-500">
                Browse through {blog.galleryImages.length} capturing highlights from this event gallery.
              </p>
            </div>
            <span className="text-[10px] uppercase font-mono bg-[#f4f7f5] dark:bg-[#1C2E2B] text-[#1c2e2b] dark:text-teal-400 font-bold border border-stone-200 dark:border-[#273a31] px-2.5 py-1 rounded-full text-center whitespace-nowrap self-start">
              {blog.galleryImages.length} High-Res Frames
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 font-sans">
            {blog.galleryImages.map((imgSrc, imgIdx) => (
              <div
                key={imgIdx}
                onClick={() => onOpenLightbox(imgIdx)}
                className="relative aspect-4/3 sm:aspect-square bg-stone-50 rounded-xl overflow-hidden shadow-xs group cursor-pointer border border-stone-200 dark:border-stone-850 hover:shadow-md transition-opacity duration-300"
              >
                <img src={imgSrc} alt={`Gallery snapshot ${imgIdx + 1}`} className="w-full h-full object-cover group-hover:scale-102 transition duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-2 sm:p-3 opacity-0 group-hover:opacity-100 flex flex-col justify-end transition-opacity duration-300">
                  <span className="text-[9px] text-[#cca568] font-bold font-mono tracking-wider uppercase block">Capture #{imgIdx + 1}</span>
                  <span className="text-[8px] text-stone-100 font-mono">Click to Enlarge 🔎</span>
                </div>
                <span className="absolute top-2 right-2 bg-stone-900/60 dark:bg-black/80 backdrop-blur-xs text-[8px] font-mono text-white font-bold px-1.5 py-0.5 rounded">
                  {imgIdx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Likes & share */}
      <div className="pt-6 mt-8 border-t border-stone-150 flex flex-wrap items-center justify-between gap-4 bg-stone-50/50 dark:bg-stone-900/20 p-4 rounded-2xl border border-stone-100 dark:border-stone-900">
        <div className="space-y-0.5 text-left">
          <h4 className="text-[10px] font-mono tracking-wider text-stone-400 uppercase">Support Scientific Medicine</h4>
          <p className="text-xs text-stone-500">Show appreciation or verify this guide's relevance.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLike}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-xs ${hasLiked
              ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100"
              : "bg-white text-stone-700 border-stone-250 hover:bg-stone-50"
              }`}
          >
            <Heart className={`h-4 w-4 ${hasLiked ? "fill-rose-500 text-rose-500 animate-pulse" : "text-stone-400"}`} />
            <span>{blogLikes.length} Likes</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              onToast("Blog post link copied to clipboard! 🐾", "success");
            }}
            className="bg-white hover:bg-stone-50 border border-stone-250 text-stone-700 text-xs px-4 py-2 rounded-xl font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5 text-stone-400" />
            Share Link
          </button>
        </div>
      </div>

      {/* Prev / next */}
      {(previousArticle || nextArticle) && (
        <div className="py-6 border-y border-stone-150 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {previousArticle ? (
            <button
              id={`inner-prev-article-${previousArticle.id}`}
              onClick={() => goTo(previousArticle)}
              className="group text-left p-4 rounded-2xl border border-stone-150 bg-[#fafafa]/45 hover:bg-white hover:border-teal-700/40 hover:shadow-xs transition duration-300 flex items-start gap-3 cursor-pointer"
            >
              <div className="mt-1 flex items-center justify-center h-7 w-7 rounded-lg bg-stone-150 group-hover:bg-teal-50 text-stone-500 group-hover:text-teal-850 transition">
                <ChevronLeft className="h-4.5 w-4.5 text-stone-600" />
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-[#9d7d4c] dark:text-amber-450">Previous Science Paper</span>
                <h4 className="text-xs font-black text-stone-900 group-hover:text-teal-800 transition truncate">{previousArticle.title}</h4>
              </div>
            </button>
          ) : (
            <div className="p-4 rounded-2xl border border-dashed border-stone-200/65 flex items-center justify-center text-center">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Initial Research Post</span>
            </div>
          )}

          {nextArticle ? (
            <button
              id={`inner-next-article-${nextArticle.id}`}
              onClick={() => goTo(nextArticle)}
              className="group text-right p-4 rounded-2xl border border-stone-150 bg-[#fafafa]/45 hover:bg-white hover:border-teal-700/40 hover:shadow-xs transition duration-300 flex items-start justify-end gap-3 cursor-pointer"
            >
              <div className="space-y-0.5 min-w-0 flex-1 order-1 sm:order-none">
                <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-[#9d7d4c] dark:text-amber-450">Next Science Paper</span>
                <h4 className="text-xs font-black text-stone-900 group-hover:text-teal-800 transition truncate">{nextArticle.title}</h4>
              </div>
              <div className="mt-1 flex items-center justify-center h-7 w-7 rounded-lg bg-stone-150 group-hover:bg-teal-50 text-stone-500 group-hover:text-teal-850 transition">
                <ChevronRight className="h-4.5 w-4.5 text-stone-600" />
              </div>
            </button>
          ) : (
            <div className="p-4 rounded-2xl border border-dashed border-stone-200/65 flex items-center justify-center text-center">
              <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">Latest Research Post</span>
            </div>
          )}
        </div>
      )}

      {/* Comments */}
      <div className="pt-6 mt-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <MessageSquare className="h-4.5 w-4.5 text-teal-700" />
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-sans">
            Apothecary Member Circle ({(blog.comments || []).length})
          </h3>
        </div>

        <div className="bg-stone-50/60 p-4 rounded-2xl border border-stone-200/60 shadow-xs">
          <form onSubmit={submitComment} className="space-y-3">
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-wider">Contribute Advice / Feedback</label>
              {currentUser && (
                <p className="text-[10px] text-stone-500 font-sans">
                  Writing as: <span className="font-bold text-teal-850 font-mono">{currentUser.email}</span>
                </p>
              )}
            </div>

            <textarea
              rows={3}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder={currentUser ? "Share your skin-treatment experience, dosage feedback, or query here..." : "Select the button below to join the community circle. Log in structure is safe."}
              disabled={!currentUser}
              className="w-full text-xs p-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-800 focus:border-transparent font-sans leading-relaxed disabled:opacity-75 disabled:bg-stone-100"
            />

            {currentUser ? (
              <button type="submit" className="bg-teal-800 hover:bg-teal-900 text-white text-[10px] font-bold uppercase tracking-widest font-mono py-2.5 px-4 rounded-xl transition">
                Publish to Circle
              </button>
            ) : (
              <div className="bg-white/80 p-3.5 rounded-xl border border-stone-150 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                  Only validated members of the <strong>Pawwcious Care Circle</strong> are entitled to submit advice annotations.
                </p>
                <button
                  type="button"
                  onClick={onRequireLogin}
                  className="shrink-0 bg-stone-905 text-white hover:bg-stone-850 px-4 py-2 rounded-lg text-[9px] font-bold tracking-widest uppercase font-mono"
                >
                  Sign-In / Express Register
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="space-y-4.5">
          {!blog.comments || blog.comments.length === 0 ? (
            <div className="text-center py-6 bg-stone-50/30 rounded-xl border border-dashed border-stone-200">
              <p className="text-xs text-stone-400">No care contributions filed yet. Be the first to initiate the dialogue!</p>
            </div>
          ) : (
            blog.comments.map((comment) => (
              <div key={comment.id} className="bg-stone-50/40 p-4.5 rounded-xl border border-stone-150 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-800 uppercase font-mono">
                      {comment.userName ? comment.userName[0] : "🐾"}
                    </div>
                    <span className="text-xs font-bold text-stone-900">{comment.userName}</span>
                    {comment.userName.toLowerCase().includes("dr.") && (
                      <span className="bg-teal-750 text-[8px] font-mono text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Verified Vet</span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-stone-400">{comment.createdAt}</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans whitespace-pre-wrap pl-1">{comment.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────── Sidebar ───────────────────────── */
interface SidebarProps {
  blogs: Blog[];
  selectedBlog: Blog | null;
  selectedTag: string;
  onSelectBlog: (b: Blog | null) => void;
  onSelectTag: (tag: string) => void;
}

const BlogSidebar: React.FC<SidebarProps> = ({ blogs, selectedBlog, selectedTag, onSelectBlog, onSelectTag }) => {
  const popular = useMemo(
    () =>
      [...blogs]
        .sort((a, b) => {
          const scoreA = (a.likes?.length || 0) + (a.comments?.length || 0) + (a.isPopular ? 10 : 0);
          const scoreB = (b.likes?.length || 0) + (b.comments?.length || 0) + (b.isPopular ? 10 : 0);
          return scoreB - scoreA;
        })
        .slice(0, 3),
    [blogs]
  );
  const allTags = useMemo(() => Array.from(new Set(blogs.flatMap((b) => b.tags || []))), [blogs]);

  const pickTag = (tag: string) => {
    onSelectTag(tag);
    if (selectedBlog) onSelectBlog(null);
  };

  return (
    <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 bg-[#FAF9F5]/45 p-5 rounded-3xl border border-stone-200/50 shadow-xs">
      {/* Popular */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-200/70">
          <Sparkles className="h-4 w-4 text-[#9d7d4c]" />
          <h3 className="text-xs font-mono font-bold tracking-widest text-stone-905 uppercase">Popular Posts</h3>
        </div>
        <div className="space-y-4">
          {popular.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                onSelectBlog(p);
                scrollTop();
              }}
              className={`flex gap-3 cursor-pointer group p-1.5 rounded-xl border ${selectedBlog?.id === p.id
                ? "bg-teal-50/50 border-teal-200"
                : "border-transparent hover:bg-white hover:border-stone-150"
                } transition duration-200`}
            >
              <div className="h-12 w-12 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                <img src={p.imageUrl} alt="" className="h-full w-full object-cover group-hover:scale-102 transition" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[8px] font-bold text-[#ba965e] uppercase tracking-wider block font-mono">{p.category}</span>
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-snug truncate group-hover:text-teal-750">{p.title}</h4>
                <p className="text-[9px] text-stone-400 font-mono">{p.readTime} • {p.likes?.length || 0} Likes</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-200/70">
          <Tag className="h-4 w-4 text-amber-600" />
          <h3 className="text-xs font-mono font-bold tracking-widest text-stone-905 uppercase">Refine by Tag</h3>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            onClick={() => pickTag("All")}
            className={`text-[10px] font-semibold py-1.5 px-3 rounded-lg border font-mono uppercase tracking-wider transition cursor-pointer ${selectedTag === "All"
              ? "bg-amber-500/10 border-amber-500 text-amber-800 font-bold"
              : "bg-white text-stone-500 border-stone-200/80 hover:bg-stone-50"
              }`}
          >
            #All Tags
          </button>

          {allTags.map((tagKey) => {
            const frequency = blogs.filter((bl) => bl.tags?.includes(tagKey)).length;
            const active = selectedTag === tagKey;
            return (
              <button
                key={tagKey}
                onClick={() => pickTag(tagKey)}
                className={`text-[10px] font-semibold py-1.5 px-3 rounded-lg border font-mono uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer ${active
                  ? "bg-amber-500/15 border-amber-500 text-amber-800 font-bold shadow-xs"
                  : "bg-white text-stone-500 border-stone-200/80 hover:bg-stone-50"
                  }`}
              >
                <span>#{tagKey}</span>
                <span className={active ? "text-amber-800" : "text-stone-350"}>({frequency})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 bg-teal-900 text-white rounded-2xl relative overflow-hidden text-left shadow-xs mt-3 select-none">
        <div className="relative space-y-1 z-10">
          <span className="text-[8px] font-mono tracking-widest text-teal-200 font-bold uppercase block">Expert Verification</span>
          <h5 className="text-xs font-bold text-amber-100">Prescribed pH 7+</h5>
          <p className="text-[10.5px] text-teal-100/90 leading-relaxed font-sans">
            Our literature catalog matches clinical pharmacy studies ensuring organic purity values. Keep your pet safe.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────── Page ───────────────────────── */
export const BlogPage: React.FC<BlogPageProps> = ({
  blogs, selectedBlog, onSelectBlog, currentUser, onRequireLogin, onUpdateBlog, onOpenLightbox, onToast,
}) => {
  // Filter / pagination state now lives here
  const [category, setCategory] = useState("All");
  const [tag, setTag] = useState("All");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => Array.from(new Set(blogs.map((b) => b.category))) as string[], [blogs]);

  const filtered = useMemo(
    () =>
      blogs.filter((b) => {
        const matchesCategory = category === "All" || b.category === category;
        const matchesTag = tag === "All" || (b.tags && b.tags.includes(tag));
        return matchesCategory && matchesTag;
      }),
    [blogs, category, tag]
  );

  const totalPages = Math.ceil(filtered.length / BLOGS_PER_PAGE) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paginated = filtered.slice((currentPage - 1) * BLOGS_PER_PAGE, currentPage * BLOGS_PER_PAGE);

  const goToPage = (n: number) => {
    setPage(n);
    document.getElementById("blog-listing-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const pickCategory = (c: string) => {
    setCategory(c);
    if (selectedBlog) onSelectBlog(null);
    setPage(1);
  };

  const pickTag = (t: string) => {
    setTag(t);
    setPage(1);
  };

  const resetFilters = () => {
    setCategory("All");
    setTag("All");
    setPage(1);
  };

  return (
    <MotionWrapper>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        id="blog-listing-section"
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto pb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-stone-900 border border-teal-100 dark:border-teal-900/40 text-teal-850 dark:text-teal-400 text-[10px] font-mono font-semibold tracking-wider uppercase">
            <BookOpen className="h-3 w-3 text-teal-600 dark:text-teal-400 animate-pulse" />
            Care Literature Atelier
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-serif italic text-stone-955 dark:text-stone-100 tracking-wide leading-tight mt-1">
            The Science of Luxury Pet Care
          </h1>
          <div className="h-[1px] w-12 bg-amber-500/40 mx-auto my-3" />
          <p className="text-xs sm:text-sm text-stone-550 dark:text-stone-400 leading-relaxed max-w-lg mx-auto">
            Evidence-based guidelines, organic ingredient clinical reviews, and botanical skincare advice formulated by expert research veterinarians.
          </p>
        </div>

        {/* Category bar */}
        <div id="blog-categories-headline-bar" className="w-full flex flex-col items-center justify-center space-y-3 pb-6 border-b border-stone-150 dark:border-stone-850">
          <span className="text-[9px] font-mono tracking-widest text-[#9d7d4c] dark:text-amber-450 uppercase font-black">Main Literature Categories</span>
          <div className="w-full flex flex-nowrap items-center overflow-x-auto justify-start md:justify-center gap-2 py-1 scrollbar-none px-4 md:px-0 max-w-full">
            <button id="blog-cat-btn-all" onClick={() => pickCategory("All")} className={catBtnClass(category === "All")}>
              <span className="font-semibold text-[11px] whitespace-nowrap">All Care Guidelines 🧪</span>
              <span className={countBadge(category === "All")}>{blogs.length}</span>
            </button>

            {categories.map((catName) => {
              const frequency = blogs.filter((bl) => bl.category === catName).length;
              const active = category === catName;
              return (
                <button
                  key={catName}
                  id={`blog-cat-btn-${catName.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => pickCategory(catName)}
                  className={catBtnClass(active)}
                >
                  <span className="font-semibold text-[11px] whitespace-nowrap">{catName}</span>
                  <span className={countBadge(active)}>{frequency}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main column */}
          <div className="lg:col-span-8 space-y-8">
            {!selectedBlog ? (
              <>
                {(category !== "All" || tag !== "All") && (
                  <div className="bg-stone-50/80 border border-stone-200/80 p-3 sm:p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-stone-400">Active Filters:</span>
                      {category !== "All" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-teal-50 text-teal-805 px-2.5 py-1 rounded-lg border border-teal-100 uppercase tracking-wide">
                          Category: {category}
                          <button onClick={() => { setCategory("All"); setPage(1); }} className="hover:text-amber-600 font-mono font-black text-[12px] ml-1">×</button>
                        </span>
                      )}
                      {tag !== "All" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-805 px-2.5 py-1 rounded-lg border border-amber-200/60 uppercase tracking-wide">
                          Tag: #{tag}
                          <button onClick={() => { setTag("All"); setPage(1); }} className="hover:text-amber-600 font-mono font-black text-[12px] ml-1">×</button>
                        </span>
                      )}
                    </div>
                    <button onClick={resetFilters} className="text-[10px] font-bold text-stone-500 hover:text-rose-600 transition uppercase tracking-widest font-mono">
                      Clear All Filters
                    </button>
                  </div>
                )}

                {filtered.length === 0 ? (
                  <div className="bg-white border border-stone-150 p-12 text-center rounded-2xl max-w-sm mx-auto space-y-4 shadow-sm">
                    <span className="text-3xl text-stone-300 block">🔬</span>
                    <h3 className="font-bold text-sm text-stone-900">No care guidelines matched</h3>
                    <p className="text-xs text-stone-500">No papers were discovered under this specific combination of Category and Tag. Try expanding your search queries.</p>
                    <button onClick={resetFilters} className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-[10px] tracking-widest uppercase transition">
                      Reset Care Filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {paginated.map((b) => (
                        <BlogCard
                          key={b.id}
                          blog={b}
                          onOpen={(blog) => {
                            onSelectBlog(blog);
                            scrollTop();
                          }}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-stone-150 dark:border-stone-850">
                        <span className="text-[11px] font-mono text-stone-400">
                          Showing page <strong className="text-stone-700 dark:text-stone-300">{currentPage}</strong> of{" "}
                          <strong className="text-stone-700 dark:text-stone-300">{totalPages}</strong> ({filtered.length} total articles)
                        </span>

                        <div className="flex items-center gap-1.5 font-mono">
                          <button
                            onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            Prev
                          </button>

                          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => (
                            <button
                              key={n}
                              onClick={() => goToPage(n)}
                              className={`h-8 w-8 text-[11px] font-bold rounded-lg border transition cursor-pointer ${currentPage === n
                                ? "bg-teal-800 border-teal-800 text-white shadow-xs"
                                : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50"
                                }`}
                            >
                              {n}
                            </button>
                          ))}

                          <button
                            onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                          >
                            Next
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <BlogReader
                blog={selectedBlog}
                blogs={blogs}
                currentUser={currentUser}
                onBack={() => onSelectBlog(null)}
                onSelectBlog={onSelectBlog}
                onRequireLogin={onRequireLogin}
                onUpdateBlog={onUpdateBlog}
                onOpenLightbox={onOpenLightbox}
                onToast={onToast}
              />
            )}
          </div>

          <BlogSidebar
            blogs={blogs}
            selectedBlog={selectedBlog}
            selectedTag={tag}
            onSelectBlog={onSelectBlog}
            onSelectTag={pickTag}
          />
        </div>
      </motion.div>
    </MotionWrapper>
  );
};

export default BlogPage;
