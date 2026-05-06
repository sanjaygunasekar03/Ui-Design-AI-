import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FileText,
  Clock,
  CheckCircle2,
  Phone,
  Target,
  Calendar,
  Flag,
  Shield,
  TrendingDown,
  TrendingUp,
  MoreVertical,
  ChevronDown
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

const ContactInsights = () => {
  const [activeTab, setActiveTab] = useState('Success');
  const [contactFilter, setContactFilter] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [timeFilter, setTimeFilter] = useState('Last 30');
  const [batches, setBatches] = useState([]);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [batchesRes, callsRes] = await Promise.all([
        axios.get(`${API_BASE}/batches`),
        axios.get(`${API_BASE}/calls`),
      ]);
      setBatches(batchesRes.data);
      setCalls(callsRes.data);
    } catch (err) {
      console.error('Error fetching contact insights data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Derive contacts table data from real calls
  const getFilteredData = () => {
    let filteredCalls = calls;

    // Filter by batch
    if (selectedBatch !== 'all') {
      filteredCalls = filteredCalls.filter(c => c.batch_id === selectedBatch);
    }

    // Filter by time (simplified - filter by call_date recency)
    if (timeFilter === 'Last 7') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      filteredCalls = filteredCalls.filter(c => new Date(c.call_date) >= cutoff);
    }

    // Group calls by call_to (insurance/contact)
    const grouped = {};
    filteredCalls.forEach(call => {
      const key = call.call_to || 'Unknown';
      if (!grouped[key]) {
        grouped[key] = { calls: [], lastCallDate: null };
      }
      grouped[key].calls.push(call);
      if (!grouped[key].lastCallDate || call.call_date > grouped[key].lastCallDate) {
        grouped[key].lastCallDate = call.call_date;
      }
    });

    return Object.entries(grouped).map(([contactId, data]) => {
      const totalCalls = data.calls.length;
      const completedCalls = data.calls.filter(c => c.status === 'Completed').length;
      const successPercent = totalCalls > 0 ? Math.round((completedCalls / totalCalls) * 100) : 0;
      const batchName = batches.find(b => b.id === data.calls[0]?.batch_id)?.name || data.calls[0]?.batch_id || '';
      return {
        contactId,
        callType: data.calls[0]?.call_type || 'Claims Status',
        goal: 'Claim Status',
        contactStatus: completedCalls === totalCalls ? 'Completed' : completedCalls > 0 ? 'In Progress' : 'Pending',
        calls: totalCalls,
        lastCall: data.lastCallDate ? new Date(data.lastCallDate).toLocaleDateString() : '—',
        successPercent,
        batch: batchName,
      };
    }).filter(item => !contactFilter || item.contactId.toLowerCase().includes(contactFilter.toLowerCase()));
  };

  const contactsData = getFilteredData();





  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#1A1C21] tracking-tight">Contact Insights</h1>
          <p className="text-sm text-[#717784] mt-1">Track performance. Drive better outcomes.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-[#4A4F59]">Batch:</span>
            <div className="relative">
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 border border-[#D0D5DD] rounded-lg text-sm font-semibold text-[#1A1C21] focus:outline-none focus:ring-2 focus:ring-[#00B8D9] bg-white cursor-pointer min-w-[160px]"
              >
                <option value="all">All Batches</option>
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id}>{batch.name || batch.id}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#717784] pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTimeFilter('Last 7')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors border ${
                timeFilter === 'Last 7'
                  ? 'border-[#1359D2] text-[#1359D2] bg-[#F0F5FF]'
                  : 'border-[#D0D5DD] text-[#4A4F59] hover:bg-[#F7F8FA] bg-white'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeFilter('Last 30')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors border ${
                timeFilter === 'Last 30'
                  ? 'border-[#1359D2] bg-[#1359D2] text-white'
                  : 'border-[#D0D5DD] text-[#4A4F59] hover:bg-[#F7F8FA] bg-white'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#EAECEF] rounded-2xl p-5 shadow-sm flex flex-col relative overflow-hidden">
          <div className="flex items-start justify-between">
             <div className="flex items-center space-x-3">
               <div className="w-12 h-12 rounded-full bg-[#FFF3E0] text-[#FF5722] flex items-center justify-center">
                 <FileText size={24} />
               </div>
               <div>
                 <p className="text-sm font-bold text-[#4A4F59]">Submitted</p>
                 <h3 className="text-2xl font-extrabold text-[#1A1C21]">1,248</h3>
               </div>
             </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
             <div className="flex items-center text-xs font-bold text-[#E02424]">
               <TrendingDown size={14} className="mr-1" />
               18.4% <span className="text-[#98A2B3] ml-1 font-normal">vs last 30 days</span>
             </div>
          </div>
          <div className="absolute right-0 bottom-4 w-24 h-10">
             <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
               <path d="M 0 20 Q 20 10 40 30 T 100 25" fill="none" stroke="#E02424" strokeWidth="2" strokeLinecap="round" />
             </svg>
          </div>
        </div>

        <div className="bg-white border border-[#EAECEF] rounded-2xl p-5 shadow-sm flex flex-col relative overflow-hidden">
          <div className="flex items-start justify-between">
             <div className="flex items-center space-x-3">
               <div className="w-12 h-12 rounded-full bg-[#FFF9C4] text-[#FBC02D] flex items-center justify-center">
                 <Clock size={24} />
               </div>
               <div>
                 <p className="text-sm font-bold text-[#4A4F59]">Submitted/Required</p>
                 <h3 className="text-2xl font-extrabold text-[#1A1C21]">856</h3>
               </div>
             </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
             <div className="flex items-center text-xs font-bold text-[#E02424]">
               <TrendingDown size={14} className="mr-1" />
               10.7% <span className="text-[#98A2B3] ml-1 font-normal">vs last 30 days</span>
             </div>
          </div>
          <div className="absolute right-0 bottom-4 w-24 h-10">
             <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
               <path d="M 0 15 Q 30 35 60 20 T 100 30" fill="none" stroke="#FBC02D" strokeWidth="2" strokeLinecap="round" />
             </svg>
          </div>
        </div>

        <div className="bg-white border border-[#EAECEF] rounded-2xl p-5 shadow-sm flex flex-col relative overflow-hidden">
          <div className="flex items-start justify-between">
             <div className="flex items-center space-x-3">
               <div className="w-12 h-12 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
                 <CheckCircle2 size={24} />
               </div>
               <div>
                 <p className="text-sm font-bold text-[#4A4F59]">Completed</p>
                 <h3 className="text-2xl font-extrabold text-[#1A1C21]">1,902</h3>
               </div>
             </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
             <div className="flex items-center text-xs font-bold text-[#16A34A]">
               <TrendingUp size={14} className="mr-1" />
               24.6% <span className="text-[#98A2B3] ml-1 font-normal">vs last 30 days</span>
             </div>
          </div>
          <div className="absolute right-0 bottom-4 w-24 h-10">
             <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
               <path d="M 0 35 Q 30 15 60 25 T 100 5" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
             </svg>
          </div>
        </div>

        <div className="bg-white border border-[#EAECEF] rounded-2xl p-5 shadow-sm flex flex-col relative overflow-hidden">
          <div className="flex items-start justify-between">
             <div className="flex items-center space-x-3">
               <div className="w-12 h-12 rounded-full bg-[#E1F1F8] text-[#1359D2] flex items-center justify-center">
                 <Phone size={24} />
               </div>
               <div>
                 <p className="text-sm font-bold text-[#4A4F59]">Total Contacts</p>
                 <h3 className="text-2xl font-extrabold text-[#1A1C21]">4,006</h3>
               </div>
             </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
             <div className="flex items-center text-xs font-bold text-[#717784]">
               —
             </div>
          </div>
          <div className="absolute right-0 bottom-4 w-24 h-10">
             <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
               <path d="M 0 25 Q 30 35 60 20 T 100 15" fill="none" stroke="#1359D2" strokeWidth="2" strokeLinecap="round" />
             </svg>
          </div>
        </div>
      </div>

      {/* Main Chart + At a Glance */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white border border-[#EAECEF] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#1A1C21]">Contact Activity Over Time</h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-[#FF5722] rounded-full"></div>
                <span className="text-xs font-bold text-[#717784]">Submitted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-[#FBC02D] rounded-full"></div>
                <span className="text-xs font-bold text-[#717784]">Submitted/Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-[#2E7D32] rounded-full"></div>
                <span className="text-xs font-bold text-[#717784]">Completed</span>
              </div>
              <button className="flex items-center space-x-2 px-3 py-1.5 border border-[#D0D5DD] rounded-lg text-xs font-semibold text-[#4A4F59] hover:bg-[#F7F8FA]">
                <Calendar size={14} />
                <span>Last 30 Days</span>
              </button>
            </div>
          </div>
          <div className="h-[300px] w-full relative">
            <svg width="100%" height="100%" viewBox="0 0 800 300" className="overflow-visible">
              <defs>
                <linearGradient id="gradOrange" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FF5722" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#FF5722" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gradYellow" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FBC02D" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#FBC02D" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gradGreen" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2E7D32" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid */}
              {Array.from({ length: 4 }).map((_, i) => (
                <g key={i}>
                  <line x1="40" y1={i * 75 + 10} x2="780" y2={i * 75 + 10} stroke="#EAECEF" strokeWidth="1" />
                  <text x="30" y={i * 75 + 15} className="text-xs font-medium fill-[#98A2B3]" textAnchor="end">
                    {['1.5K', '1K', '500', '0'][i]}
                  </text>
                </g>
              ))}
              {/* X Axis */}
              {['Mar 1', 'Mar 6', 'Mar 11', 'Mar 16', 'Mar 21', 'Mar 26', 'Mar 31'].map((label, i) => (
                <text key={i} x={40 + i * 123.3} y="260" className="text-xs font-medium fill-[#98A2B3]" textAnchor="middle">
                  {label}
                </text>
              ))}
              
              {/* Paths and Gradients */}
              <g>
                <path d="M 40 80 L 163 110 L 286 130 L 410 145 L 533 155 L 656 165 L 780 170 L 780 235 L 40 235 Z" fill="url(#gradOrange)" />
                <path d="M 40 80 L 163 110 L 286 130 L 410 145 L 533 155 L 656 165 L 780 170" fill="none" stroke="#FF5722" strokeWidth="3" />
                {[ {x:40,y:80}, {x:163,y:110}, {x:286,y:130}, {x:410,y:145}, {x:533,y:155}, {x:656,y:165}, {x:780,y:170} ].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#FF5722" stroke="white" strokeWidth="2" />
                ))}
              </g>

              <g>
                <path d="M 40 140 L 163 160 L 286 175 L 410 185 L 533 195 L 656 205 L 780 210 L 780 235 L 40 235 Z" fill="url(#gradYellow)" />
                <path d="M 40 140 L 163 160 L 286 175 L 410 185 L 533 195 L 656 205 L 780 210" fill="none" stroke="#FBC02D" strokeWidth="3" />
                {[ {x:40,y:140}, {x:163,y:160}, {x:286,y:175}, {x:410,y:185}, {x:533,y:195}, {x:656,y:205}, {x:780,y:210} ].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#FBC02D" stroke="white" strokeWidth="2" />
                ))}
              </g>

              <g>
                <path d="M 40 220 L 163 205 L 286 180 L 410 140 L 533 90 L 656 50 L 780 20 L 780 235 L 40 235 Z" fill="url(#gradGreen)" />
                <path d="M 40 220 L 163 205 L 286 180 L 410 140 L 533 90 L 656 50 L 780 20" fill="none" stroke="#2E7D32" strokeWidth="3" />
                {[ {x:40,y:220}, {x:163,y:205}, {x:286,y:180}, {x:410,y:140}, {x:533,y:90}, {x:656,y:50}, {x:780,y:20} ].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#2E7D32" stroke="white" strokeWidth="2" />
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* At a Glance */}
        <div className="bg-white border border-[#EAECEF] rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-[#1A1C21] mb-2 relative inline-block">
             At a Glance
             <span className="absolute left-[-24px] top-0 bottom-0 w-1 bg-[#1359D2] rounded-r-md"></span>
          </h3>
          
          <div className="flex-1 flex flex-col justify-between mt-4 space-y-3">
             <div className="flex items-center space-x-4 p-3 bg-[#F3E8FF] rounded-xl">
               <div className="w-10 h-10 rounded-full bg-[#E9D5FF] text-[#7E22CE] flex items-center justify-center">
                 <Target size={20} />
               </div>
               <div>
                 <p className="text-xs font-bold text-[#4A4F59]">Avg Success %</p>
                 <h4 className="text-lg font-extrabold text-[#1A1C21]">62.1%</h4>
               </div>
             </div>
             
             <div className="flex items-center space-x-4 p-3 bg-[#E0F8FC] rounded-xl">
               <div className="w-10 h-10 rounded-full bg-[#CCF0F6] text-[#00B8D9] flex items-center justify-center">
                 <Calendar size={20} />
               </div>
               <div>
                 <p className="text-xs font-bold text-[#4A4F59]">Last Call</p>
                 <h4 className="text-lg font-extrabold text-[#1A1C21]">Mar 31, 2024</h4>
               </div>
             </div>
             
             <div className="flex items-center space-x-4 p-3 bg-[#FCE8E8] rounded-xl">
               <div className="w-10 h-10 rounded-full bg-[#FAD1D1] text-[#E02424] flex items-center justify-center">
                 <Flag size={20} />
               </div>
               <div>
                 <p className="text-xs font-bold text-[#4A4F59]">Batches Processed</p>
                 <h4 className="text-lg font-extrabold text-[#1A1C21]">12</h4>
               </div>
             </div>
             
             <div className="flex items-center space-x-4 p-3 bg-[#FFF3E0] rounded-xl">
               <div className="w-10 h-10 rounded-full bg-[#FFE0B2] text-[#FF5722] flex items-center justify-center">
                 <Shield size={20} />
               </div>
               <div>
                 <p className="text-xs font-bold text-[#4A4F59]">Avg Calls per Batch</p>
                 <h4 className="text-lg font-extrabold text-[#1A1C21]">334</h4>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Contact Performance Table */}
      <div className="bg-white border border-[#EAECEF] rounded-2xl shadow-sm overflow-hidden mt-2">
        <div className="bg-[#1359D2] px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Contact Performance</h3>
          <button className="px-4 py-2 border border-white/30 text-white rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors flex items-center space-x-2">
            <span>View All Contacts</span>
            <span className="text-lg leading-none">&rarr;</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-white border-b border-[#EAECEF]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#4A4F59] uppercase">Contact #</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#4A4F59] uppercase">Call Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#4A4F59] uppercase">Goal</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#4A4F59] uppercase">Contact Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#4A4F59] uppercase">Calls</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#4A4F59] uppercase">Last Call</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#4A4F59] uppercase">Success %</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#4A4F59] uppercase">Batch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7] bg-white">
              {loading ? (
                <tr><td colSpan="8" className="px-6 py-8 text-center text-sm text-[#717784]">Loading...</td></tr>
              ) : contactsData.length === 0 ? (
                <tr><td colSpan="8" className="px-6 py-8 text-center text-sm text-[#717784]">No contacts found.</td></tr>
              ) : contactsData.map((contact, index) => {
                  const initial = contact.contactId.charAt(0).toUpperCase();
                  const colors = [
                    { bg: 'bg-[#1359D2]', text: 'text-white' },
                    { bg: 'bg-[#2E7D32]', text: 'text-white' },
                    { bg: 'bg-[#7E22CE]', text: 'text-white' },
                    { bg: 'bg-[#FBC02D]', text: 'text-[#1A1C21]' }
                  ];
                  const colorClass = colors[index % colors.length];

                  let statusClass = "bg-[#F3F4F6] text-[#4A4F59]";
                  if (contact.contactStatus === "Completed") statusClass = "bg-[#E8F5E9] text-[#2E7D32]";
                  else if (contact.contactStatus === "Pending") statusClass = "bg-[#FFF3E0] text-[#FF5722]";
                  else if (contact.contactStatus === "In Progress") statusClass = "bg-[#E1F1F8] text-[#1359D2]";

                  let successClass = "text-[#1A1C21]";
                  if (contact.successPercent === 0) successClass = "text-[#E02424] font-bold";
                  else if (contact.successPercent === 100) successClass = "text-[#2E7D32] font-bold";

                  return (
                    <tr key={contact.contactId} className="hover:bg-[#F7F8FA] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${colorClass.bg} ${colorClass.text}`}>
                            {initial}
                          </div>
                          <span className="text-sm font-bold text-[#1A1C21]">{contact.contactId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4F59]">
                        <span className="px-3 py-1 bg-[#E1F1F8] text-[#1359D2] rounded-md text-xs font-bold">{contact.callType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#4A4F59]">{contact.goal}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                         <span className={`px-3 py-1 rounded-md text-xs font-bold ${statusClass}`}>
                           {contact.contactStatus}
                         </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#4A4F59]">{contact.calls}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#4A4F59]">
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} className="text-[#98A2B3]" />
                          <span>{contact.lastCall}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${successClass}`}>{contact.successPercent}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#4A4F59]">
                        {contact.batch}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactInsights;