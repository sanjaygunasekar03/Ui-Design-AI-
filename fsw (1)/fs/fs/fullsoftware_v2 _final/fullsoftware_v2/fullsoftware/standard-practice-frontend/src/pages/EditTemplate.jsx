import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Eye, EyeOff, MoreHorizontal, Check, Clock, Zap, Save, Copy, History, Trash2, HelpCircle, Edit, CheckCircle, Plus, Settings, Edit3, X, FileText, Target, Shield, Info, ChevronRight, GripVertical, Pencil } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

const EditTemplate = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [templateName, setTemplateName] = useState('');
  const [goal, setGoal] = useState('');
  const [intro, setIntro] = useState('');
  const [isIvrOnly, setIsIvrOnly] = useState(true);
  const [createdByName, setCreatedByName] = useState('AC');
  const [createdAt, setCreatedAt] = useState('');
  const [conditions, setConditions] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [newFieldName, setNewFieldName] = useState('');

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      const res = await axios.get(`${API_BASE}/templates/${templateId}`);
      const t = res.data;
      setTemplateName(t.name || '');
      setGoal(t.goal || 'Claim Status');
      setIntro(t.intro || '');
      setIsIvrOnly(t.is_ivr_only ?? true);
      setCreatedByName(t.created_by_name || 'AC');
      setCreatedAt(t.created_at || '');
      
      // If template has no conditions (like newly requested ones), provide default structure
      if (!t.conditions || t.conditions.length === 0) {
        setConditions([
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
        ]);
      } else {
        setConditions(t.conditions);
      }
    } catch (err) {
      console.error('Error loading template:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.patch(`${API_BASE}/templates/${templateId}`, {
        name: templateName,
        goal,
        intro,
        is_ivr_only: isIvrOnly,
        conditions,
      });
      alert('Template saved successfully.');
    } catch (err) {
      console.error('Error saving template:', err);
      alert('Failed to save template. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleFieldVisibility = (conditionId, fieldId) => {
    setConditions(conditions.map(condition =>
      condition.id === conditionId
        ? {
            ...condition,
            fields: condition.fields.map(field =>
              field.id === fieldId
                ? { ...field, visible: !field.visible }
                : field
            )
          }
        : condition
    ));
  };

  const deleteField = (conditionId, fieldId) => {
    setConditions(conditions.map(condition =>
      condition.id === conditionId
        ? {
            ...condition,
            fields: condition.fields.filter(field => field.id !== fieldId)
          }
        : condition
    ));
  };

  const startEditingField = (conditionId, fieldId, currentName) => {
    setEditingField({ conditionId, fieldId });
    setNewFieldName(currentName);
  };

  const saveFieldEdit = () => {
    if (!editingField || !newFieldName.trim()) return;

    setConditions(conditions.map(condition =>
      condition.id === editingField.conditionId
        ? {
            ...condition,
            fields: condition.fields.map(field =>
              field.id === editingField.fieldId
                ? { ...field, name: newFieldName.trim() }
                : field
            )
          }
        : condition
    ));

    setEditingField(null);
    setNewFieldName('');
  };

  const cancelFieldEdit = () => {
    setEditingField(null);
    setNewFieldName('');
  };

  const addNewField = (conditionId) => {
    const newFieldId = `field_${Date.now()}`;
    const newField = {
      id: newFieldId,
      name: 'New Field',
      visible: true,
      required: false
    };

    setConditions(conditions.map(condition =>
      condition.id === conditionId
        ? {
            ...condition,
            fields: [...condition.fields, newField]
          }
        : condition
    ));

    // Start editing the new field immediately
    setTimeout(() => {
      startEditingField(conditionId, newFieldId, 'New Field');
    }, 100);
  };

  const getTotalFields = () => {
    return conditions.reduce((total, condition) => total + condition.fields.length, 0);
  };

  const getRequiredFields = () => {
    return 1; // Claim Status is always required
  };

  const handleMenuAction = async (action) => {
    setShowMenu(false);
    switch (action) {
      case 'duplicate':
        try {
          const res = await axios.post(`${API_BASE}/templates/${templateId}/duplicate`);
          alert('Template duplicated successfully');
          navigate(`/templates/edit/${res.data.id}`);
          window.location.reload(); // Force reload to fetch new data
        } catch (error) {
          console.error('Error duplicating template:', error);
          alert('Failed to duplicate template.');
        }
        break;
      case 'history':
        alert('Showing version history');
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this template?')) {
          try {
            await axios.delete(`${API_BASE}/templates/${String(templateId)}`);
            alert('Template deleted successfully');
            navigate('/templates');
          } catch (error) {
            console.error('Error deleting template:', error);
            alert('Failed to delete template.');
          }
        }
        break;
      default:
        break;
    }
  };

  const getConditionColor = (id) => {
    if (id === 'paid') return { text: 'text-[#12B76A]', bg: 'bg-[#F0FDF4]', border: 'border-[#12B76A]' };
    if (id === 'denied') return { text: 'text-[#F79009]', bg: 'bg-[#FFFAEB]', border: 'border-[#F79009]' };
    return { text: 'text-[#1070B7]', bg: 'bg-[#E1F1F8]', border: 'border-[#1070B7]' };
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] relative flex flex-col">
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-[#717784] text-sm font-semibold">Loading template...</div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-8 pt-8 pb-24 space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-[16px] p-8 border border-[#EAECEF] relative overflow-hidden shadow-sm">
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-sm mb-4">
              <Link to="/templates" className="text-[#1070B7] hover:underline flex items-center font-bold">
                <ChevronLeft size={16} className="mr-1" /> Templates
              </Link>
              <span className="text-[#98A2B3]">›</span>
              <span className="text-[#4A4F59] font-bold">Edit Template</span>
            </div>
            <h1 className="text-[32px] font-extrabold text-[#1A1C21] tracking-tight mb-2">Edit Template</h1>
            <p className="text-[#717784] text-sm font-medium">Create and customize your template to standardize AI call interactions.</p>
          </div>
          
          {/* Header SVG background */}
          <div className="absolute top-0 right-0 w-[450px] h-full overflow-hidden pointer-events-none rounded-r-[16px] flex items-start justify-end">
            <svg width="450" height="180" viewBox="0 0 450 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
              <path d="M0 180C70 100 140 160 210 110C280 60 350 140 450 80V0H0V180Z" fill="#E1F1F8"/>
              <path d="M90 180C160 110 230 150 300 100C370 50 420 90 450 90V0H90V180Z" fill="#E0F8FC" opacity="0.6"/>
              <g transform="translate(320, 25) rotate(15)">
                <rect x="0" y="0" width="70" height="90" rx="8" fill="white" stroke="#EAECEF" strokeWidth="2" className="shadow-sm"/>
                <line x1="14" y1="22" x2="56" y2="22" stroke="#1070B7" strokeWidth="4" strokeLinecap="round"/>
                <line x1="14" y1="40" x2="40" y2="40" stroke="#1070B7" strokeWidth="4" strokeLinecap="round"/>
                <line x1="14" y1="58" x2="56" y2="58" stroke="#1070B7" strokeWidth="4" strokeLinecap="round"/>
                <line x1="14" y1="76" x2="46" y2="76" stroke="#1070B7" strokeWidth="4" strokeLinecap="round"/>
                <path d="M65 5L30 40L20 48L30 55L65 20C68 17 68 12 65 9C62 6 57 6 54 9Z" fill="#1070B7"/>
                <path d="M65 5L54 9L65 20C68 17 68 12 65 9Z" fill="#00B8D9"/>
              </g>
              <path d="M250 25L254 32L262 34L254 36L250 43L246 36L238 34L246 32L250 25Z" fill="#F79009"/>
              <path d="M290 130L292 135L297 136L292 137L290 142L288 137L283 136L288 135L290 130Z" fill="#F79009"/>
            </svg>
          </div>
        </div>

        {/* Top 3 Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Template Overview */}
          <div className="bg-white border border-[#EAECEF] rounded-[16px] p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#E1F1F8] flex items-center justify-center">
                  <FileText size={20} className="text-[#1070B7]" />
                </div>
                <h2 className="text-lg font-bold text-[#1A1C21]">Template Overview</h2>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-[#1070B7] bg-[#E1F1F8] px-3 py-1 rounded">Template</span>
                <div className="relative">
                  <button onClick={() => setShowMenu(!showMenu)} className="text-[#98A2B3] hover:text-[#1A1C21] transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#EAECEF] rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-50 py-1">
                      <button onClick={() => handleMenuAction('duplicate')} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-[#4A4F59] hover:bg-[#F7F8FA]">Duplicate</button>
                      <button onClick={() => handleMenuAction('history')} className="w-full text-left px-4 py-2.5 text-sm font-semibold text-[#4A4F59] hover:bg-[#F7F8FA]">Version History</button>
                      <div className="border-t border-[#EAECEF] my-1"></div>
                      <button onClick={() => handleMenuAction('delete')} className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#D92D20] hover:bg-[#FEF3F2]">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-5 flex-1">
              <div>
                <label className="block text-xs font-bold text-[#717784] mb-2 uppercase tracking-wider">Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#D0D5DD] rounded-lg text-sm font-semibold text-[#1A1C21] focus:outline-none focus:ring-2 focus:ring-[#1070B7] focus:border-[#1070B7] transition-shadow"
                />
              </div>
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center pb-3 border-b border-[#EAECEF]">
                  <span className="text-sm font-semibold text-[#717784]">Call Type</span>
                  <span className="text-sm font-bold text-[#1070B7] bg-[#E1F1F8] px-2 py-0.5 rounded">{isIvrOnly ? 'Claims IVR' : 'Claims'}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#EAECEF]">
                  <span className="text-sm font-semibold text-[#717784]">Goal Type</span>
                  <span className="text-sm font-bold text-[#1A1C21]">{goal || 'Claim Status'}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#EAECEF]">
                  <span className="text-sm font-semibold text-[#717784]">To</span>
                  <span className="text-sm font-bold text-[#1A1C21]">Insurance</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#EAECEF]">
                  <span className="text-sm font-semibold text-[#717784]">Regarding</span>
                  <span className="text-sm font-bold text-[#1A1C21]">Patient</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm font-semibold text-[#717784]">Created</span>
                  <span className="text-sm font-bold text-[#1A1C21]">
                    {createdAt ? new Date(createdAt).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}) : 'Apr 21, 2026'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Goal & Intro */}
          <div className="bg-white border border-[#EAECEF] rounded-[16px] p-6 shadow-sm flex flex-col">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-[#E1F1F8] flex items-center justify-center">
                <Target size={20} className="text-[#1070B7]" />
              </div>
              <h2 className="text-lg font-bold text-[#1A1C21]">Goal & Intro</h2>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-xs font-bold text-[#717784] mb-2 uppercase tracking-wider">Goal</label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#D0D5DD] rounded-lg text-sm font-semibold text-[#1A1C21] focus:outline-none focus:ring-2 focus:ring-[#1070B7] focus:border-[#1070B7] transition-shadow"
                  placeholder="Test"
                />
                <p className="text-xs font-medium text-[#717784] mt-2">Describe what this template is designed to accomplish.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#717784] mb-2 uppercase tracking-wider">Initial Agent Statement</label>
                <textarea
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg text-sm font-semibold text-[#1A1C21] focus:outline-none focus:ring-2 focus:ring-[#1070B7] focus:border-[#1070B7] resize-none h-28 transition-shadow"
                  placeholder="What should the AI say when the call connects..."
                />
                <p className="text-xs font-medium text-[#717784] mt-2">The opening statement that begins the conversation.</p>
              </div>
            </div>
          </div>

          {/* Card 3 Column: Quick Actions + IVR Banner */}
          <div className="space-y-6 flex flex-col">
            <div className="bg-white border border-[#EAECEF] rounded-[16px] p-6 shadow-sm flex-1">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 rounded-lg bg-[#E1F1F8] flex items-center justify-center">
                  <Zap size={20} className="text-[#1070B7]" />
                </div>
                <h2 className="text-lg font-bold text-[#1A1C21]">Quick Actions</h2>
              </div>
              
              <div className="space-y-3">
                <button onClick={() => handleMenuAction('duplicate')} className="w-full flex items-center justify-between p-4 bg-white border border-[#EAECEF] rounded-[8px] hover:border-[#1070B7] hover:shadow-sm transition-all group">
                  <div className="flex items-center space-x-3">
                    <Copy size={18} className="text-[#717784] group-hover:text-[#1070B7] transition-colors" />
                    <span className="text-sm font-bold text-[#4A4F59] group-hover:text-[#1070B7] transition-colors">Duplicate template</span>
                  </div>
                  <ChevronRight size={18} className="text-[#98A2B3] group-hover:text-[#1070B7] transition-colors" />
                </button>
                <button onClick={() => handleMenuAction('delete')} className="w-full flex items-center justify-between p-4 bg-white border border-[#EAECEF] rounded-[8px] hover:border-[#D92D20] hover:bg-[#FEF3F2] transition-all group">
                  <div className="flex items-center space-x-3">
                    <Trash2 size={18} className="text-[#D92D20]" />
                    <span className="text-sm font-bold text-[#D92D20]">Delete template</span>
                  </div>
                  <ChevronRight size={18} className="text-[#D92D20]" />
                </button>
              </div>
            </div>

            {/* IVR Only Banner */}
            <div className="bg-[#F0F9FF] border border-[#B9E6FE] rounded-[16px] p-5 flex items-start space-x-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E0F2FE] rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="w-10 h-10 bg-[#026AA2] rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm">
                <Shield size={20} className="text-white" fill="currentColor" />
              </div>
              <div className="z-10">
                <h3 className="text-sm font-bold text-[#026AA2] mb-1">Collect info via IVR only</h3>
                <p className="text-xs font-medium text-[#026AA2] opacity-90 leading-relaxed">This template is designed for automated IVR systems.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info to Collect Section */}
        <div className="bg-white border border-[#EAECEF] rounded-[16px] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#EAECEF]">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#E1F1F8] flex items-center justify-center">
                <Info size={24} className="text-[#1070B7]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1A1C21] mb-1">Info to Collect</h2>
                <p className="text-sm font-medium text-[#717784]">Define different conversation paths based on call outcomes. The AI will adapt its questions depending on the claim status.</p>
              </div>
            </div>
            <div className="bg-[#E1F1F8] border border-[#B9E6FE] text-[#1070B7] text-sm font-bold px-4 py-2 rounded-full shadow-sm">
              {getTotalFields()} info total / {getRequiredFields()} required
            </div>
          </div>

          {/* Timeline Structure */}
          <div className="relative pl-8 ml-2 mt-4">
            {/* Main Vertical Line */}
            <div className="absolute left-[7px] top-6 bottom-12 w-[2px] bg-[#EAECEF]"></div>

            {conditions.map((condition, index) => {
              const colors = getConditionColor(condition.id);
              return (
                <div key={condition.id} className="relative mb-10 last:mb-0">
                  {/* Timeline Node Circle */}
                  <div className={`absolute -left-[32px] top-2.5 w-[18px] h-[18px] rounded-full border-[3px] ${colors.border} bg-white z-10 shadow-sm`}></div>
                  
                  {/* Condition Header Block */}
                  <div className={`py-2 px-5 ${colors.bg} rounded-[8px] inline-flex items-center mb-4`}>
                    <span className={`text-sm font-bold ${colors.text}`}>If Claim Status is {condition.name}</span>
                  </div>

                  {/* Fields List */}
                  <div className="space-y-1 ml-4 max-w-4xl">
                    {condition.fields.map((field) => (
                      <div key={field.id} className="flex items-center justify-between py-2.5 px-3 hover:bg-[#F7F8FA] rounded-[8px] group transition-colors">
                        {editingField && editingField.conditionId === condition.id && editingField.fieldId === field.id ? (
                          <div className="flex items-center space-x-3 w-full">
                            <GripVertical size={16} className="text-[#D0D5DD]" />
                            <input
                              type="text"
                              value={newFieldName}
                              onChange={(e) => setNewFieldName(e.target.value)}
                              className="flex-1 px-3 py-1.5 border-2 border-[#1070B7] rounded-[6px] text-sm font-bold text-[#1A1C21] focus:outline-none shadow-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveFieldEdit();
                                if (e.key === 'Escape') cancelFieldEdit();
                              }}
                            />
                            <div className="flex space-x-1">
                              <button onClick={saveFieldEdit} className="p-1.5 text-white bg-[#12B76A] hover:bg-[#027A48] rounded-[6px] shadow-sm transition-colors"><Check size={16} /></button>
                              <button onClick={cancelFieldEdit} className="p-1.5 text-white bg-[#D92D20] hover:bg-[#B42318] rounded-[6px] shadow-sm transition-colors"><X size={16} /></button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center space-x-3">
                              <GripVertical size={16} className="text-[#D0D5DD] cursor-grab hover:text-[#98A2B3] transition-colors" />
                              <span className={`text-sm font-bold ${field.visible ? 'text-[#4A4F59]' : 'text-[#98A2B3] line-through'}`}>{field.name}</span>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEditingField(condition.id, field.id, field.name)} className="p-1.5 text-[#1070B7] hover:bg-[#E1F1F8] rounded-[6px] transition-colors" title="Edit Field">
                                <Pencil size={16} />
                              </button>
                              <button onClick={() => toggleFieldVisibility(condition.id, field.id)} className={`p-1.5 ${field.visible ? 'text-[#1070B7]' : 'text-[#98A2B3]'} hover:bg-[#E1F1F8] rounded-[6px] transition-colors`} title="Toggle Visibility">
                                {field.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                              </button>
                              <button onClick={() => deleteField(condition.id, field.id)} className="p-1.5 text-[#D92D20] hover:bg-[#FEF3F2] rounded-[6px] transition-colors" title="Delete Field">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    
                    {/* Add Field Button */}
                    <button onClick={() => addNewField(condition.id)} className="flex items-center space-x-2 mt-2 px-3 py-2 text-[#1070B7] hover:bg-[#E1F1F8] rounded-[8px] transition-colors text-sm font-extrabold w-max">
                      <Plus size={16} strokeWidth={3} />
                      <span>Add field</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white border-t border-[#EAECEF] p-4 z-40 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] mt-auto w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 w-full">
          <Link to="/templates" className="px-6 py-2.5 bg-white border border-[#D0D5DD] rounded-[8px] text-[#4A4F59] font-bold text-sm hover:bg-[#F7F8FA] hover:text-[#1A1C21] transition-colors shadow-sm">
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-8 py-2.5 bg-[#1070B7] text-white rounded-[8px] font-bold text-sm hover:bg-[#0C5A96] transition-colors shadow-sm disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Template'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTemplate;