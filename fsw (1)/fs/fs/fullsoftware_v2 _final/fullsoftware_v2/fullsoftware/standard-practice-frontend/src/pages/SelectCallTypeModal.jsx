import React from 'react';
import { X, Phone, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

const SelectCallTypeModal = ({ onClose, onSelectClaim, onRequestNew }) => {
  return (
    <div className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#F8FAFC] rounded-[24px] shadow-2xl max-w-[900px] w-full mx-auto overflow-hidden border border-white relative flex flex-col">
        
        {/* Header Section */}
        <div className="px-10 pt-8 pb-4 flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#3B82F6] rounded-full flex items-center justify-center shadow-lg">
              <Phone size={22} className="text-white fill-white" />
            </div>
            <div className="flex flex-col justify-center h-full">
              <h1 className="text-[26px] font-bold text-[#1A1C21] leading-none mb-1.5 mt-1">Select Call Type</h1>
              <div className="w-6 h-[3px] bg-[#3B82F6] rounded-full"></div>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full border border-[#D0D5DD] flex items-center justify-center text-[#3B82F6] hover:bg-[#F7F8FA] transition-colors bg-white shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-10 pb-8">
          <div className="mb-6">
            <h2 className="text-[16px] font-bold text-[#1A1C21] mb-1">What is the goal of this call batch?</h2>
            <p className="text-[#717784] text-[13px]">Pick what type of call you would like Bristol Healthcare Services to make on your behalf.</p>
          </div>

          <div className="space-y-6">
            {/* Primary Claims Card (Blue Banner) */}
            <div className="bg-gradient-to-r from-[#60A5FA] via-[#3B82F6] to-[#1E40AF] rounded-[20px] p-0 overflow-hidden shadow-xl relative w-full h-[320px] flex">
              
              {/* Background decorative circles */}
              <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none"></div>
              <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-[280px] h-[280px] border border-white/10 rounded-full pointer-events-none"></div>
              <div className="absolute top-1/2 left-[20%] -translate-y-1/2 w-[160px] h-[160px] border border-white/15 rounded-full pointer-events-none"></div>
              <div className="absolute bottom-0 left-[20%] -translate-x-1/2 w-64 h-32 bg-[#0052FF]/30 blur-[50px] rounded-full pointer-events-none"></div>

              {/* Left side Graphic area */}
              <div className="w-1/2 relative flex items-center justify-center z-10 h-full">
                <div className="relative w-64 h-64 flex items-center justify-center mt-10">
                  {/* Podium layers */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-16 bg-white/10 rounded-[50%] blur-sm"></div>
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-56 h-14 bg-[#1e61d8] rounded-[50%] shadow-[inset_0_-4px_10px_rgba(0,0,0,0.2)]"></div>
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-12 bg-white/90 rounded-[50%] border border-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] flex items-center justify-center">
                     <div className="w-36 h-8 bg-[#f8f9fc] rounded-[50%] shadow-inner"></div>
                  </div>
                  
                  {/* Floating Phone Graphic */}
                  <div className="absolute top-8 left-8 w-24 h-24 bg-white/95 shadow-2xl rounded-2xl rotate-[-12deg] flex items-center justify-center border-b-[6px] border-r-[4px] border-[#0A2688]/20 z-20">
                    <Phone size={48} className="text-[#3B82F6] fill-[#3B82F6]" />
                  </div>
                  
                  {/* Floating Document/Shield Graphic */}
                  <div className="absolute top-2 right-6 w-24 h-32 bg-[#e8effd] shadow-xl rounded-xl rotate-[8deg] flex flex-col p-4 border-2 border-white z-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/60 to-transparent"></div>
                    <div className="w-10 h-12 bg-[#3B82F6] rounded-lg mb-3 flex items-center justify-center shadow-md relative z-10">
                      <CheckCircle2 size={20} className="text-white" />
                    </div>
                    <div className="w-full h-1.5 bg-[#a3c0f1] rounded-full mb-2 relative z-10"></div>
                    <div className="w-4/5 h-1.5 bg-[#a3c0f1] rounded-full mb-2 relative z-10"></div>
                    <div className="w-full h-1.5 bg-[#a3c0f1] rounded-full relative z-10"></div>
                  </div>
                </div>
              </div>

              {/* Right side Content */}
              <div className="w-1/2 p-8 flex flex-col justify-center items-center z-10 relative text-center">
                <h3 className="text-[32px] font-bold text-white tracking-wide mb-1">Claims</h3>
                <div className="w-10 h-1 bg-white rounded-full mb-6"></div>
                
                <p className="text-white/95 text-[15px] leading-relaxed mb-6 max-w-[260px] font-medium">
                  Call insurance to manage and check the status of claims
                </p>

                <div className="flex justify-center items-center space-x-3 mb-8">
                  <span className="px-4 py-1.5 bg-[#E8F1FC] text-[#3B82F6] rounded-[10px] text-[13px] font-semibold tracking-wide shadow-sm">To: Insurance</span>
                  <span className="px-4 py-1.5 bg-[#E8F1FC] text-[#3B82F6] rounded-[10px] text-[13px] font-semibold tracking-wide shadow-sm">Re: Patient</span>
                </div>

                <button 
                  onClick={onSelectClaim}
                  className="flex flex-col items-center justify-center group cursor-pointer mt-2"
                >
                  <div className="w-14 h-14 rounded-full border-[1.5px] border-white/50 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-colors">
                    <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                      <ArrowRight size={22} className="text-[#3B82F6]" />
                    </div>
                  </div>
                  <span className="text-white text-sm font-semibold tracking-wide">Select This Call Type</span>
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
                onClick={onRequestNew}
                className="px-6 py-2.5 border-[1.5px] border-[#3B82F6] text-[#3B82F6] rounded-full font-semibold hover:bg-[#F7FAFC] transition-colors flex items-center space-x-2 bg-white"
              >
                <FileText size={16} />
                <span>Request New Call Type</span>
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button 
              onClick={onClose}
              className="flex items-center space-x-1.5 text-[#3B82F6] font-semibold text-[15px] hover:text-[#0A2688] transition-colors"
            >
              <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                <X size={12} strokeWidth={3} />
              </div>
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCallTypeModal;
