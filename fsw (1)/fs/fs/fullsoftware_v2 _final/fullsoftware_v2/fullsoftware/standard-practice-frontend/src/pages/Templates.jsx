import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, Star, Eye, Edit, MoreHorizontal, Plus, MessageSquare, FileText } from 'lucide-react';
import RequestNewCallType from './RequestNewCallType';
import SelectCallTypeModal from './SelectCallTypeModal';

const Templates = () => {
  const navigate = useNavigate();
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [ivrOnly, setIvrOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !event.target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
      if (showCreateDropdown && !event.target.closest('.create-dropdown-container')) {
        setShowCreateDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId, showCreateDropdown]);

  const API_BASE = 'http://127.0.0.1:8000/api/v1';

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${API_BASE}/templates`);
      setTemplates(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setLoading(false);
    }
  };

  const handleCreateTemplate = (templateType) => {
    // Navigate to template creation wizard - for now using batch wizard as template
    // In a real app, this would navigate to a dedicated template creation flow
    navigate('/batches/new/select-type');
    setShowCreateDropdown(false);
  };

  const handleMenuToggle = (templateId) => {
    setOpenMenuId(openMenuId === templateId ? null : templateId);
  };

  const handleMenuAction = async (action, templateId) => {
    console.log(`Menu Action: ${action} on ${templateId}`);
    setOpenMenuId(null);
    switch (action) {
      case 'edit':
        navigate(`/templates/edit/${templateId}`);
        break;
      case 'duplicate':
        try {
          await axios.post(`${API_BASE}/templates/${templateId}/duplicate`);
          fetchTemplates();
          alert('Template duplicated successfully');
        } catch (error) {
          console.error('Error duplicating template:', error);
          alert('Failed to duplicate template');
        }
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this template?')) {
          try {
            await axios.delete(`${API_BASE}/templates/${templateId}`);
            setTemplates(templates.filter(t => String(t.id) !== String(templateId)));
            alert('Template deleted successfully');
          } catch (error) {
            console.error('Error deleting template:', error);
            alert('Failed to delete template');
          }
        }
        break;
      default:
        break;
    }
  };


  const filteredTemplates = templates
    .filter(template => {
      if (ivrOnly && !template.is_ivr_only) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'A-Z':
          return a.name.localeCompare(b.name);
        case 'Newest':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case 'Most Relevant':
          // Starred items first, then by name
          if (a.is_starred && !b.is_starred) return -1;
          if (!a.is_starred && b.is_starred) return 1;
          return a.name.localeCompare(b.name);
        case 'Most Used':
          // Mock usage by name length or ID for now, or just created_at
          return (b.id % 5) - (a.id % 5);
        default:
          return 0;
      }
    });

  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm font-medium mb-2">
        <span className="text-[#1359D2] cursor-pointer hover:underline">Dashboard</span>
        <span className="text-[#98A2B3]">&gt;</span>
        <span className="text-[#1359D2] cursor-pointer hover:underline">Call Batch</span>
        <span className="text-[#98A2B3]">&gt;</span>
        <span className="text-[#1A1C21]">Edit Call Templates</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-3xl font-bold text-[#1A1C21] tracking-tight">Edit Call Templates</h1>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-[#717784]">Not seeing your call type?</span>
            <button 
              onClick={() => setShowSelectModal(true)}
              className="px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm font-semibold hover:bg-[#F7F8FA] transition-colors"
            >
              Request
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort By */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-[#1A1C21] uppercase tracking-wider">SORT BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-[#D0D5DD] rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1359D2] bg-white"
            >
              <option>Most Relevant</option>
              <option>Most Used</option>
              <option>A-Z</option>
              <option>Newest</option>
            </select>
          </div>

          {/* IVR Only Toggle */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ivrOnly}
              onChange={(e) => setIvrOnly(e.target.checked)}
              className="rounded border-[#D0D5DD] text-[#1359D2] focus:ring-[#1359D2]"
            />
            <span className="text-sm text-[#4A4F59] font-medium">IVR Only</span>
          </label>

          {/* Create New Template Button */}
          <div className="relative create-dropdown-container">
            <button
              onClick={() => setShowCreateDropdown(!showCreateDropdown)}
              className="flex items-center px-4 py-2.5 bg-[#1359D2] text-white rounded-lg font-semibold hover:bg-[#0F47A8] transition-colors text-sm shadow-sm"
            >
              <Plus size={16} className="mr-2" />
              Create new template
              <ChevronDown size={14} className="ml-2" />
            </button>

            {showCreateDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#EAECEF] rounded-xl shadow-lg z-50">
                <div className="py-2">
                  <button
                    onClick={() => handleCreateTemplate('claims')}
                    className="w-full text-left px-4 py-3 text-sm text-[#4A4F59] hover:bg-[#F7F8FA] transition-colors flex items-center"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#E1F1F8] mr-3"></span>
                    Claims
                  </button>
                  <button
                    onClick={() => handleCreateTemplate('claims-ivr')}
                    className="w-full text-left px-4 py-3 text-sm text-[#4A4F59] hover:bg-[#F7F8FA] transition-colors flex items-center"
                  >
                    <span className="w-3 h-3 rounded-full bg-[#E1F1F8] mr-3"></span>
                    Claims (IVR)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Call Templates */}
        <div className="flex-1 bg-white border border-[#EAECEF] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#F0F4FF] rounded-lg text-[#1359D2]">
                <FileText size={20} />
              </div>
              <h2 className="text-lg font-bold text-[#1A1C21]">Call Templates</h2>
            </div>
            <div className="flex items-center space-x-2 text-[#4A4F59] cursor-pointer">
              <span className="text-sm font-medium">1 call type total</span>
              <ChevronDown size={16} />
            </div>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <span className="px-4 py-1.5 bg-[#F0F4FF] text-[#1359D2] rounded-full text-sm font-semibold">Claims</span>
            <span className="text-sm text-[#717784]">{filteredTemplates.filter(t => t.status !== 'Requested').length} templates</span>
          </div>

          {/* Template List */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {filteredTemplates.filter(t => t.status !== 'Requested').map((template) => (
              <div key={template.id} className="border border-[#EAECEF] rounded-2xl p-6 hover:shadow-md transition-shadow bg-white flex items-start">
                
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-[#F0F4FF] text-[#1359D2] flex items-center justify-center font-bold text-xl mr-5 shrink-0">
                  {(template.created_by_name || 'AC').slice(0, 2).toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Top Row: Title & Star */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-bold text-[#1A1C21]">{template.name}</h3>
                    <button className={`ml-2 ${template.is_starred ? 'text-yellow-500' : 'text-[#D0D5DD] hover:text-yellow-500'} transition-colors`}>
                      <Star size={18} fill={template.is_starred ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Middle Row: Specs */}
                  <div className="flex items-center flex-wrap gap-2 text-sm text-[#717784] mb-3">
                    <span>{template.datapoints} Datapoints</span>
                    <span className="text-[#D0D5DD]">•</span>
                    <span>Goal: {template.goal}</span>
                    {template.is_ivr_only && (
                      <span className="px-2.5 py-0.5 bg-[#F0F4FF] text-[#1359D2] rounded text-xs font-semibold ml-2">IVR Only</span>
                    )}
                  </div>

                  {/* Preview Button */}
                  <button 
                    onClick={() => navigate(`/templates/edit/${template.id}`)}
                    className="flex items-center space-x-1 text-[#1359D2] hover:underline transition-colors text-sm font-semibold mb-6"
                  >
                    <Eye size={16} />
                    <span>Preview</span>
                  </button>

                  {/* Bottom Row: Metadata & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-[#1A1C21]">{(template.created_by_name || 'AC').slice(0, 2).toUpperCase()}</span>
                      <span className="text-sm text-[#717784]">{template.created_at ? new Date(template.created_at).toLocaleDateString() : '4/13/2026'}</span>
                    </div>

                    <div className="flex items-center space-x-2 menu-container">
                      <Link
                        to={`/templates/edit/${template.id}`}
                        className="px-5 py-2 bg-[#1359D2] text-white rounded-lg hover:bg-[#0F47A8] transition-colors font-semibold text-sm inline-block shadow-sm"
                      >
                        Edit
                      </Link>
                      <div className="relative">
                        <button
                          onClick={() => handleMenuToggle(template.id)}
                          className="p-2 border border-[#D0D5DD] rounded-lg text-[#717784] hover:bg-[#F7F8FA] transition-colors"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                        {openMenuId === template.id && (
                          <div className="absolute right-0 bottom-full mb-1 w-32 bg-white border border-[#EAECEF] rounded-lg shadow-lg z-50">
                            <button
                              onClick={() => handleMenuAction('edit', template.id)}
                              className="w-full text-left px-3 py-2 text-xs text-[#4A4F59] hover:bg-[#F7F8FA] transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleMenuAction('duplicate', template.id)}
                              className="w-full text-left px-3 py-2 text-xs text-[#4A4F59] hover:bg-[#F7F8FA] transition-colors"
                            >
                              Duplicate
                            </button>
                            <button
                              onClick={() => handleMenuAction('delete', template.id)}
                              className="w-full text-left px-3 py-2 text-xs text-[#E02424] hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Requested Call Types */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white border border-[#EAECEF] rounded-2xl p-6 shadow-sm h-full">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-[#F0F4FF] rounded-lg text-[#1359D2]">
                <MessageSquare size={20} />
              </div>
              <h2 className="text-lg font-bold text-[#1A1C21]">Requested Call Types</h2>
            </div>
            <p className="text-sm text-[#717784] mb-6">New call type suggestions currently under review</p>

            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
              {filteredTemplates.filter(t => t.status === 'Requested').length === 0 ? (
                <p className="text-sm text-[#717784] italic">No requested call types.</p>
              ) : (
                filteredTemplates.filter(t => t.status === 'Requested').map((template) => (
                  <div key={template.id} className="border border-[#EAECEF] rounded-2xl p-5 hover:shadow-md transition-shadow bg-white flex items-start">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[#F0F4FF] text-[#1359D2] flex items-center justify-center font-bold text-lg mr-4 shrink-0">
                      {(template.created_by_name || 'AC').slice(0, 2).toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base font-bold text-[#1A1C21]">{template.name}</h3>
                        <div className="px-2.5 py-1 bg-[#F0F4FF] text-[#1359D2] rounded-md text-xs font-semibold shrink-0 ml-2">Status: Pending</div>
                      </div>

                      <div className="flex items-center flex-wrap gap-1 text-xs text-[#717784] mb-4">
                        <span>Level: HIGH</span>
                        <span className="text-[#D0D5DD] mx-1">•</span>
                        <span>Goal: {template.goal || 'Test'}</span>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <span className="text-sm text-[#717784] font-medium">{template.created_at ? new Date(template.created_at).toLocaleDateString() : '4/15/2026'}</span>
                        
                        <div className="relative menu-container">
                          <button
                            onClick={() => handleMenuToggle(template.id)}
                            className="p-1.5 border border-[#D0D5DD] rounded-lg text-[#717784] hover:bg-[#F7F8FA] transition-colors"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {openMenuId === template.id && (
                            <div className="absolute right-0 bottom-full mb-1 w-32 bg-white border border-[#EAECEF] rounded-lg shadow-lg z-50">
                              <button
                                onClick={() => handleMenuAction('edit', template.id)}
                                className="w-full text-left px-3 py-2 text-xs text-[#4A4F59] hover:bg-[#F7F8FA] transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleMenuAction('duplicate', template.id)}
                                className="w-full text-left px-3 py-2 text-xs text-[#4A4F59] hover:bg-[#F7F8FA] transition-colors"
                              >
                                Duplicate
                              </button>
                              <button
                                onClick={() => handleMenuAction('delete', template.id)}
                                className="w-full text-left px-3 py-2 text-xs text-[#E02424] hover:bg-red-50 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Select Call Type Modal */}
      {showSelectModal && (
        <SelectCallTypeModal
          onClose={() => setShowSelectModal(false)}
          onSelectClaim={() => {
            setShowSelectModal(false);
            navigate('/batches/new/select-template');
          }}
          onRequestNew={() => {
            setShowSelectModal(false);
            setShowRequestModal(true);
          }}
        />
      )}

      {/* Request Modal */}
      {showRequestModal && (
        <RequestNewCallType 
          onClose={() => setShowRequestModal(false)}
          onSubmit={() => fetchTemplates()}
        />
      )}
    </div>
  );
};

export default Templates;