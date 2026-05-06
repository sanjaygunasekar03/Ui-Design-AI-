import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Phone, FileText, CheckCircle, Circle, Zap, Trash2, Bell, ChevronDown, ChevronLeft, ChevronRight, Volume2, Monitor } from 'lucide-react';

const SearchBatches = () => {
  const [filterType, setFilterType] = useState('Batch ID');
  const [searchValue, setSearchValue] = useState('');
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://127.0.0.1:8000/api/v1';

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${API_BASE}/batches`);
      setBatches(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching batches:', error);
      setLoading(false);
    }
  };

  // Transform backend batches to frontend format
  const batchList = batches.map(batch => ({
    createdOn: batch.created_at || new Date().toISOString(),
    batchId: batch.id,
    callType: 'Claims IVR',
    title: batch.name || batch.id,
    callDate: batch.created_at ? batch.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    primaryInfo: `${batch.completed_calls}/${batch.total_calls}`,
    completedCalls: `${batch.completed_calls}/${batch.total_calls}`,
    status: batch.status === 'in_progress' ? 'Calling' : batch.status.charAt(0).toUpperCase() + batch.status.slice(1).replace('_', ' ')
  }));

  // Filter mapping
  const filterFieldMap = {
    'Batch ID': 'batchId',
    'Title': 'title',
    'Status': 'status'
  };

  const filteredBatches = batchList.filter(batch => {
    if (!searchValue) return true;
    const field = filterFieldMap[filterType];
    const value = batch[field] || '';
    return value.toLowerCase().includes(searchValue.toLowerCase());
  });

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'Draft':
        return (
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 border border-[#EAECEF] bg-white rounded-full">
            <Circle size={8} className="text-[#98A2B3]" />
            <span className="text-xs font-semibold text-[#4A4F59]">Draft</span>
          </div>
        );
      case 'Review':
        return (
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 border border-[#FEF0C7] bg-[#FEF0C7] rounded-full">
            <FileText size={10} className="text-[#DC6803]" />
            <span className="text-xs font-semibold text-[#B54708]">Review</span>
          </div>
        );
      case 'Calling':
        return (
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 border border-[#3B82F6]/20 bg-[#E1F1F8] rounded-full">
            <Phone size={10} className="text-[#3B82F6]" />
            <span className="text-xs font-semibold text-[#3B82F6]">Calling</span>
          </div>
        );
      case 'Completed':
        return (
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 border border-[#16A34A]/20 bg-[#16A34A]/10 rounded-full">
            <CheckCircle size={10} className="text-[#16A34A]" />
            <span className="text-xs font-semibold text-[#16A34A]">Completed</span>
          </div>
        );
      default:
        return <span className="text-xs text-[#717784]">{status}</span>;
    }
  };

  const getActionButton = (batch) => {
    switch (batch.status) {
      case 'Draft':
        return (
          <button className="px-3 py-1.5 border border-[#00B8D9] text-[#00B8D9] rounded-lg text-xs font-semibold hover:bg-[#E0F8FC] transition-colors">
            Edit
          </button>
        );
      case 'Calling':
        return (
          <button className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors">
            Stop
          </button>
        );
      case 'Review':
        return (
          <button className="px-3 py-1.5 border border-[#00B8D9] text-[#00B8D9] rounded-lg text-xs font-semibold hover:bg-[#E0F8FC] transition-colors">
            Review
          </button>
        );
      default:
        return null;
    }
  };

  // Select All functionality
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBatches([]);
      setSelectAll(false);
    } else {
      setSelectedBatches(filteredBatches.map(batch => batch.batchId));
      setSelectAll(true);
    }
  };

  const handleBatchSelect = (batchId) => {
    if (selectedBatches.includes(batchId)) {
      setSelectedBatches(selectedBatches.filter(id => id !== batchId));
    } else {
      setSelectedBatches([...selectedBatches, batchId]);
    }
  };

  const handleDelete = async (batchId) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        await axios.delete(`${API_BASE}/batches/${batchId}`);
        setBatches(batches.filter(b => b.id !== batchId));
        setSelectedBatches(selectedBatches.filter(id => id !== batchId));
      } catch (error) {
        console.error('Error deleting batch:', error);
        alert('Failed to delete batch.');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedBatches.length} selected batches?`)) {
      try {
        // In a real app, you might have a bulk delete endpoint. 
        // Here we'll delete them one by one for simplicity given current backend.
        await Promise.all(selectedBatches.map(id => axios.delete(`${API_BASE}/batches/${id}`)));
        setBatches(batches.filter(b => !selectedBatches.includes(b.id)));
        setSelectedBatches([]);
        setSelectAll(false);
        alert('Selected batches deleted successfully.');
      } catch (error) {
        console.error('Error in bulk delete:', error);
        alert('Some batches could not be deleted.');
        fetchBatches(); // Refresh to show current state
      }
    }
  };

  // Update selectAll state when selectedBatches changes
  const isAllSelected = filteredBatches.length > 0 && selectedBatches.length === filteredBatches.length;
  const isIndeterminate = selectedBatches.length > 0 && selectedBatches.length < filteredBatches.length;

  // Update selectAll state based on current selections
  useEffect(() => {
    if (isAllSelected) {
      setSelectAll(true);
    } else if (selectedBatches.length === 0) {
      setSelectAll(false);
    }
  }, [isAllSelected, selectedBatches.length]);

  return (
    <div className="p-8 space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between">
        {/* Left: Title & Subtitle */}
        <div>
          <h1 className="text-2xl font-bold text-[#1A1C21] tracking-tight">Search Batches</h1>
          <div className="flex items-center space-x-3 mt-4">
            <p className="text-[#717784] text-sm">{batchList.length} batches total</p>
            <button onClick={handleSelectAll} className="text-sm font-semibold text-[#3B82F6] hover:underline">Select All</button>
          </div>
        </div>

        {/* Center/Right: Filter & Profile */}
        <div className="flex flex-col items-end space-y-4">
          <div className="flex items-center space-x-4">
            {/* Filter Bar */}
            <div className="flex items-center bg-white border border-[#EAECEF] rounded-lg shadow-sm">
              <div className="relative border-r border-[#EAECEF]">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="appearance-none px-4 py-2 pr-8 text-sm text-[#1A1C21] font-medium bg-transparent focus:outline-none w-28"
                >
                  <option value="Batch ID">Batch ID</option>
                  <option value="Title">Title</option>
                  <option value="Status">Status</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717784] pointer-events-none" />
              </div>
              <input
                type="text"
                placeholder="Search by batch ID"
                className="w-48 lg:w-64 px-4 py-2 text-sm text-[#1A1C21] placeholder-[#98A2B3] bg-transparent focus:outline-none"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <button className="px-5 py-2 bg-[#3B82F6] text-white rounded-lg text-sm font-semibold hover:bg-[#104ab0] transition-colors flex items-center shadow-sm">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M1.16669 2.91667H12.8334M3.50002 7H10.5M5.83335 11.0833H8.16669" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Filter
            </button>

            {/* Profile & Notifications */}
            <div className="flex items-center space-x-3 ml-2 border-l border-[#EAECEF] pl-4">
              <button className="p-2 bg-white border border-[#D0D5DD] rounded-xl text-[#717784] hover:bg-[#F7F8FA] transition-colors relative">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="flex items-center space-x-2 cursor-pointer">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="w-8 h-8 rounded-full shadow-sm" />
                <ChevronDown size={14} className="text-[#717784]" />
              </div>
            </div>
          </div>
          
          <Link to="/batches/new/select-type" className="text-sm font-semibold text-[#3B82F6] hover:underline flex items-center">
            <Monitor size={14} className="mr-1.5" />
            View System Calls
          </Link>
        </div>
      </div>

      {selectedBatches.length > 0 && (
        <div className="flex justify-start">
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors flex items-center shadow-sm"
          >
            <Trash2 size={14} className="mr-2" />
            Delete Selected ({selectedBatches.length})
          </button>
        </div>
      )}

      {/* Data Grid */}
      <div className="bg-white border border-[#EAECEF] rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-[#F7F8FA]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] tracking-wider">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => el && (el.indeterminate = isIndeterminate)}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] tracking-wider cursor-pointer hover:text-[#1A1C21] transition-colors">Created On <span className="text-[#D0D5DD] ml-1 text-[10px]">↕</span></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] tracking-wider cursor-pointer hover:text-[#1A1C21] transition-colors">Batch ID <span className="text-[#D0D5DD] ml-1 text-[10px]">↕</span></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] tracking-wider cursor-pointer hover:text-[#1A1C21] transition-colors">Call Type / Goal <span className="text-[#D0D5DD] ml-1 text-[10px]">↕</span></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] tracking-wider cursor-pointer hover:text-[#1A1C21] transition-colors">Title <span className="text-[#D0D5DD] ml-1 text-[10px]">↕</span></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] tracking-wider cursor-pointer hover:text-[#1A1C21] transition-colors">Call Date <span className="text-[#D0D5DD] ml-1 text-[10px]">↕</span></th>
                <th className="px-6 py-4 text-center text-xs font-bold text-[#717784] tracking-wider cursor-pointer hover:text-[#1A1C21] transition-colors"><span className="flex items-center justify-center">Primary Info <span className="text-[#D0D5DD] ml-1 text-[10px]">↕</span></span></th>
                <th className="px-6 py-4 text-center text-xs font-bold text-[#717784] tracking-wider">Complete Calls</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] tracking-wider cursor-pointer hover:text-[#1A1C21] transition-colors">Batch Status <span className="text-[#D0D5DD] ml-1 text-[10px]">↕</span></th>
                <th className="px-6 py-4 text-center text-xs font-bold text-[#717784] tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7]">
              {filteredBatches.map((batch, index) => (
                <tr key={batch.batchId} className="hover:bg-[#F7F8FA] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedBatches.includes(batch.batchId)}
                      onChange={() => handleBatchSelect(batch.batchId)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-[#E1F1F8] text-[#3B82F6] flex items-center justify-center text-[10px] font-bold">AC</div>
                      <span className="text-sm text-[#4A4F59]">{batch.createdOn}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1A1C21]">{batch.batchId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 bg-[#E1F1F8] text-[#3B82F6] rounded text-[11px] font-semibold tracking-wide">Claims (IVR)</span>
                      <span className="text-[11px] text-[#98A2B3]">Claim Status</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1A1C21]">{batch.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-[#4A4F59]">{batch.callDate || '—'}</span>
                      <Volume2 size={16} className="text-[#86A6E4]" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-[#1A1C21]">{batch.primaryInfo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-[#1A1C21]">{batch.completedCalls}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusDisplay(batch.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button 
                      onClick={() => handleDelete(batch.batchId)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Batch"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-6 bg-white border-t border-[#EAECEF]">
          <span className="text-sm text-[#717784]">Showing 1 to {filteredBatches.length > 10 ? 10 : filteredBatches.length} of {filteredBatches.length} results</span>
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D0D5DD] text-[#717784] hover:bg-[#F7F8FA] transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#3B82F6] text-white font-bold text-sm shadow-sm hover:bg-[#104ab0] transition-colors">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D0D5DD] text-[#717784] hover:bg-[#F7F8FA] transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBatches;