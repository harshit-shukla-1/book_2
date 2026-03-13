import { useState, useMemo, useEffect } from "react";
import { Heart, BookHeart, Menu, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

// Automatically import all markdown files from the chapters directory
const chapterFiles = import.meta.glob('/src/content/chapters/*.md', { 
  query: '?raw', 
  import: 'default', 
  eager: true 
});

interface Chapter {
  id: string;
  filename: string;
  title: string;
  content: string;
}

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Parse and sort the chapters
  const chapters: Chapter[] = useMemo(() => {
    return Object.entries(chapterFiles)
      .map(([path, content]) => {
        const filename = path.split('/').pop() || '';
        const rawContent = content as string;
        
        // Extract the title from the first H1 heading (# Title)
        const match = rawContent.match(/^#\s+(.*)/m);
        let title = match ? match[1] : filename.replace('.md', '').replace(/^\d+-/, '').replace(/-/g, ' ');

        return {
          id: filename,
          filename,
          title,
          content: rawContent,
        };
      })
      .sort((a, b) => a.filename.localeCompare(b.filename)); // Sort alphabetically by filename (01-, 02-, etc.)
  }, []);

  const [activeChapterId, setActiveChapterId] = useState<string>(
    chapters.length > 0 ? chapters[0].id : ""
  );

  const activeChapter = chapters.find((c) => c.id === activeChapterId);

  // Close sidebar on mobile when a chapter is selected
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-rose-50/50 flex flex-col font-sans selection:bg-rose-200">
      {/* Top Navigation */}
      <header className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md shadow-sm border-b border-rose-100 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-rose-600 hover:bg-rose-50 rounded-full"
          >
            <Menu size={24} />
          </button>
          <div className="p-2 bg-rose-100 text-rose-600 rounded-xl hidden sm:block">
            <Heart size={20} fill="currentColor" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-rose-950 tracking-tight font-serif italic">
            For Tanya
          </h1>
        </div>
        <div className="text-sm font-medium text-rose-400 bg-rose-100/50 px-4 py-1.5 rounded-full flex items-center gap-2">
          <BookHeart size={16} />
          <span className="hidden sm:inline">A collection of unspoken words</span>
        </div>
      </header>

      <div className="flex flex-1 max-w-6xl w-full mx-auto relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-rose-950/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Chapters Sidebar */}
        <aside className={cn(
          "fixed lg:sticky top-[73px] h-[calc(100vh-73px)] w-72 bg-white lg:bg-transparent border-r border-rose-100 shadow-xl lg:shadow-none z-50 transform transition-transform duration-300 ease-in-out lg:transform-none overflow-y-auto",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6 lg:mb-8">
              <h2 className="text-sm uppercase tracking-widest font-bold text-rose-400">Chapters</h2>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-rose-400 hover:text-rose-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-2">
              {chapters.length === 0 ? (
                <p className="text-sm text-rose-300 italic">No chapters yet.</p>
              ) : (
                chapters.map((chap, index) => (
                  <button
                    key={chap.id}
                    onClick={() => {
                      setActiveChapterId(chap.id);
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "text-left px-4 py-3 rounded-xl transition-all duration-200 group flex items-start gap-3",
                      activeChapterId === chap.id
                        ? "bg-rose-500 text-white shadow-md shadow-rose-200"
                        : "hover:bg-rose-100/50 text-rose-900"
                    )}
                  >
                    <span className={cn(
                      "text-xs font-bold mt-1",
                      activeChapterId === chap.id ? "text-rose-200" : "text-rose-400 group-hover:text-rose-500"
                    )}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-serif font-medium leading-snug">
                      {chap.title.replace(/^Chapter \d+:\s*/, '')}
                    </span>
                  </button>
                ))
              )}
            </nav>
          </div>
        </aside>

        {/* Main Reading Area */}
        <main className="flex-1 min-w-0 bg-white shadow-sm lg:my-6 lg:mr-6 rounded-none lg:rounded-3xl border-x lg:border border-rose-100 min-h-[calc(100vh-73px)] lg:min-h-0">
          <div className="max-w-3xl mx-auto px-6 py-12 sm:px-12 sm:py-16 md:px-16 md:py-20 h-full">
            {activeChapter ? (
              <article className="prose prose-rose prose-slate lg:prose-lg max-w-none prose-headings:font-serif prose-headings:font-medium prose-p:font-serif prose-p:leading-relaxed prose-p:text-slate-700">
                <ReactMarkdown>
                  {activeChapter.content}
                </ReactMarkdown>
              </article>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-rose-300 space-y-4">
                <BookHeart size={48} className="opacity-50" />
                <p className="font-serif text-lg text-center">Your story is waiting to be written...</p>
                <p className="text-sm opacity-75">Add markdown files to the <code className="bg-rose-50 px-2 py-1 rounded">src/content/chapters</code> folder.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;