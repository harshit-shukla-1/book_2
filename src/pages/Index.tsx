import { useState } from "react";
import { Book, PenLine, ArrowRight, Trash2, CheckCircle2 } from "lucide-react";
import { EditorArea } from "@/components/EditorArea";
import { showSuccess, showError } from "@/utils/toast";

const Index = () => {
  const [draftContent, setDraftContent] = useState("");
  const [finalContent, setFinalContent] = useState("");

  const handleApproveDraft = () => {
    if (!draftContent.trim()) {
      showError("Draft is empty. Nothing to approve.");
      return;
    }

    // Append draft content to final content, with a double newline if final already has text
    const newFinalContent = finalContent
      ? `${finalContent}\n\n${draftContent}`
      : draftContent;

    setFinalContent(newFinalContent);
    setDraftContent(""); // Clear draft after moving
    showSuccess("Draft approved and moved to final version!");
  };

  const handleClearDraft = () => {
    if (confirm("Are you sure you want to clear your draft?")) {
      setDraftContent("");
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="px-8 py-5 flex items-center justify-between bg-white shadow-sm border-b border-stone-200 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
            <Book size={24} />
          </div>
          <h1 className="text-2xl font-bold text-stone-800 tracking-tight">
            Novelizer
          </h1>
        </div>
        <div className="text-sm font-medium text-stone-500 bg-stone-100 px-4 py-2 rounded-full">
          Autosaving...
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-4 lg:p-8 flex flex-col lg:flex-row gap-6 h-[calc(100vh-88px)]">
        
        {/* Left Column: Drafts */}
        <div className="flex-1 h-full min-h-[400px]">
          <EditorArea
            title="Rough Draft"
            value={draftContent}
            onChange={setDraftContent}
            icon={<PenLine size={20} />}
            placeholder="Let your ideas flow freely here..."
            className="border-indigo-100"
            actions={
              <>
                <button
                  onClick={handleClearDraft}
                  className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Clear draft"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={handleApproveDraft}
                  disabled={!draftContent.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-full transition-all active:scale-95 shadow-sm"
                >
                  <span>Approve</span>
                  <ArrowRight size={16} />
                </button>
              </>
            }
          />
        </div>

        {/* Right Column: Final Version */}
        <div className="flex-1 h-full min-h-[400px]">
          <EditorArea
            title="Final Manuscript"
            value={finalContent}
            onChange={setFinalContent}
            icon={<CheckCircle2 size={20} className="text-emerald-500" />}
            placeholder="Your polished masterpiece will take shape here..."
            className="border-emerald-100"
          />
        </div>
        
      </main>
    </div>
  );
};

export default Index;