import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, BarChart2, LogOut, Trash2, 
  MessageSquare, UserPlus, Loader2, X 
} from 'lucide-react';
import Notes from './Notes.jsx';
import { api } from './services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);
  const [stat, setStat] = React.useState({ total: 0, new: 0, contacted: 0, conversion: 0 });
  const [leads, setLeads] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [formData, setFormData] = React.useState({ name: "", email: '', phone: '' });
  const [on, setOn] = React.useState(false);
  const [selectedLead, setSelectedLead] = React.useState(null);

  const token = localStorage.getItem("token");
  const name = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchData = async () => {
    if (!token) return navigate('/');
    try {
      const [statsData, leadsData] = await Promise.all([api.getStats(), api.getLeads()]);
      setStat(statsData);
      setLeads(leadsData);
    } catch (error) {
      if (error.message.includes('401')) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchData(); }, [navigate]);

  const handleStatusChange = async (leadId, newStatus) => {
    const originalLeads = [...leads];
    setLeads(prev => prev.map(l => (l.id === leadId || l._id === leadId) ? { ...l, status: newStatus } : l));
    try {
      await api.updateLeadStatus(leadId, newStatus);
      const statsData = await api.getStats();
      setStat(statsData);
    } catch (error) {
      setLeads(originalLeads);
    }
  };

  const handleDelete = async (id) => {
    const originalLeads = [...leads];
    setLeads(prev => prev.filter(l => (l.id !== id && l._id !== id)));
    try {
      await api.deleteLead(id);
      const statsData = await api.getStats();
      setStat(statsData);
    } catch (error) {
      setLeads(originalLeads);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.createLead(formData);
      setOn(false);
      setFormData({ name: '', email: '', phone: '' });
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phone?.includes(searchQuery)
  );

  if (loading && leads.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Pipeline</h1>
            <p className="text-slate-500 text-sm">Welcome back, {name.full_name}</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/analytics')} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
              <BarChart2 size={22} />
            </button>
            <div className="h-6 w-[1px] bg-slate-200"></div>
            <button onClick={() => { localStorage.clear(); navigate('/'); }} className="p-2.5 text-slate-400 hover:text-red-500 rounded-2xl transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total', value: stat.total, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'New', value: stat.new, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Contacted', value: stat.contacted, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Won', value: stat.conversion, color: 'text-indigo-600', bg: 'bg-indigo-50' }
          ].map((s, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${s.bg} ${s.color}`}>{s.label}</span>
              <h2 className={`text-2xl font-black mt-3 ${s.color}`}>{s.value}</h2>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-sm"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={() => setOn(true)} className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
            <Plus size={20} /> Add New Lead
          </button>
        </div>

        {leads.length === 0 && !loading ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-center">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus className="text-blue-600" size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">No leads found</h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto font-medium">Start growing your business by adding your first lead to the dashboard.</p>
            <button onClick={() => setOn(true)} className="text-blue-600 font-bold hover:underline">Click here to start →</button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Name</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Phone</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id || lead._id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-900">{lead.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{lead.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{lead.phone || "N/A"}</td>
                      <td className="px-6 py-4">
                        <select 
                          value={lead.status?.toLowerCase()} 
                          onChange={(e) => handleStatusChange(lead.id || lead._id, e.target.value)}
                          className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border-none outline-none cursor-pointer ${
                            lead.status?.toLowerCase() === 'new' ? 'bg-emerald-50 text-emerald-600' :
                            lead.status?.toLowerCase() === 'contacted' ? 'bg-blue-50 text-blue-600' :
                            'bg-indigo-50 text-indigo-600'
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="won">Won</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {lead.date_added ? new Date(lead.date_added).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setSelectedLead(lead)} className="p-2 text-slate-400 hover:text-blue-600" title="Notes"><MessageSquare size={18} /></button>
                          <button onClick={() => handleDelete(lead.id || lead._id)} className="p-2 text-slate-400 hover:text-red-500" title="Delete"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {on && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative animate-in fade-in zoom-in duration-200">
               <button onClick={() => setOn(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
               <h2 className="text-2xl font-black mb-6">New Lead</h2>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <input required placeholder="Full Name" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input required type="email" placeholder="Email Address" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  <input type="tel" placeholder="Phone Number" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <button disabled={actionLoading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                    {actionLoading ? <Loader2 className="animate-spin" /> : 'Create Lead'}
                  </button>
               </form>
            </div>
          </div>
        )}

        {selectedLead && (
          <Notes leadId={selectedLead.id || selectedLead._id} leadName={selectedLead.name} onClose={() => setSelectedLead(null)} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;