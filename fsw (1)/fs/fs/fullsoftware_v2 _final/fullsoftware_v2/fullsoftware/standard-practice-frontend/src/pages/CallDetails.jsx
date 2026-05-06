import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Phone, 
  Clock, 
  RotateCcw, 
  Download, 
  History, 
  Trash2, 
  Zap, 
  PlayCircle,
  FileText,
  ChevronLeft,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  PhoneCall,
  Check,
  ThumbsUp,
  ThumbsDown,
  Info,
  Mic,
  Activity,
  MoreHorizontal,
  Plus,
  Copy
} from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import React from 'react';

const CallDetails = () => {
  const { batchId, callId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [callData, setCallData] = useState(null);
  const [batchData, setBatchData] = useState(null);
  const [userNotes, setUserNotes] = useState('');
  const [isAddingNotes, setIsAddingNotes] = useState(false);
  const [editingResultId, setEditingResultId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const API_BASE = 'http://127.0.0.1:8000/api/v1';

  useEffect(() => {
    fetchData();
  }, [batchId, callId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch batch data for context
      try {
        const bRes = await axios.get(`${API_BASE}/batches/${batchId}`);
        setBatchData(bRes.data);
      } catch (e) {
        setBatchData({ name: "Batch 2 - AC Jan 03, 2026", id: batchId, completed_calls: 340, total_calls: 493 });
      }

      // Simulation for demo
      setTimeout(() => {
        setCallData({
          id: callId || 'C-6513',
          patient: 'Palko, carol',
          insurance: 'Aarp medicare supplement',
          status: 'Paid',
          completedAt: '4/11/2026 4:11 PM',
          attempts: 2,
          created: '4/9/2026 2:49 PM',
          summary: "Called UnitedHealthcare AARP Medicare Supplement at 800-227-7782. Claim # 6000123025851. Agent searched claim status for DOS 03/11/2026. IVR reported claim processed 03/13/2026, allowed $128.15, paid $128.15, and check not issued yet.",
          results: [
            { id: 1, label: 'Summary', response: 'The IVR confirms the search was successful and can help the user by...', collected: 'unknown' },
            { id: 2, label: 'Transaction/Check Number', response: '—', collected: 'unknown' },
            { id: 3, label: 'Amount Paid', response: 'The insurance paid nearly the date and policy these cards.', collected: '$128.15' },
            { id: 4, label: 'Claim Paid Date', response: 'It was processed on 03/13/2026 for nearly the any day.', collected: '03/13/2026' },
            { id: 5, label: 'Patient Responsibility', response: '—', collected: 'unknown' },
            { id: 6, label: 'EFT Number', response: '—', collected: 'unknown' },
            { id: 7, label: 'Denial Reason', response: 'Medicare approach plan decline and nearly date and these cards.', collected: '$128.15' },
            { id: 8, label: 'Check Issue Date', response: 'The check has not been issued yet.', collected: 'Check has not been issued yet.' },
          ],
          transcripts: [
            {
              attempt: 3,
              time: '04/12/2026 1:41 AM',
              type: 'Most Recent',
              phone: '+1 800-227-7789',
              text: 'Thank you for calling UnitedHealthcare Medicare Insurance plans from UnitedHealthcare Insurance Company or one of its affiliates.'
            }
          ],
          additionalDetails: [
            { key: "Claim Status", val: "Paid" },
            { key: "Date of Service", val: "03/11/2026" },
            { key: "Amount Charged", val: "$154.00" },
            { key: "Medicare Paid", val: "$128.15" },
            { key: "Check Issue Date", val: "Check has not been issued yet" },
            { key: "Claim Number", val: "6000123025851" },
            { key: "Billed Amount", val: "$154.00" },
            { key: "Medicare Approved", val: "$128.15" },
            { key: "Insurance Paid", val: "$128.15" },
            { key: "Amount Paid by Insurance", val: "$128.15" },
            { key: "Processed Date", val: "03/13/2026" }
          ]
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    const headers = ["Field", "IVR Response", "Collected Info"];
    const rows = callData.results.map(r => [r.label, r.response, r.collected]);
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Call Report");
    XLSX.writeFile(workbook, `Call_Report_${callData.id}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7F9]">
        <Loader2 className="animate-spin text-[#3B82F6]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F9] flex flex-col pb-8 font-sans">
      <div className="max-w-[1536px] w-full mx-auto px-6 py-2">
        
        {/* Breadcrumbs & Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center space-x-2 text-[11px] mb-2 text-[#717784] font-bold">
              <Link to="/" className="hover:text-[#3B82F6] transition-colors">Dashboard</Link>
              <ChevronRight size={12} strokeWidth={3} />
              <Link to="/search-batches" className="hover:text-[#3B82F6] transition-colors">Call Batch</Link>
              <ChevronRight size={12} strokeWidth={3} />
              <Link to={`/batches/view/${batchId}`} className="text-[#3B82F6] font-black">View Call Batch</Link>
            </div>
            <h1 className="text-[28px] font-black text-[#1A1C21] tracking-tight leading-none">View Call Batch</h1>
            <p className="text-[#717784] text-[13px] font-bold mt-1">Review the summary and details of this call batch.</p>
          </div>

          {/* Stepper */}
          <div className="flex items-center space-x-4">
            <StepItem number={1} label="Info to Collect" completed />
            <ChevronRight size={14} className="text-[#3B82F6] opacity-50" />
            <StepItem number={2} label="Data" completed />
            <ChevronRight size={14} className="text-[#3B82F6] opacity-50" />
            <StepItem number={3} label="Schedule" completed />
            <ChevronRight size={14} className="text-[#D0D5DD]" />
            <StepItem number={4} label="Report" active />
          </div>
        </div>

        {/* Call Banner */}
        <div className="bg-[#2563EB] bg-gradient-to-br from-[#60A5FA] via-[#3B82F6] to-[#2563EB] rounded-[24px] p-6 text-white shadow-xl relative overflow-hidden mb-6">
          {/* Subtle wave pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none">
              <path d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100 L1000,200 L0,200 Z" fill="white" />
              <path d="M0,150 C200,250 400,-50 600,150 C800,350 900,50 1000,150 L1000,200 L0,200 Z" fill="white" />
            </svg>
          </div>
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex space-x-5">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-[18px] flex items-center justify-center border border-white/20 shadow-inner">
                <Phone size={28} className="text-white" />
              </div>
              <div className="max-w-4xl">
                <div className="flex items-center space-x-3 mb-3">
                  <h2 className="text-[22px] font-black tracking-tight uppercase">CALL ID: {callData.id}</h2>
                  <span className="bg-[#FFFFFF33] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white/20 backdrop-blur-sm flex items-center shadow-sm">
                    AI-Powered
                  </span>
                </div>
                <p className="text-[14px] font-semibold text-white/90 leading-relaxed max-w-2xl">
                  {callData.summary}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-6">
              <div className="flex items-center space-x-4">
                 <span className="text-[14px] font-black tracking-widest text-white/80">
                   493 / 443
                 </span>
                 <div className="flex space-x-1.5">
                    <button className="w-8 h-8 rounded-xl border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all shadow-sm">
                       <ChevronLeft size={18} />
                    </button>
                    <button className="w-8 h-8 rounded-xl border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all shadow-sm">
                       <ChevronRight size={18} />
                    </button>
                 </div>
              </div>
              <button 
                onClick={() => setIsAddingNotes(!isAddingNotes)}
                className="px-5 py-2 bg-white/10 border border-white/20 rounded-xl text-[12px] font-black hover:bg-white/20 transition-all flex items-center backdrop-blur-sm shadow-md group"
              >
                <Edit2 size={14} className="mr-2 group-hover:scale-110 transition-transform" />
                Add Call Notes
              </button>
            </div>
          </div>
        </div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
           <MetricCard 
             icon={<PhoneCall size={20}/>} 
             label="Completed Calls" 
             value="340 / 493" 
             percentage="68.9%" 
             color="text-[#059669]" 
             bg="bg-[#ECFDF5]" 
             borderColor="border-[#A7F3D0]"
           />
           <MetricCard 
             icon={<Clock size={20}/>} 
             label="In Review" 
             value="128" 
             percentage="25.9%" 
             color="text-[#3B82F6]" 
             bg="bg-[#E8F1FC]" 
             borderColor="border-[#D0E3F9]"
           />
           <MetricCard 
             icon={<RotateCcw size={20}/>} 
             label="Total Attempts" 
             value={callData.attempts} 
             percentage="0.5%" 
             color="text-[#7C3AED]" 
             bg="bg-[#F5F3FF]" 
             borderColor="border-[#DDD6FE]"
           />
           <MetricCard 
             icon={<Clock size={20}/>} 
             label="Avg Call Time" 
             value="4m 6s" 
             color="text-[#EA580C]" 
             bg="bg-[#FFF7ED]" 
             borderColor="border-[#FED7AA]"
           />
        </div>

        {/* Content Layout */}
        <div className="flex gap-6">
          
          {/* Main Content (Left) */}
          <div className="flex-1 space-y-6">
             
             {/* Call Overview Section */}
             <div className="bg-white rounded-[24px] p-6 border border-[#EAECEF] shadow-sm relative">
                <div className="flex items-center space-x-3 mb-4">
                   <div className="w-8 h-8 bg-[#E8F1FC] rounded-[10px] flex items-center justify-center text-[#3B82F6] border border-[#D0E3F9]">
                      <FileText size={18} />
                   </div>
                   <h3 className="font-black text-[#1A1C21] text-[15px]">Call Overview</h3>
                   <span className="bg-[#E8F1FC] text-[#3B82F6] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-[#D0E3F9] flex items-center shadow-sm">
                      <Zap size={10} className="mr-1 fill-[#3B82F6]" /> AI-Powered
                   </span>
                </div>
                <p className="text-[13px] font-semibold text-[#4A4F59] leading-relaxed">
                   Called UnitedHealthcare AARP Medicare Supplement at 800-227-7782. Claim # 6000123025851. Agent Baa checked claim status for DOS 03/11/2026. IVR reported claim processed 03/13/2026, allowed $128.15, paid $128.15, and check not issued yet.
                   <br/><br/>
                   Transaction/Check number, patient responsibility, and EFT number were not provided; call ended after the IVR closed the session.
                </p>
             </div>

             {/* Call Results Table */}
             <div className="bg-white rounded-[24px] border border-[#EAECEF] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#EAECEF] flex justify-between items-center bg-[#F9FAFB]">
                   <div className="flex items-center space-x-3">
                      <CheckCircle2 size={20} className="text-[#3B82F6]" />
                      <h3 className="font-black text-[#1A1C21] text-[15px]">Call Results</h3>
                   </div>
                   <div className="flex items-center text-[12px] font-black text-[#717784] bg-white px-3 py-1 rounded-lg border border-[#EAECEF] shadow-sm">
                      <Info size={14} className="mr-2 text-[#98A2B3]" /> 18 Info Collected
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-[#F8FAFC]">
                         <tr className="border-b border-[#EAECEF]">
                            <th className="px-6 py-3 text-[11px] font-black text-[#717784] uppercase tracking-widest w-12 text-center">#</th>
                            <th className="px-4 py-3 text-[11px] font-black text-[#717784] uppercase tracking-widest">FIELD</th>
                            <th className="px-4 py-3 text-[11px] font-black text-[#717784] uppercase tracking-widest w-[40%]">IVR RESPONSE</th>
                            <th className="px-4 py-3 text-[11px] font-black text-[#717784] uppercase tracking-widest">INFO COLLECTED</th>
                            <th className="px-6 py-3 text-[11px] font-black text-[#717784] uppercase tracking-widest text-center">EDIT</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EAECEF]">
                         {callData.results.map((r, idx) => (
                            <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors group">
                               <td className="px-6 py-4 text-[12px] font-bold text-[#98A2B3] text-center">{r.id}</td>
                               <td className="px-4 py-4 text-[13px] font-black text-[#1A1C21]">{r.label}</td>
                               <td className="px-4 py-4 text-[12px] font-semibold text-[#4A4F59] leading-tight pr-10">{r.response}</td>
                               <td className="px-4 py-4">
                                  <span className={`text-[13px] font-black ${r.collected === 'unknown' ? 'text-red-500' : 'text-[#1A1C21]'}`}>{r.collected}</span>
                               </td>
                               <td className="px-6 py-4 text-center">
                                  <button className="text-[#98A2B3] hover:text-[#3B82F6] transition-all p-1.5 rounded-lg hover:bg-[#E8F1FC]">
                                     <Edit2 size={14} />
                                  </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                <div className="px-6 py-3 border-t border-[#EAECEF] bg-[#F9FAFB] flex justify-end">
                   <button className="text-[12px] font-black text-red-500 hover:text-red-600 flex items-center group">
                      <Trash2 size={14} className="mr-2 group-hover:scale-110 transition-transform" /> Delete Call Results
                   </button>
                </div>
             </div>

             {/* Call Transcript Section */}
             <div className="bg-white rounded-[24px] p-6 border border-[#EAECEF] shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                   <div className="w-8 h-8 bg-[#E8F1FC] rounded-[10px] flex items-center justify-center text-[#3B82F6] border border-[#D0E3F9]">
                      <FileText size={18} />
                   </div>
                   <h3 className="font-black text-[#1A1C21] text-[15px]">Call Transcript</h3>
                </div>
                <div className="pb-4 mb-4 border-b border-[#EAECEF] flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                      <span className="text-[14px] font-black text-[#1A1C21]">Attempt #3</span>
                      <span className="text-[11px] font-bold text-[#717784]">04/12/2026 1:41 AM</span>
                      <span className="bg-[#FFF7ED] text-[#EA580C] text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-[#FED7AA] shadow-sm">Most Recent</span>
                      <span className="text-[11px] font-black text-[#717784] bg-[#F4F7F9] px-2.5 py-0.5 rounded-lg border border-[#EAECEF]">4m 28s</span>
                   </div>
                   <button className="text-[12px] font-black text-[#3B82F6] hover:underline flex items-center group">
                      View full transcript <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
                <div className="text-[13px] leading-relaxed p-4 bg-[#F8FAFC] rounded-2xl border border-[#EAECEF]">
                   <span className="font-black text-[#3B82F6] mr-3">System:</span>
                   <span className="font-semibold text-[#4A4F59]">Thank you for calling UnitedHealthcare Medicare Insurance plans from UnitedHealthcare Insurance Company or one of its affiliates.</span>
                </div>
             </div>

             {/* Full Output (Download Links) */}
             <div>
                <h3 className="text-[15px] font-black text-[#1A1C21] mb-4 ml-1 uppercase tracking-wider">Full Output</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white rounded-[24px] p-5 border border-[#EAECEF] shadow-sm">
                      <div className="flex items-center space-x-3 mb-5 pb-3 border-b border-[#F4F7F9]">
                         <div className="w-8 h-8 bg-[#F8FAFC] rounded-[10px] flex items-center justify-center text-[#717784] border border-[#EAECEF]">
                            <Phone size={16} />
                         </div>
                         <h4 className="text-[13px] font-black text-[#1A1C21]">Call Recordings</h4>
                      </div>
                      <div className="space-y-4">
                         {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-[#F8FAFC] p-2 -m-2 rounded-xl transition-all">
                               <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-[#E8F1FC] text-[#3B82F6] flex items-center justify-center group-hover:bg-[#3B82F6] group-hover:text-white transition-all shadow-sm border border-[#D0E3F9]">
                                     <Mic size={14} />
                                  </div>
                                  <span className="text-[12px] font-bold text-[#4A4F59] group-hover:text-[#1A1C21]">Call Recording - 4/12/2026</span>
                               </div>
                               <Download size={14} className="text-[#98A2B3] group-hover:text-[#3B82F6] transition-colors" />
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="bg-white rounded-[24px] p-5 border border-[#EAECEF] shadow-sm">
                      <div className="flex items-center space-x-3 mb-5 pb-3 border-b border-[#F4F7F9]">
                         <div className="w-8 h-8 bg-[#F8FAFC] rounded-[10px] flex items-center justify-center text-[#717784] border border-[#EAECEF]">
                            <Activity size={16} />
                         </div>
                         <h4 className="text-[13px] font-black text-[#1A1C21]">Call Transcripts</h4>
                      </div>
                      <div className="space-y-4">
                         {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-[#F8FAFC] p-2 -m-2 rounded-xl transition-all">
                               <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-[#E8F1FC] text-[#3B82F6] flex items-center justify-center group-hover:bg-[#3B82F6] group-hover:text-white transition-all shadow-sm border border-[#D0E3F9]">
                                     <FileText size={14} />
                                  </div>
                                  <span className="text-[12px] font-bold text-[#4A4F59] group-hover:text-[#1A1C21]">Call Transcript - 4/12/2026</span>
                               </div>
                               <Download size={14} className="text-[#98A2B3] group-hover:text-[#3B82F6] transition-colors" />
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>

          </div>

          {/* Right Sidebar (Cards) */}
          <div className="w-[340px] shrink-0 space-y-6">
             
             {/* Batch Summary Card */}
             <div className="bg-white rounded-[24px] p-6 border border-[#EAECEF] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center space-x-2">
                      <FileText size={18} className="text-[#3B82F6]" />
                      <h3 className="font-black text-[#1A1C21] text-[15px]">Batch Summary</h3>
                   </div>
                   <span className="text-[10px] font-black text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-lg border border-[#A7F3D0] shadow-sm">Completed</span>
                </div>
                <div className="space-y-3.5 mb-6">
                   <SidebarRow label="Batch Title" value="Batch 2 - AC Jan 03, 2026" />
                   <SidebarRow label="Call Type" value="Claims IVR" badge />
                   <SidebarRow label="Goal" value="Claim Status" />
                   <SidebarRow label="To" value="Insurance" />
                   <SidebarRow label="Regarding" value="Patient" />
                   <SidebarRow label="Batch ID" value={batchId || "hardcoded-1"} />
                </div>
                <div className="pt-4 border-t border-[#F4F7F9] flex items-center justify-between">
                   <button className="text-[12px] font-black text-[#3B82F6] hover:underline">View Batch Quality</button>
                   <div className="flex space-x-4">
                      <ThumbsUp size={16} className="text-[#98A2B3] cursor-pointer hover:text-[#3B82F6] transition-all hover:scale-110" />
                      <ThumbsDown size={16} className="text-[#98A2B3] cursor-pointer hover:text-red-500 transition-all hover:scale-110" />
                   </div>
                </div>
             </div>

             {/* Batch Activity Card */}
             <div className="bg-white rounded-[24px] p-6 border border-[#EAECEF] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center space-x-2">
                      <Activity size={18} className="text-[#3B82F6]" />
                      <h3 className="font-black text-[#1A1C21] text-[15px]">Batch Activity</h3>
                   </div>
                   <span className="flex items-center text-[11px] font-black text-[#059669]">
                      <div className="w-2 h-2 rounded-full bg-[#059669] mr-2 shadow-sm"></div> Completed
                   </span>
                </div>
                <div className="space-y-3.5 mb-6">
                   <SidebarRow label="Calls" value="340 / 493 complete" />
                   <SidebarRow label="Last Attempt" value="4/12/2026 1:41 AM" />
                   <SidebarRow label="Attempts" value="2" />
                   <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-[#717784] uppercase tracking-widest">Created</span>
                      <div className="flex items-center space-x-2">
                         <div className="w-6 h-6 rounded-lg bg-[#E8F1FC] flex items-center justify-center text-[10px] font-black text-[#3B82F6] border border-[#D0E3F9] shadow-sm">AC</div>
                         <span className="text-[13px] font-black text-[#1A1C21]">1/3/2026</span>
                      </div>
                   </div>
                </div>
                <div className="pt-4 border-t border-[#F4F7F9] text-center">
                   <button className="text-[12px] font-black text-[#3B82F6] hover:underline">View Details</button>
                </div>
             </div>

             {/* Additional Details Grid Card */}
             <div className="bg-white rounded-[24px] p-6 border border-[#EAECEF] shadow-sm">
                <div className="flex items-center space-x-2 mb-6">
                   <Info size={18} className="text-[#3B82F6]" />
                   <h3 className="font-black text-[#1A1C21] text-[15px]">Additional Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   {callData.additionalDetails.map((detail, idx) => (
                      <div key={idx} className="flex items-start">
                         <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-1.5 mr-2 shrink-0 shadow-[0_0_4px_rgba(59,130,246,0.4)]"></div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-[#717784] uppercase tracking-widest leading-none mb-1">{detail.key}</span>
                            <span className="text-[11px] font-bold text-[#1A1C21] leading-tight">{detail.val}</span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Download Call Report CTA Button */}
             <div className="bg-gradient-to-br from-[#60A5FA] to-[#2563EB] rounded-[24px] p-1 shadow-lg shadow-blue-900/20 relative group overflow-hidden">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <button 
                  onClick={handleDownloadReport}
                  className="relative z-10 w-full flex flex-col items-center justify-center p-6 bg-transparent rounded-[20px] transition-transform group-active:scale-95"
                >
                   <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-4 shadow-inner">
                      <Download size={24} className="text-white" />
                   </div>
                   <h4 className="text-[18px] font-black text-white text-center leading-tight mb-5">Download<br/>Call Report</h4>
                   <div className="w-full bg-white text-[#3B82F6] py-3 rounded-xl text-[13px] font-black shadow-xl hover:bg-[#F8FAFC] transition-colors">
                      Download Report
                   </div>
                </button>
             </div>

          </div>

        </div>

      </div>
    </div>
  );
};

// Helper Components
const StepItem = ({ number, label, active, completed }) => (
  <div className="flex items-center space-x-2">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[11px] transition-all duration-300
      ${active ? 'bg-[#3B82F6] text-white shadow-lg scale-110 ring-4 ring-blue-100' : 
        completed ? 'bg-[#3B82F6] text-white' : 'bg-white border-2 border-[#D0D5DD] text-[#98A2B3]'}`}>
      {completed && !active ? <Check size={12} strokeWidth={4} /> : number}
    </div>
    <span className={`block font-black text-[11px] tracking-tight ${active || completed ? 'text-[#1A1C21]' : 'text-[#717784]'}`}>{label}</span>
  </div>
);

const MetricCard = ({ icon, label, value, percentage, color, bg, borderColor }) => (
  <div className={`bg-white rounded-[24px] p-5 border border-[#EAECEF] shadow-sm flex items-center justify-between group hover:shadow-md transition-all hover:-translate-y-1`}>
     <div className="flex items-center space-x-4">
        <div className={`w-11 h-11 rounded-[14px] ${bg} ${color} flex items-center justify-center border ${borderColor} shadow-sm transition-transform group-hover:scale-110`}>
           {icon}
        </div>
        <div className="flex flex-col">
           <span className="text-[11px] font-black text-[#717784] uppercase tracking-widest leading-none mb-1.5">{label}</span>
           <span className="text-[20px] font-black text-[#1A1C21] tracking-tight">{value}</span>
        </div>
     </div>
     {percentage && (
        <div className={`flex items-center ${color} text-[11px] font-black px-2 py-1 rounded-lg ${bg} border ${borderColor}`}>
           <div className={`w-1.5 h-1.5 rounded-full bg-current mr-2`}></div>
           {percentage}
        </div>
     )}
  </div>
);

const SidebarRow = ({ label, value, badge }) => (
  <div className="flex justify-between items-center">
    <span className="text-[11px] font-bold text-[#717784] uppercase tracking-widest leading-none">{label}</span>
    {badge ? (
      <span className="text-[10px] font-black text-[#3B82F6] bg-[#E8F1FC] px-2 py-0.5 rounded-lg border border-[#D0E3F9] shadow-sm">{value}</span>
    ) : (
      <span className="text-[13px] font-black text-[#1A1C21] tracking-tight">{value}</span>
    )}
  </div>
);

export default CallDetails;
