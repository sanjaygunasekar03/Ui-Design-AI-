import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Bell, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const SearchCalls = () => {
  const [filterType, setFilterType] = useState('callId');
  const [searchValue, setSearchValue] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0, arrowPosition: 'left' });
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const tooltipTimeoutRef = useRef(null);

  const API_BASE = 'http://127.0.0.1:8000/api/v1';

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      const response = await axios.get(`${API_BASE}/calls`);
      setCalls(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching calls:', error);
      setLoading(false);
    }
  };

  // Filter type mapping to match data properties
  const filterMapping = {
    'callId': 'callId',
    'contact': 'callRegarding',
    'call title': 'callTitle',
    'insurance': 'callTo',
    'patient': 'callRegarding',
    'practice': 'practiceName'
  };

  // Handle individual checkbox selection
  const handleRowSelect = (callId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(callId)) {
      newSelected.delete(callId);
    } else {
      newSelected.add(callId);
    }
    setSelectedRows(newSelected);
  };

  // Handle select all functionality
  const handleSelectAll = () => {
    if (selectedRows.size === filteredLogs.length) {
      // Deselect all
      setSelectedRows(new Set());
    } else {
      // Select all filtered logs
      setSelectedRows(new Set(filteredLogs.map(log => log.callId)));
    }
  };

  // Handle filter application (though real-time filtering is already working)
  const handleFilter = () => {
    // The filtering is already real-time, but this could trigger additional logic
    console.log('Applying filter:', filterType, searchValue);
  };

  // Enhanced positioning with collision detection
  const calculateTooltipPosition = (triggerRect) => {
    const tooltipWidth = 340; // max-w-[340px]
    const tooltipHeight = 200; // estimated height
    const arrowSize = 6;
    const margin = 10;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;

    // Default: position below the trigger element
    let x = triggerRect.left + triggerRect.width / 2;
    let y = triggerRect.bottom + scrollY + margin;
    let arrowPosition = 'top';

    // Check if there's enough space below
    if (y + tooltipHeight > viewportHeight + scrollY) {
      // Not enough space below, position above
      y = triggerRect.top + scrollY - tooltipHeight - margin;
      arrowPosition = 'bottom';
    }

    // Center horizontally on the trigger element
    x = Math.max(margin, Math.min(x, viewportWidth - tooltipWidth - margin));

    // If tooltip would go off-screen horizontally, adjust
    if (x + tooltipWidth > viewportWidth) {
      x = viewportWidth - tooltipWidth - margin;
    }
    if (x < margin) {
      x = margin;
    }

    return { x, y, arrowPosition };
  };

  // Portal component for rendering tooltip outside table boundaries
  const TooltipPortal = ({ children, isVisible }) => {
    return isVisible ? createPortal(children, document.body) : null;
  };

  // Use backend calls directly (now formatted correctly)
  const callLogs = calls.map(call => ({
    callDate: call.call_date,
    createdOn: call.created_on,
    callId: call.id,
    callType: call.call_type,
    callTitle: call.call_title,
    callTo: call.call_to,
    callRegarding: call.call_regarding,
    practiceName: call.practice_name,
    primaryInfo: call.primary_info,
    info: call.info,
    status: call.status
  }));

  const filteredLogs = callLogs.filter(log => {
    if (!searchValue) return true;
    const propertyKey = filterMapping[filterType] || filterType;
    const value = log[propertyKey] || '';
    return value.toLowerCase().includes(searchValue.toLowerCase());
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20';
      case 'Review': return 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20';
      case 'Calling': return 'bg-[#00B8D9]/10 text-[#00B8D9] border border-[#00B8D9]/20';
      default: return 'bg-[#D0D5DD]/50 text-[#717784] border border-[#D0D5DD]';
    }
  };

  const getReviewTooltip = (log) => {
    const isCompleted = log.status === 'Completed';

    const getArrowStyle = () => {
      switch (tooltipPosition.arrowPosition) {
        case 'left':
          return 'absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-6 border-transparent border-r-gray-800';
        case 'right':
          return 'absolute right-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-gray-800';
        case 'top':
          return 'absolute top-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-6 border-transparent border-b-gray-800';
        case 'bottom':
          return 'absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-gray-800';
        default:
          return 'absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-6 border-transparent border-r-gray-800';
      }
    };

    return (
      <TooltipPortal isVisible={true}>
        <div
          className="fixed bg-[#1a1a1a] backdrop-blur-md text-white p-4 rounded-lg shadow-2xl z-50 max-w-[340px] border border-white/10"
          style={{
            top: `${tooltipPosition.y}px`,
            left: `${tooltipPosition.x}px`,
            transform: 'translateX(-50%)', // Always center horizontally
            pointerEvents: 'none'
          }}
        >
          {/* Header */}
          <div className="flex items-center mb-3">
            <span className="text-yellow-400 mr-2 text-lg">⚡</span>
            <span className="font-bold text-white">AI-powered summary</span>
          </div>

          {/* Summary */}
          <p className="text-sm mb-3 leading-relaxed text-gray-200">
            Called {log.callTo} for patient {log.callRegarding}
          </p>

          {/* Bullet Points - Different content based on status */}
          <ul className="text-xs space-y-1 mb-3 text-gray-300">
            {isCompleted ? (
              <>
                <li>• Successfully obtained claim status information</li>
                <li>• Patient details verified and recorded</li>
                <li>• Call completed with all required data captured</li>
              </>
            ) : (
              <>
                <li>• Missing call reference and claim numbers</li>
                <li>• Call transferred, agent couldn't provide SSN</li>
                <li>• No status obtained</li>
              </>
            )}
          </ul>

          {/* Footer - Different message based on status */}
          <p className="text-xs text-gray-400">
            {isCompleted
              ? "Call completed successfully with all data captured"
              : "Next steps: Verify patient details and retry call"
            }
          </p>

          {/* Arrow */}
          <div className={getArrowStyle()}></div>
        </div>
      </TooltipPortal>
    );
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1C21] tracking-tight">Search Calls</h1>
          <p className="text-[#717784] text-sm mt-1">{calls.length} calls found</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2.5 bg-white border border-[#D0D5DD] rounded-xl text-[#717784] hover:bg-[#F7F8FA] transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center space-x-3 ml-4 cursor-pointer pl-4">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            <ChevronDown size={14} className="text-[#717784]" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#EAECEF] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 border border-[#D0D5DD] rounded-lg text-sm text-[#1A1C21] font-medium focus:outline-none focus:ring-2 focus:ring-[#1359D2] bg-white w-36"
            >
              <option value="callId">Call ID</option>
              <option value="contact">Contact</option>
              <option value="call title">Call Title</option>
              <option value="insurance">Insurance</option>
              <option value="patient">Patient</option>
              <option value="practice">Practice</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717784] pointer-events-none" />
          </div>
          <input
            type="text"
            placeholder={`Search by ${filterType.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
            className="w-full lg:w-[320px] px-4 py-2.5 border border-[#D0D5DD] rounded-lg text-sm text-[#1A1C21] placeholder-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#1359D2] bg-white"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button
            onClick={handleFilter}
            className="px-6 py-2.5 bg-[#1359D2] text-white rounded-lg text-sm font-semibold hover:bg-[#104ab0] transition-colors"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Data Grid */}
      <div className="bg-white border border-[#EAECEF] rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-[#F7F8FA]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] uppercase tracking-wider whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedRows.size === filteredLogs.length && filteredLogs.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-[#1A1C21] transition-colors">Call Date <span className="text-[#D0D5DD] ml-1 text-[10px]">↕</span></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-[#1A1C21] transition-colors">Created On <span className="text-[#D0D5DD] ml-1 text-[10px]">↕</span></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-[#1A1C21] transition-colors">Call ID <span className="text-[#D0D5DD] ml-1 text-[10px]">↕</span></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-[#1A1C21] transition-colors">Call Type/Goal <span className="text-[#D0D5DD] ml-1 text-[10px]">↕</span></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-[#1A1C21] transition-colors">Call Title <span className="text-[#D0D5DD] ml-1 text-[10px]">↕</span></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-[#1A1C21] transition-colors">Call To <span className="text-[#D0D5DD] ml-1 text-[10px]">↕</span></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-[#1A1C21] transition-colors">Call Regarding <span className="text-[#D0D5DD] ml-1 text-[10px]">↕</span></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-[#1A1C21] transition-colors">Practice Name <span className="text-[#D0D5DD] ml-1 text-[10px]">↕</span></th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] uppercase tracking-wider whitespace-nowrap">Primary Info</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] uppercase tracking-wider whitespace-nowrap">Info</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-[#717784] uppercase tracking-wider whitespace-nowrap">Call Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7]">
              {filteredLogs.map((log, index) => (
                <tr key={log.callId} className="hover:bg-[#F7F8FA] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedRows.has(log.callId)}
                      onChange={() => handleRowSelect(log.callId)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1C21]">{log.callDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1C21]">{log.createdOn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#1A1C21]">{log.callId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4F59]">
                    <span className="px-2 py-1 bg-[#E1F1F8] text-[#1070B7] rounded text-xs font-medium">Claims (IVR)</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1C21]">{log.callTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1C21]">{log.callTo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1C21]">{log.callRegarding}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1C21]">{log.practiceName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1C21]">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.primaryInfo === 'Paid' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                      log.primaryInfo === 'Denied' ? 'bg-[#E02424]/10 text-[#E02424]' :
                      'bg-[#D0D5DD]/50 text-[#717784]'
                    }`}>
                      {log.primaryInfo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1A1C21]">{log.info}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)} cursor-pointer`}
                      onMouseEnter={(e) => {
                        if (log.status === 'Review' || log.status === 'Completed') {
                          // Add delay to prevent flickering
                          tooltipTimeoutRef.current = setTimeout(() => {
                            setHoveredRow(index);
                            // Position tooltip in a highly visible area - right side of viewport
                            const viewportWidth = window.innerWidth;
                            const viewportHeight = window.innerHeight;

                            // Position on the right side of the viewport for maximum visibility
                            const tooltipWidth = 340;
                            const tooltipHeight = 200;

                            let x = viewportWidth - tooltipWidth - 20; // Right side with margin
                            let y = window.scrollY + 100; // Fixed position from top of visible area
                            let arrowPosition = 'left';

                            // Center vertically in the visible area
                            const centerY = window.scrollY + viewportHeight / 2;
                            y = Math.max(window.scrollY + 20, Math.min(centerY - tooltipHeight / 2, window.scrollY + viewportHeight - tooltipHeight - 20));

                            setTooltipPosition({ x, y, arrowPosition });
                          }, 200);
                        }
                      }}
                      onMouseLeave={() => {
                        if (tooltipTimeoutRef.current) {
                          clearTimeout(tooltipTimeoutRef.current);
                        }
                        setHoveredRow(null);
                      }}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-6 bg-white border-t border-[#EAECEF]">
          <span className="text-sm text-[#717784]">Showing 1 to {filteredLogs.length} of {filteredLogs.length} results</span>
          <div className="flex items-center space-x-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D0D5DD] text-[#717784] hover:bg-[#F7F8FA] transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1359D2] text-white font-bold text-sm shadow-sm hover:bg-[#104ab0] transition-colors">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#D0D5DD] text-[#717784] hover:bg-[#F7F8FA] transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* AI Tooltip - Rendered via Portal */}
      {hoveredRow !== null && (filteredLogs[hoveredRow]?.status === 'Review' || filteredLogs[hoveredRow]?.status === 'Completed') && getReviewTooltip(filteredLogs[hoveredRow])}
    </div>
  );
};

export default SearchCalls;