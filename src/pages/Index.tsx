import { useState } from "react";
import { Heart, PenLine, Sparkles, Trash2, SendHeart } from "lucide-react";
import { EditorArea } from "@/components/EditorArea";
import { showSuccess, showError } from "@/utils/toast";

const Index = () => {
  const [draftContent, setDraftContent] = useState("");
  const [finalContent, setFinalContent] = useState("");

  const handleApproveDraft = () => {
    if (!draftContent.trim()) {
      showError("There are no words to save yet.");
      return;
    }

    // Append draft content to final content, with a double newline if final already has text
    const newFinalContent = finalContent
      ? `${finalContent}\n\n${draftContent}`
      : draftContent;

    setFinalContent(newFinalContent);
    setDraftContent(""); // Clear draft after moving
    showSuccess("Your feelings have been added to the story.");
  };

  const handleClearDraft = () => {
    if (confirm("Are you sure you want to discard these words?")) {
      setDraftContent("");
    }
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
        <div className="flex-1 h-full min-h-[400px]">
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
                  <Heart size={16} className={draftContent.trim() ? "animate-pulse" : ""} />
                </button>
              </>
            }
          />
        </div>

        {/* Right Column: Final Version */}
        <div className="flex-1 h-full min-h-[400px]">
          <EditorArea
            title="The Story of Us"
            value={finalContent}
            onChange={setFinalContent}
            icon={<Sparkles size={20} className="text-rose-500" />}
            placeholder="The pages of your love story will be woven together here..."
            className="border-rose-200 shadow-rose-100/50 bg-white"
          />
        </div>
        
      </main>
    </div>
  );
};

export default Index;