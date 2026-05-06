import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RequestNewCallType from './RequestNewCallType';
import { X, Phone, ArrowRight, FileText, CheckCircle2, ChevronDown, Settings, Search, Eye, Star, MoreVertical, ArrowLeft, Shield, FlaskConical } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

const CreateBatchWizard = () => {
  const { step: stepParam } = useParams();
  const step = stepParam || 'select-type';
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({});
  const [templateFilter, setTemplateFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [ivrOnly, setIvrOnly] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  useEffect(() => {
    if (step === 'select-template') {
      fetchTemplates();
    }
  }, [step]);

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const res = await axios.get(`${API_BASE}/templates`);
      setTemplates(res.data);
    } catch (err) {
      console.error('Error fetching templates:', err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const callTypes = [
    { id: 'claims', name: 'Claims Status', description: 'Check the status of submitted claims' },
  ];

  const questions = [
    { id: 'patient_name', label: 'Patient Name', type: 'text' },
    { id: 'dob', label: 'Date of Birth', type: 'date' },
    { id: 'member_id', label: 'Member ID', type: 'text' },
    { id: 'dos', label: 'Date of Service', type: 'date' },
  ];


  const handleTypeSelect = (type) => {
    setSelectedType(type);
    navigate('/batches/new/select-template');
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    navigate(`/batches/edit/${templateId}`);
  };

  const handleFormChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleNext = () => {
    if (step === 'configure') navigate('/batches/new/upload');
    else if (step === 'upload') navigate('/batches/new/review');
  };

  const handleBack = () => {
    if (step === 'select-template') navigate('/batches/new/select-type');
    else if (step === 'configure') navigate('/batches/new/select-template');
    else if (step === 'upload') navigate('/batches/new/configure');
    else if (step === 'review') navigate('/batches/new/upload');
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleOpenRequestForm = () => {
    setShowRequestForm(true);
  };

  const handleCloseRequestForm = () => {
    setShowRequestForm(false);
  };

  const handleRequestSubmit = (formData) => {
    console.log('New call type request submitted:', formData);
    // In a real app, this would send the data to an API
  };

  if (step === 'select-type' || !step) {
    return (
      <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#F8FAFC] rounded-[24px] shadow-2xl max-w-[750px] w-full mx-auto overflow-hidden border border-white relative flex flex-col max-h-[90vh] overflow-y-auto">
          
          {/* Header Section */}
          <div className="px-8 pt-6 pb-4 flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#3B82F6] rounded-full flex items-center justify-center shadow-lg">
                <Phone size={18} className="text-white fill-white" />
              </div>
              <div className="flex flex-col justify-center h-full">
                <h1 className="text-2xl font-bold text-[#1A1C21] leading-none mb-1 mt-1">Select Call Type</h1>
                <div className="w-6 h-[3px] bg-[#3B82F6] rounded-full"></div>
              </div>
            </div>
            
            <button 
              onClick={handleClose} 
              className="w-8 h-8 rounded-full border border-[#D0D5DD] flex items-center justify-center text-[#3B82F6] hover:bg-[#F7F8FA] transition-colors bg-white shadow-sm"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-8 pb-6">
            <div className="mb-4">
              <h2 className="text-[15px] font-bold text-[#1A1C21] mb-1">What is the goal of this call batch?</h2>
              <p className="text-[#717784] text-[12px]">Pick what type of call you would like Bristol Healthcare Services to make on your behalf.</p>
            </div>

            <div className="space-y-4">
              {/* Primary Claims Card (Blue Banner) */}
              <div className="bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] rounded-[20px] p-0 overflow-hidden shadow-xl relative w-full h-[260px] flex">
                
                {/* Background decorative circles */}
                <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-[300px] h-[300px] border border-white/10 rounded-full pointer-events-none"></div>
                <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-[200px] h-[200px] border border-white/20 rounded-full pointer-events-none"></div>
                <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-[100px] h-[100px] border border-white/30 rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-[20%] -translate-x-1/2 w-48 h-24 bg-white/10 blur-[40px] rounded-full pointer-events-none"></div>

                {/* Left side Graphic area */}
                <div className="w-1/2 relative flex items-center justify-center z-10 h-full scale-90 origin-center">
                  <div className="relative w-56 h-56 flex items-center justify-center mt-6">
                    {/* Podium layers */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-14 bg-white/10 rounded-[50%] blur-sm"></div>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-12 bg-blue-600 rounded-[50%] shadow-[inset_0_-4px_10px_rgba(0,0,0,0.1)]"></div>
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-40 h-10 bg-white/90 rounded-[50%] border border-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex items-center justify-center">
                       <div className="w-32 h-6 bg-[#f8f9fc] rounded-[50%] shadow-inner"></div>
                    </div>
                    
                    {/* Floating Phone Graphic */}
                    <div className="absolute top-6 left-6 w-20 h-20 bg-white/95 shadow-xl rounded-2xl rotate-[-12deg] flex items-center justify-center border-b-[4px] border-r-[2px] border-blue-900/10 z-20">
                      <Phone size={40} className="text-[#3B82F6] fill-[#3B82F6]" />
                    </div>
                    
                    {/* Floating Document/Shield Graphic */}
                    <div className="absolute top-2 right-4 w-20 h-28 bg-white shadow-lg rounded-xl rotate-[8deg] flex flex-col p-3 border border-gray-100 z-10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/80 to-transparent"></div>
                      <div className="w-8 h-10 bg-[#3B82F6] rounded-lg mb-2 flex items-center justify-center shadow-sm relative z-10">
                        <CheckCircle2 size={16} className="text-white" />
                      </div>
                      <div className="w-full h-1 bg-blue-100 rounded-full mb-1.5 relative z-10"></div>
                      <div className="w-4/5 h-1 bg-blue-100 rounded-full mb-1.5 relative z-10"></div>
                      <div className="w-full h-1 bg-blue-100 rounded-full relative z-10"></div>
                    </div>
                  </div>
                </div>

                {/* Right side Content */}
                <div className="w-1/2 p-6 flex flex-col justify-center items-center z-10 relative text-center">
                  <h3 className="text-2xl font-bold text-white tracking-wide mb-1">Claims</h3>
                  <div className="w-8 h-1 bg-white rounded-full mb-4"></div>
                  
                  <p className="text-white/95 text-[13px] leading-relaxed mb-4 max-w-[220px] font-medium">
                    Call insurance to manage and check the status of claims
                  </p>

                  <div className="flex justify-center items-center space-x-2 mb-4">
                    <span className="px-3 py-1 bg-[#E8F1FC] text-[#3B82F6] rounded-lg text-[11px] font-semibold tracking-wide shadow-sm">To: Insurance</span>
                    <span className="px-3 py-1 bg-[#E8F1FC] text-[#3B82F6] rounded-lg text-[11px] font-semibold tracking-wide shadow-sm">Re: Patient</span>
                  </div>

                  <button 
                    onClick={() => handleTypeSelect('claims')}
                    className="flex flex-col items-center justify-center group cursor-pointer mt-1"
                  >
                    <div className="w-12 h-12 rounded-full border-[1.5px] border-white/50 flex items-center justify-center mb-2 group-hover:bg-white/10 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <ArrowRight size={18} className="text-[#3B82F6]" />
                      </div>
                    </div>
                    <span className="text-white text-[13px] font-semibold tracking-wide">Select This Call Type</span>
                  </button>
                </div>
              </div>

              {/* Secondary Request Card */}
              <div className="bg-white border border-[#EAECEF] rounded-[16px] p-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-16 relative flex items-center justify-center">
                    <div className="absolute w-full h-full">
                      {/* CSS Box Graphic to mimic the 3D question box */}
                      <div className="absolute bottom-2 left-4 w-12 h-8 bg-[#3B82F6] rotate-[-5deg] rounded-sm flex items-center justify-center shadow-md">
                        <div className="w-10 h-6 bg-[#0e44a3] rounded-sm shadow-inner"></div>
                      </div>
                      <div className="absolute top-0 right-4 text-[#3B82F6] font-bold text-3xl rotate-[15deg]">?</div>
                      {/* Decorative tiny clouds/planes */}
                      <div className="absolute top-2 left-0 w-3 h-1 bg-[#D0D5DD] rounded-full"></div>
                      <div className="absolute bottom-6 -right-2 w-2 h-2 bg-[#3B82F6]/30 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex flex-col mb-1.5">
                      <h3 className="text-[16px] font-bold text-[#1A1C21] leading-tight mb-1">Not seeing your call type?</h3>
                      <div className="w-6 h-[2px] bg-[#3B82F6]"></div>
                    </div>
                    <p className="text-[#717784] text-[13px]">We can create a custom call type tailored to your needs.</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleOpenRequestForm}
                  className="px-6 py-2.5 border-[1.5px] border-[#3B82F6] text-[#3B82F6] rounded-full font-semibold hover:bg-[#F7FAFC] transition-colors flex items-center space-x-2 bg-white"
                >
                  <FileText size={16} />
                  <span>Request New Call Type</span>
                </button>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button 
                onClick={handleClose}
                className="flex items-center space-x-1.5 text-[#3B82F6] font-semibold text-[15px] hover:text-[#0A2688] transition-colors"
              >
                <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                  <X size={12} strokeWidth={3} />
                </div>
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Request New Call Type Form */}
          {showRequestForm && (
            <RequestNewCallType
              onClose={handleCloseRequestForm}
              onSubmit={handleRequestSubmit}
            />
          )}
        </div>
      </div>
    );
  }

  if (step === 'select-template') {
    const filteredTemplates = templates
      .filter(template => {
        if (ivrOnly && !template.is_ivr_only) return false;
        if (searchTerm && !template.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        if (templateFilter !== 'All' && template.status !== templateFilter) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'A-Z') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'Most Recent') {
          return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === 'Most Used') {
          // Placeholder: sort by name for most used in this demo
          return a.name.localeCompare(b.name);
        }
        return 0;
      });

    // Helper for styles inside component
    const getTemplateStyle = (name) => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('verification')) {
        return {
          icon: <Shield size={28} className="text-[#3B82F6]" />,
          iconBg: 'bg-[#E8F1FC]',
          iconBorder: 'border-[#3B82F6]/10',
          btnBg: 'bg-[#3B82F6]',
          btnHover: 'hover:bg-[#0A2688]',
          badgeText: 'text-[#3B82F6]',
          badgeBg: 'bg-[#E8F1FC]',
          desc: 'Verify customer information and identity using secure questions.'
        };
      } else if (lowerName.includes('test')) {
        return {
          icon: <FlaskConical size={28} className="text-[#EA580C]" />,
          iconBg: 'bg-[#FFF7ED]',
          iconBorder: 'border-[#EA580C]/10',
          btnBg: 'bg-[#EA580C]',
          btnHover: 'hover:bg-[#C2410C]',
          badgeText: 'text-[#EA580C]',
          badgeBg: 'bg-[#FFF7ED]',
          desc: 'Share and explain test results to the customer.'
        };
      } else {
        return {
          icon: <FileText size={28} className="text-[#059669]" />,
          iconBg: 'bg-[#ECFDF5]',
          iconBorder: 'border-[#059669]/10',
          btnBg: 'bg-[#059669]',
          btnHover: 'hover:bg-[#047857]',
          badgeText: 'text-[#059669]',
          badgeBg: 'bg-[#ECFDF5]',
          desc: 'Check the current status of a customer\'s claim.'
        };
      }
    };

    return (
      <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-[#F8FAFC] rounded-[24px] shadow-2xl max-w-[1100px] w-full mx-auto overflow-hidden border border-white flex flex-col h-[85vh]">
          
          {/* Main content scrollable area */}
          <div className="flex-1 overflow-y-auto p-8">
            
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8 relative">
              <div className="flex items-center space-x-5 z-10">
                <div className="w-14 h-14 bg-[#3B82F6] rounded-full flex items-center justify-center shadow-lg">
                  <FileText size={26} className="text-white" />
                </div>
                <div>
                  <h1 className="text-[28px] font-bold text-[#1A1C21] tracking-tight mb-1">Select a Call Template</h1>
                  <p className="text-[#717784] text-[15px]">Choose the best template for your call conversation.</p>
                </div>
              </div>
              
              {/* CSS Graphic on Right */}
              <div className="absolute right-0 top-[-20px] w-64 h-32 opacity-80 pointer-events-none hidden md:block">
                {/* Decorative dots */}
                <div className="absolute left-0 top-1/2 flex space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]/20"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]/20"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]/20"></div>
                </div>
                <div className="absolute left-0 top-[60%] flex space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]/20"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]/20"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]/20"></div>
                </div>
                {/* Floating Cards */}
                <div className="absolute right-10 top-2 w-24 h-24 bg-gradient-to-br from-[#E8F1FC] to-[#D0E3F9] rounded-2xl rotate-[-10deg] shadow-sm"></div>
                <div className="absolute right-16 top-6 w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center rotate-[-5deg] border border-white">
                  <Phone size={32} className="text-[#3B82F6] fill-[#3B82F6]" />
                </div>
                <div className="absolute right-2 top-10 w-16 h-12 bg-white rounded-lg shadow-md flex items-center justify-center rotate-[10deg] border border-white">
                   <div className="w-8 h-1.5 bg-[#3B82F6]/40 rounded-full mb-2"></div>
                   <div className="absolute top-4 w-10 h-1.5 bg-[#3B82F6]/20 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between p-3.5 bg-white border border-[#3B82F6]/20 rounded-[16px] shadow-sm mb-8 space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3 px-2">
                  <span className="text-[#1A1C21] font-semibold text-[14px]">Sort by</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none pl-3 pr-8 py-2 border border-[#D0D5DD] rounded-[10px] text-[14px] text-[#4A4F59] font-medium bg-white focus:outline-none focus:border-[#3B82F6]"
                    >
                      <option>Most Recent</option>
                      <option>Most Used</option>
                      <option>A-Z</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#717784] pointer-events-none" />
                  </div>
                </div>

                <div className="w-[1px] h-6 bg-[#EAECEF]"></div>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={ivrOnly}
                      onChange={(e) => setIvrOnly(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border-2 border-[#D0D5DD] rounded bg-white checked:bg-[#3B82F6] checked:border-[#3B82F6] transition-colors"
                    />
                    <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
                  </div>
                  <span className="text-[14px] text-[#1A1C21] font-semibold">IVR Templates Only</span>
                </label>

                <div className="w-[1px] h-6 bg-[#EAECEF]"></div>

                <div className="flex items-center space-x-3">
                  <span className="text-[#1A1C21] font-semibold text-[14px]">Template Status</span>
                  <div className="relative">
                    <select
                      value={templateFilter}
                      onChange={(e) => setTemplateFilter(e.target.value)}
                      className="appearance-none pl-3 pr-8 py-2 border border-[#D0D5DD] rounded-[10px] text-[14px] text-[#4A4F59] font-medium bg-white focus:outline-none focus:border-[#3B82F6]"
                    >
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Draft</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#717784] pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-[#E8F1FC] px-3 py-1.5 rounded-lg border border-[#D0E3F9]">
                  <div className="w-5 h-5 flex items-center justify-center text-[#3B82F6]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                  </div>
                  <span className="text-[13px] text-[#3B82F6] font-semibold leading-tight">{filteredTemplates.length} templates<br/>found</span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10 pr-4 py-2 border border-[#D0D5DD] rounded-[10px] text-[14px] focus:outline-none focus:border-[#3B82F6]"
                  />
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3]" />
                </div>
              </div>
            </div>

            {/* Template List */}
            <div className="space-y-4 pb-8">
              {loadingTemplates ? (
                <div className="text-center py-20 text-[#717784]">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-[#3B82F6] border-t-transparent rounded-full mb-4"></div>
                  <p>Loading templates...</p>
                </div>
              ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-20 text-[#717784] bg-white border border-dashed border-[#D0D5DD] rounded-[16px] font-medium">
                  No templates found.
                </div>
              ) : filteredTemplates.map((template) => {
                const style = getTemplateStyle(template.name);
                
                return (
                  <div
                    key={template.id}
                    className={`bg-white border rounded-[16px] p-6 flex items-center justify-between transition-all duration-200 hover:shadow-md ${selectedTemplate === template.id ? 'border-[#3B82F6] shadow-md' : 'border-[#EAECEF]'}`}
                  >
                    <div className="flex items-start space-x-6">
                      <div className={`w-16 h-16 rounded-full ${style.iconBg} flex items-center justify-center border-[4px] ${style.iconBorder} shrink-0 mt-1`}>
                        {style.icon}
                      </div>
                      <div className="flex flex-col pt-1">
                        <div className="flex items-center space-x-3 mb-1.5">
                          <h3 className="text-[18px] font-bold text-[#1A1C21]">{template.name}</h3>
                          {template.is_ivr_only && (
                            <span className="px-2 py-0.5 bg-[#E8F1FC] text-[#3B82F6] rounded text-[11px] font-bold uppercase tracking-wider">IVR ONLY</span>
                          )}
                        </div>
                        <p className="text-[#717784] text-[14px] mb-4">
                          {style.desc}
                        </p>
                        <div className="flex items-center space-x-4 text-[13px]">
                          <div className="flex items-center space-x-1.5 text-[#4A4F59] font-medium">
                            <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            <span>{template.datapoints} Datapoints</span>
                          </div>
                          <div className="w-px h-3 bg-[#D0D5DD]"></div>
                          <span className={`px-2.5 py-0.5 ${style.badgeBg} ${style.badgeText} rounded text-[12px] font-bold`}>
                            {template.goal === 'verification' || !template.goal ? 'Claim Status' : template.goal}
                          </span>
                          <div className="w-px h-3 bg-[#D0D5DD]"></div>
                          <div className="flex items-center space-x-1.5 text-[#4A4F59] font-medium">
                            <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span>{template.created_at ? new Date(template.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) : 'Apr 9, 2026'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0">
                      <div className="flex items-center space-x-1 mr-2">
                        <button className="text-[#3B82F6] p-2 hover:bg-[#F7F8FA] rounded-full transition-colors">
                          <Star size={20} className={template.is_starred ? "fill-current" : ""} />
                        </button>
                        <button className="text-[#98A2B3] p-2 hover:bg-[#F7F8FA] rounded-full transition-colors">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect(template.id);
                        }}
                        className="px-5 py-2.5 bg-white border border-[#D0D5DD] text-[#1A1C21] rounded-[8px] hover:bg-[#F7F8FA] transition-colors font-semibold text-[14px] flex items-center space-x-2"
                      >
                        <Eye size={18} className="text-[#3B82F6]" />
                        <span>Preview</span>
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect(template.id);
                        }}
                        className={`px-5 py-2.5 ${style.btnBg} text-white rounded-[8px] ${style.btnHover} transition-colors font-semibold text-[14px] flex items-center space-x-2`}
                      >
                        <span>Use Template</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-8 py-5 border-t border-[#EAECEF] bg-white shrink-0">
            <button 
              onClick={handleBack} 
              className="flex items-center space-x-2 px-5 py-2.5 border border-[#D0D5DD] rounded-[8px] text-[#1A1C21] font-semibold text-[14px] hover:bg-[#F7F8FA] transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>
            
            <button 
              onClick={() => navigate('/templates')}
              className="flex items-center space-x-2 px-5 py-2.5 border border-[#D0D5DD] rounded-[8px] text-[#1A1C21] font-semibold text-[14px] hover:bg-[#F7F8FA] transition-colors"
            >
              <Settings size={18} className="text-[#3B82F6]" />
              <span>Manage Templates</span>
            </button>

            <div className="flex items-center space-x-2 text-[14px]">
              <span className="text-[#717784]">Sort by:</span>
              <span className="text-[#3B82F6] font-semibold flex items-center cursor-pointer">
                Most Recent <ChevronDown size={16} className="ml-1" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'configure') {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#1A1C21] tracking-tight mb-8">Configure Questions</h1>
        <div className="bg-white border border-[#EAECEF] rounded-xl p-8 space-y-6 shadow-sm">
          {questions.map((q) => (
            <div key={q.id}>
              <label className="block text-sm font-semibold text-[#4A4F59] mb-3 uppercase tracking-wider">{q.label}</label>
              <input
                type={q.type}
                className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg text-[#1A1C21] focus:outline-none focus:ring-2 focus:ring-[#00B8D9] bg-white"
                onChange={(e) => handleFormChange(q.id, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-8">
          <button onClick={handleBack} className="px-6 py-2.5 bg-white border border-[#D0D5DD] rounded-lg text-[#4A4F59] font-semibold hover:bg-[#F7F8FA] transition-colors">Back</button>
          <button onClick={handleNext} className="px-6 py-2.5 bg-[#00B8D9] text-white rounded-lg font-semibold hover:bg-[#00A3C1] transition-colors">Next</button>
        </div>
      </div>
    );
  }

  if (step === 'upload') {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#1A1C21] tracking-tight mb-8">Upload Data</h1>
        <div className="bg-white border-2 border-dashed border-[#D0D5DD] rounded-xl p-12 text-center shadow-sm hover:border-[#00B8D9] transition-colors">
          <p className="text-[#717784] mb-6 text-lg">Drag and drop your CSV file here or click to browse</p>
          <input type="file" accept=".csv" className="hidden" id="file-upload" />
          <label htmlFor="file-upload" className="bg-[#00B8D9] text-white px-6 py-3 rounded-lg cursor-pointer font-semibold hover:bg-[#00A3C1] transition-colors">
            Choose File
          </label>
        </div>
        <div className="flex justify-between mt-8">
          <button onClick={handleBack} className="px-6 py-2.5 bg-white border border-[#D0D5DD] rounded-lg text-[#4A4F59] font-semibold hover:bg-[#F7F8FA] transition-colors">Back</button>
          <button onClick={handleNext} className="px-6 py-2.5 bg-[#00B8D9] text-white rounded-lg font-semibold hover:bg-[#00A3C1] transition-colors">Next</button>
        </div>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#1A1C21] tracking-tight mb-8">Review & Create Batch</h1>
        <div className="bg-white border border-[#EAECEF] rounded-xl p-6 shadow-sm">
          <p className="text-[#1A1C21] text-lg"><strong>Type:</strong> {selectedType}</p>
          <p className="text-[#1A1C21] text-lg"><strong>Data:</strong> Ready to process</p>
        </div>
        <div className="flex justify-between mt-8">
          <button onClick={handleBack} className="px-6 py-2.5 bg-white border border-[#D0D5DD] rounded-lg text-[#4A4F59] font-semibold hover:bg-[#F7F8FA] transition-colors">Back</button>
          <button className="px-6 py-2.5 bg-[#00B8D9] text-white rounded-lg font-semibold hover:bg-[#00A3C1] transition-colors">Create Batch</button>
        </div>
      </div>
    );
  }

  return <div>Invalid step</div>;
};

export default CreateBatchWizard;