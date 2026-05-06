import React, { useState } from 'react';
import axios from 'axios';
import { Phone, FileText, Users, Target, BarChart2, Calendar, ShieldAlert, Mail, Send, X, CheckCircle2, Lightbulb, FilePlus2 } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

const RequestNewCallType = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    callTypeName: '',
    description: '',
    targetAudience: '',
    useCase: '',
    urgency: 'medium',
    contactEmail: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const DEFAULT_CONDITIONS = [
      {
        id: "paid",
        name: "Paid",
        visible: true,
        fields: [
          {"id": "transaction_check_number", "name": "Transaction/Check Number", "visible": true, "required": false},
          {"id": "amount_paid", "name": "Amount Paid", "visible": true, "required": false},
          {"id": "claim_paid_date", "name": "Claim Paid Date", "visible": true, "required": false},
          {"id": "patient_responsibility", "name": "Patient Responsibility", "visible": true, "required": false},
          {"id": "eft_number", "name": "EFT Number", "visible": true, "required": false}
        ]
      },
      {
        id: "denied",
        name: "Denied",
        visible: true,
        fields: [
          {"id": "denial_reason", "name": "Denial Reason", "visible": true, "required": false},
          {"id": "received_date", "name": "Received Date", "visible": true, "required": false},
          {"id": "claim_number", "name": "Claim Number", "visible": true, "required": false}
        ]
      },
      {
        id: "in_progress",
        name: "In Progress",
        visible: true,
        fields: [
          {"id": "expected_processing_time", "name": "Expected Processing Time", "visible": true, "required": false}
        ]
      }
    ];

    const DEFAULT_QUESTIONS = [
      {"id": "dob", "type": "date", "label": "Date of Birth"},
      {"id": "dos", "type": "date", "label": "Date of Service"},
      {"id": "member_id", "type": "text", "label": "Member ID"}
    ];

    try {
      await axios.post(`${API_BASE}/templates`, {
        name: formData.callTypeName,
        goal: formData.description,
        status: 'Requested',
        datapoints: `Level: ${formData.urgency.toUpperCase()}`,
        is_starred: false,
        is_ivr_only: false,
        created_at: new Date().toISOString(),
        questions: DEFAULT_QUESTIONS,
        conditions: DEFAULT_CONDITIONS
      });

      setIsSubmitting(false);
      setSubmitted(true);

      // Call the onSubmit callback to refresh the list
      if (onSubmit) {
        onSubmit(formData);
      }

      // Close after showing success message
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your request. Our team will review your new call type suggestion and get back to you within 2-3 business days.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
               <FilePlus2 className="text-blue-600" size={24} />
             </div>
             <h1 className="text-2xl font-bold text-gray-900">Request New Call Type</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-8 flex flex-col md:flex-row gap-12 overflow-y-auto">
            {/* Left Column: Info Panel */}
            <div className="w-full md:w-[350px] flex-shrink-0">
               <div className="bg-[#F4F9FF] rounded-2xl p-8 h-full flex flex-col border border-[#EBF3FF]">
                  {/* Illustration SVG */}
                  <div className="mb-8 relative h-48 flex items-center justify-center w-full">
                     <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 160V60C50 54.4772 54.4772 50 60 50H110L140 80V160C140 165.523 135.523 170 130 170H60C54.4772 170 50 165.523 50 160Z" fill="white" stroke="#1D4ED8" strokeWidth="4"/>
                        <path d="M110 50V80H140" fill="#E1EFFF" stroke="#1D4ED8" strokeWidth="4" strokeLinejoin="round"/>
                        <rect x="65" y="75" width="30" height="30" rx="6" fill="#3B82F6"/>
                        <path d="M75 90H85M80 85V95" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                        <line x1="65" y1="120" x2="125" y2="120" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round"/>
                        <line x1="65" y1="140" x2="105" y2="140" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round"/>
                        <path d="M110 160L135 135L145 145L120 170L110 160Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" strokeLinejoin="round"/>
                        <path d="M145 145L155 135C157 133 157 129 155 127L143 115C141 113 137 113 135 115L125 125L145 145Z" fill="#1D4ED8"/>
                        <path d="M140 30L160 10L175 25Z" fill="#3B82F6"/>
                        <path d="M140 40L145 45M170 20L175 25M170 50L175 55" stroke="#1D4ED8" strokeWidth="3" strokeLinecap="round"/>
                        <circle cx="170" cy="80" r="2" fill="#1D4ED8"/>
                        <circle cx="180" cy="60" r="2" fill="#1D4ED8"/>
                        <circle cx="40" cy="140" r="3" fill="#1D4ED8"/>
                        <circle cx="160" cy="160" r="2" fill="#1D4ED8"/>
                     </svg>
                  </div>
                  
                  <h2 className="text-[22px] font-extrabold text-gray-900 mb-3 leading-tight tracking-tight">Help us understand<br/>your new call type</h2>
                  <p className="text-sm font-medium text-gray-600 mb-8 leading-relaxed">
                     Provide details about the call type you'd like to create. Our team will review and get back to you.
                  </p>

                  <div className="border-t border-blue-100 pt-8 mt-auto">
                     <div className="flex items-center space-x-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                           <Lightbulb size={16} />
                        </div>
                        <span className="font-bold text-sm text-gray-900">Tips for a great request</span>
                     </div>

                     <ul className="space-y-5">
                        <li className="flex items-start space-x-3">
                           <div className="mt-0.5 bg-blue-600 rounded-full text-white p-0.5">
                              <CheckCircle2 size={12} strokeWidth={3} />
                           </div>
                           <span className="text-sm font-medium text-gray-600 leading-snug">Be clear and specific in your description</span>
                        </li>
                        <li className="flex items-start space-x-3">
                           <div className="mt-0.5 bg-blue-600 rounded-full text-white p-0.5">
                              <CheckCircle2 size={12} strokeWidth={3} />
                           </div>
                           <span className="text-sm font-medium text-gray-600 leading-snug">Include your target audience for better results</span>
                        </li>
                        <li className="flex items-start space-x-3">
                           <div className="mt-0.5 bg-blue-600 rounded-full text-white p-0.5">
                              <CheckCircle2 size={12} strokeWidth={3} />
                           </div>
                           <span className="text-sm font-medium text-gray-600 leading-snug">Choose the right urgency level to help us prioritize</span>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>

            {/* Right Column: Form Fields */}
            <div className="flex-1 space-y-8 relative pb-4">
               {/* Vertical dashed line */}
               <div className="absolute left-[23px] top-[24px] bottom-[24px] w-px border-l-2 border-dashed border-gray-100 z-0 hidden sm:block"></div>

               {/* Field: Call Type Name */}
               <div className="flex items-start space-x-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#F4F9FF] border border-[#EBF3FF] flex items-center justify-center flex-shrink-0">
                     <Phone className="text-blue-500" size={20} />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                     <label className="text-sm font-bold text-gray-900 w-[140px] flex-shrink-0">Call Type Name *</label>
                     <input type="text" name="callTypeName" value={formData.callTypeName} onChange={handleInputChange} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-gray-900 placeholder-gray-400" placeholder="e.g., Prescription Refills, Billing Inquiries, Test Results" required />
                  </div>
               </div>

               {/* Field: Description */}
               <div className="flex items-start space-x-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#F4F9FF] border border-[#EBF3FF] flex items-center justify-center flex-shrink-0">
                     <FileText className="text-blue-500" size={20} />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-2 sm:space-y-0">
                     <label className="text-sm font-bold text-gray-900 w-[140px] flex-shrink-0 mt-3">Description *</label>
                     <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-gray-900 placeholder-gray-400 resize-none" placeholder="Describe what this call type would accomplish..." required />
                  </div>
               </div>

               {/* Field: Target Audience */}
               <div className="flex items-start space-x-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#F4F9FF] border border-[#EBF3FF] flex items-center justify-center flex-shrink-0">
                     <Users className="text-blue-500" size={20} />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                     <label className="text-sm font-bold text-gray-900 w-[140px] flex-shrink-0">Target Audience</label>
                     <input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-gray-900 placeholder-gray-400" placeholder="e.g., Patients, Insurance Companies, Pharmacies" />
                  </div>
               </div>

               {/* Field: Specific Use Case */}
               <div className="flex items-start space-x-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#F4F9FF] border border-[#EBF3FF] flex items-center justify-center flex-shrink-0">
                     <Target className="text-blue-500" size={20} />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-2 sm:space-y-0">
                     <label className="text-sm font-bold text-gray-900 w-[140px] flex-shrink-0 mt-3">Specific Use Case</label>
                     <textarea name="useCase" value={formData.useCase} onChange={handleInputChange} rows={3} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-gray-900 placeholder-gray-400 resize-none" placeholder="Describe a specific scenario where this call type would be useful..." />
                  </div>
               </div>

               {/* Field: Urgency Level */}
               <div className="flex items-start space-x-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#F4F9FF] border border-[#EBF3FF] flex items-center justify-center flex-shrink-0">
                     <ShieldAlert className="text-blue-500" size={20} />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-2 sm:space-y-0">
                     <label className="text-sm font-bold text-gray-900 w-[140px] flex-shrink-0 mt-3">Urgency Level</label>
                     <div className="flex-1 space-y-3 w-full">
                        {/* Option: Low */}
                        <label className={`flex items-center p-4 border-2 ${formData.urgency === 'low' ? 'border-blue-500 bg-[#F4F9FF]' : 'border-gray-100'} rounded-2xl cursor-pointer transition-all`}>
                           <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-300 bg-white mr-4 relative">
                              {formData.urgency === 'low' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                              <input type="radio" name="urgency" value="low" checked={formData.urgency === 'low'} onChange={handleInputChange} className="opacity-0 absolute" />
                           </div>
                           <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mr-4">
                              <BarChart2 className="text-green-500" size={20} />
                           </div>
                           <div>
                              <span className="block text-sm font-bold text-gray-900">Low - Nice to have</span>
                              <span className="block text-xs font-medium text-gray-500 mt-0.5">Would be helpful but not critical</span>
                           </div>
                        </label>

                        {/* Option: Medium */}
                        <label className={`flex items-center p-4 border-2 ${formData.urgency === 'medium' ? 'border-blue-500 bg-[#F4F9FF] shadow-sm' : 'border-gray-100'} rounded-2xl cursor-pointer transition-all`}>
                           <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-300 bg-white mr-4 relative">
                              {formData.urgency === 'medium' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                              <input type="radio" name="urgency" value="medium" checked={formData.urgency === 'medium'} onChange={handleInputChange} className="opacity-0 absolute" />
                           </div>
                           <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mr-4">
                              <Calendar className="text-orange-500" size={20} />
                           </div>
                           <div>
                              <span className="block text-sm font-bold text-gray-900">Medium - Important</span>
                              <span className="block text-xs font-medium text-gray-500 mt-0.5">Would significantly improve workflow</span>
                           </div>
                        </label>

                        {/* Option: High */}
                        <label className={`flex items-center p-4 border-2 ${formData.urgency === 'high' ? 'border-blue-500 bg-[#F4F9FF]' : 'border-gray-100'} rounded-2xl cursor-pointer transition-all`}>
                           <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-300 bg-white mr-4 relative">
                              {formData.urgency === 'high' && <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>}
                              <input type="radio" name="urgency" value="high" checked={formData.urgency === 'high'} onChange={handleInputChange} className="opacity-0 absolute" />
                           </div>
                           <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mr-4">
                              <ShieldAlert className="text-red-500" size={20} />
                           </div>
                           <div>
                              <span className="block text-sm font-bold text-gray-900">High - Critical</span>
                              <span className="block text-xs font-medium text-gray-500 mt-0.5">Essential for current operations</span>
                           </div>
                        </label>
                     </div>
                  </div>
               </div>

               {/* Field: Contact Email */}
               <div className="flex items-start space-x-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#F4F9FF] border border-[#EBF3FF] flex items-center justify-center flex-shrink-0">
                     <Mail className="text-blue-500" size={20} />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                     <label className="text-sm font-bold text-gray-900 w-[140px] flex-shrink-0">Contact Email *</label>
                     <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm font-semibold text-gray-900 placeholder-gray-400" placeholder="your.email@company.com" required />
                  </div>
               </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center sm:justify-end items-center px-8 py-5 border-t border-gray-100 bg-white sm:space-x-4 mt-auto">
             <button type="button" onClick={handleCancel} className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 mr-4 sm:mr-0">
                <X size={18} className="text-gray-400" />
                <span>Cancel</span>
             </button>
             <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50">
                {isSubmitting ? (
                   <span>Submitting...</span>
                ) : (
                   <>
                     <Send size={18} />
                     <span>Submit Request</span>
                   </>
                )}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestNewCallType;