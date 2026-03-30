import React from 'react';

const Notes = ({ leadId, leadName, onClose }) => {
  const [notes, setNotes] = React.useState([]);
  const [text, setText] = React.useState('');
  const url = 'http://localhost:5000/notes';
  const token = localStorage.getItem("token");

  // FETCH NOTES
  const fetchNotes = React.useCallback(async () => {
    try {
      const res = await fetch(`${url}/${leadId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setNotes(data);
    } catch (err) { console.error("Fetch error:", err); }
  }, [leadId, token]);

  React.useEffect(() => { fetchNotes(); }, [fetchNotes]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await fetch(`${url}/${leadId}`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ content: text })
      });
      if (res.ok) {
        setText('');
        fetchNotes();
      }
    } catch (err) { console.error("Post error:", err); }
  }

  // DELETE NOTE
  async function handleDelete(noteId) {
    if (!window.confirm("Delete this note?")) return;
    try {
      const res = await fetch(`${url}/${noteId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchNotes();
    } catch (err) { console.error("Delete error:", err); }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-end z-[60]">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        <div className="p-6 border-b flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Notes</h2>
            <p className="text-xs text-blue-600 font-bold uppercase">{leadName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {notes.length === 0 ? (
            <p className="text-center text-slate-400 text-sm mt-10">No notes found.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-blue-500 uppercase">{note.author || 'User'}</span>
                  <button onClick={() => handleDelete(note.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{note.content}</p>
                <p className="text-[9px] text-slate-400 mt-2 text-right">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Input Form */}
        <div className="p-6 border-t bg-white">
          <form onSubmit={handleSend} className="flex flex-col gap-3">
            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none resize-none h-24"
              placeholder="Write a note..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button 
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
            >
              Send Note
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Notes;