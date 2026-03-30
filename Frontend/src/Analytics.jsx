import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { api } from './services/api';

const Analytics = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getLeads();
        setLeads(data || []);
      } catch (err) {
        console.error("Error fetching leads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusCount = (statusName) => 
    leads.filter(l => l.status?.toLowerCase() === statusName.toLowerCase()).length;

  const statusData = [
    { name: 'New', value: getStatusCount('new'), color: '#10b981' },
    { name: 'Contacted', value: getStatusCount('contacted'), color: '#3b82f6' },
    { name: 'Won', value: getStatusCount('won'), color: '#6366f1' },
  ].filter(item => item.value > 0);
  const getTrendData = () => {
    const groups = leads.reduce((acc, lead) => {
      const date = new Date(lead.date_added || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(groups).map(date => ({ date, count: groups[date] }));
  };

  const totalLeads = leads.length;
  const wonLeads = getStatusCount('won');
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(0) : 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Insights</h1>
            <p className="text-slate-500 font-medium">Performance tracking for your lead pipeline.</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Conversion</p>
            <h2 className="text-3xl font-black text-blue-600">{conversionRate}%</h2>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${conversionRate}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Leads</p>
            <h2 className="text-3xl font-black text-slate-900">{totalLeads}</h2>
            <p className="text-xs text-slate-400 mt-2 font-bold uppercase">Database Size</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Won Leads</p>
            <h2 className="text-3xl font-black text-emerald-500">{wonLeads}</h2>
            <p className="text-xs text-slate-400 mt-2 font-bold uppercase">Closed Deals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Acquisition Growth</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={getTrendData()}>
                  <defs>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} fill="url(#colorBlue)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Pipeline Distribution</h3>
            <div className="flex-grow" style={{ width: '100%', height: 260 }}>
              {statusData.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={statusData}
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={10}
                      dataKey="value"
                      stroke="none"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={10} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                   <p className="text-sm italic font-medium">No leads in the pipeline yet</p>
                </div>
              )}
            </div>
            <div className="flex justify-center gap-6 pt-4 border-t border-slate-50">
                {statusData.map(s => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: s.color}} />
                    <span className="text-[10px] font-black text-slate-500 uppercase">{s.name}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm lg:col-span-2">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Lead Volume by Status</h3>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 800, fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={60} animationDuration={2000}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Analytics;