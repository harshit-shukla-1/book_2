import { useState } from "react";
import { Heart, PenLine, Sparkles, Trash2, Plus, BookHeart } from "lucide-react";
import { EditorArea } from "@/components/EditorArea";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

interface Chapter {
  id: string;
  title: string;
  content: string;
}

const Index = () => {
  const [draftContent, setDraftContent] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: "1", title: "Chapter 1: The Beginning", content: "" }
  ]);
  const [activeChapterId, setActiveChapterId] = useState<string>("1");

  const activeChapter = chapters.find((c) => c.id === activeChapterId) || chapters[0];

  const handleApproveDraft = () => {
    if (!draftContent.trim()) {
      showError("There are no words to save yet.");
      return;
    }

    setChapters((prev) =>
      prev.map((chap) => {
        if (chap.id === activeChapterId) {
          const newContent = chap.content
            ? `${chap.content}\n\n${draftContent}`
            : draftContent;
          return { ...chap, content: newContent };
        }
        return chap;
      })
    );

    setDraftContent(""); // Clear draft after moving
    showSuccess(`Your feelings have been added to ${activeChapter.title}.`);
  };

  const handleClearDraft = () => {
    if (confirm("Are you sure you want to discard these words?")) {
      setDraftContent("");
    }
  };

  const handleAddChapter = () => {
    const newId = Date.now().toString();
    const newChapter = {
      id: newId,
      title: `Chapter ${chapters.length + 1}`,
      content: "",
    };
    setChapters([...chapters, newChapter]);
    setActiveChapterId(newId);
    showSuccess("New chapter created.");
  };

  const handleDeleteChapter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (chapters.length === 1) {
      showError("Your story needs at least one chapter.");
      return;
    }
    if (confirm("Are you sure you want to delete this chapter entirely?")) {
      const newChapters = chapters.filter((c) => c.id !== id);
      setChapters(newChapters);
      if (activeChapterId === id) {
        setActiveChapterId(newChapters[0].id);
      }
      showSuccess("Chapter removed.");
    }
  };

  const handleUpdateChapterContent = (content: string) => {
    setChapters((prev) =>
      prev.map((chap) =>
        chap.id === activeChapterId ? { ...chap, content } : chap
      )
    );
  };

  const handleUpdateChapterTitle = (id: string, newTitle: string) => {
    setChapters((prev) =>
      prev.map((chap) => (chap.id === id ? { ...chap, title: newTitle } : chap))
    );
  };

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col font-sans selection:bg-rose-200">
      {/* Top Navigation */}
      <header className="px-8 py-5 flex items-center justify-between bg-white/80 backdrop-blur-md shadow-sm border-b border-rose-100 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
            <Heart size={24} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-rose-950 tracking-tight font-serif italic">
            For Tanya
          </h1>
        </div>
        <div className="text-sm font-medium text-rose-400 bg-rose-100/50 px-4 py-2 rounded-full">
          Holding onto every word...
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-4 lg:p-8 flex flex-col lg:flex-row gap-6 h-[calc(100vh-88px)]">
        {/* Left Column: Drafts */}
        <div className="w-full lg:w-5/12 h-full min-h-[400px]">
          <EditorArea
            title="Unspoken Words"
            value={draftContent}
            onChange={setDraftContent}
            icon={<PenLine size={20} />}
            placeholder="What are you feeling right now? What do you wish you could tell her?"
            className="border-rose-200 shadow-rose-100/50"
            actions={
              <>
                <button
                  onClick={handleClearDraft}
                  className="p-2 text-rose-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Discard words"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={handleApproveDraft}
                  disabled={!draftContent.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-200 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-full transition-all active:scale-95 shadow-sm shadow-rose-200"
                >
                  <span>Keep Memory</span>
                  <Heart
                    size={16}
                    className={draftContent.trim() ? "animate-pulse" : ""}
                  />
                </button>
              </>
            }
          />
        </div>

        {/* Right Column: Final Version (Chapters) */}
        <div className="flex-1 h-full min-h-[400px] flex flex-col bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-rose-200 overflow-hidden transition-all duration-300 hover:shadow-md">
          {/* Header / Toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-50/50">
            <div className="flex items-center gap-2">
              <span className="text-rose-500">
                <Sparkles size={20} />
              </span>
              <h2 className="text-lg font-semibold text-rose-900">
                The Story of Us
              </h2>
            </div>
            <button
              onClick={handleAddChapter}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-100 text-rose-600 hover:bg-rose-200 hover:text-rose-700 text-sm font-medium rounded-full transition-colors"
            >
              <Plus size={16} />
              <span>New Chapter</span>
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
            {/* Chapters Sidebar */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-rose-100 bg-rose-50/30 overflow-y-auto p-4 flex flex-col gap-3">
              {chapters.map((chap) => (
                <div
                  key={chap.id}
                  onClick={() => setActiveChapterId(chap.id)}
                  className={cn(
                    "group relative p-4 rounded-2xl cursor-pointer transition-all border text-left flex flex-col gap-1",
                    activeChapterId === chap.id
                      ? "bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-200/50"
                      : "bg-white text-rose-900 border-rose-100 hover:border-rose-300 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      value={chap.title}
                      onChange={(e) =>
                        handleUpdateChapterTitle(chap.id, e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "w-full bg-transparent outline-none font-semibold truncate",
                        activeChapterId === chap.id
                          ? "text-white placeholder:text-rose-200"
                          : "text-rose-900 placeholder:text-rose-300"
                      )}
                      placeholder="Chapter title..."
                    />
                    {chapters.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteChapter(chap.id, e)}
                        className={cn(
                          "opacity-0 group-hover:opacity-100 p-1.5 rounded-full transition-all flex-shrink-0",
                          activeChapterId === chap.id
                            ? "hover:bg-rose-600 text-rose-200 hover:text-white"
                            : "hover:bg-rose-100 text-rose-300 hover:text-rose-600"
                        )}
                        title="Delete Chapter"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div
                    className={cn(
                      "text-xs font-medium flex items-center gap-1",
                      activeChapterId === chap.id
                        ? "text-rose-100"
                        : "text-rose-400"
                    )}
                  >
                    <BookHeart size={12} />
                    {
                      chap.content
                        .trim()
                        .split(/\s+/)
                        .filter((w) => w.length > 0).length
                    }{" "}
                    words
                  </div>
                </div>
              ))}
            </div>

            {/* Chapter Editor Space */}
            <div className="flex-1 flex flex-col bg-white">
              <div className="flex-1 p-6 md:p-8">
                <textarea
                  value={activeChapter?.content || ""}
                  onChange={(e) => handleUpdateChapterContent(e.target.value)}
                  placeholder="The pages of your love story will be woven together here..."
                  className="w-full h-full resize-none outline-none text-lg leading-relaxed text-slate-800 font-serif placeholder:text-rose-300 bg-transparent selection:bg-rose-200"
                  spellCheck={false}
                />
              </div>

              {/* Word Count Footer */}
              <div className="px-6 py-3 border-t border-rose-50 bg-rose-50/30 text-xs font-medium text-rose-400 flex justify-end">
                {
                  (activeChapter?.content || "")
                    .trim()
                    .split(/\s+/)
                    .filter((word) => word.length > 0).length
                }{" "}
                words in {activeChapter?.title || "this chapter"}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;