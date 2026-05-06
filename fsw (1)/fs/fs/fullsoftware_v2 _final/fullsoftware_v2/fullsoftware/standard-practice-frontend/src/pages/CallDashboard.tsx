import React, { useState } from 'react';

// Mock Data
const mockContacts = [
  {
    id: 1,
    name: 'MEDICARE',
    phone: '(800) 633-4227',
    tag: 'Claims (IVR)',
    status: 'Claim Status',
    percentage: '85%',
    avgTime: '2.3m',
    calls: '245'
  },
  {
    id: 2,
    name: 'HUMANA',
    phone: '(800) 448-6262',
    tag: 'Claims (IVR)',
    status: 'Claim Status',
    percentage: '78%',
    avgTime: '3.1m',
    calls: '189'
  },
  {
    id: 3,
    name: 'Blue Cross Blue Shield of Wyoming',
    phone: '(307) 234-5443',
    tag: 'Claims (IVR)',
    status: 'Eligibility Check',
    percentage: '92%',
    avgTime: '1.8m',
    calls: '156'
  },
  {
    id: 4,
    name: 'CIGNA',
    phone: '(800) 997-1654',
    tag: 'Claims (IVR)',
    status: 'Claim Status',
    percentage: '88%',
    avgTime: '2.7m',
    calls: '134'
  }
];

const mockBatches = {
  draft: [
    {
      id: 'CB-1031',
      title: 'New Batch - AC Apr 01, 2026',
      type: 'Claims (IVR)',
      calls: '50',
      status: 'Not scheduled',
      date: 'Apr 01, 2026',
      creator: 'AC',
      action: 'Edit'
    }
  ],
  inQueue: [
    {
      id: 'CB-1030',
      title: '0401 Part1',
      type: 'Claims (IVR)',
      progress: '38 / 495',
      info: '38 Info',
      date: 'Apr 01, 2026',
      creator: 'AC',
      status: 'Calling',
      action: 'Stop'
    }
  ],
  review: [
    {
      id: 'CB-1029',
      title: 'Comm Ins 740325',
      type: 'Claims',
      progress: '105 / 130',
      info: '105 Info',
      date: 'Mar 30, 2026',
      creator: 'JD',
      status: 'Review',
      action: 'Review'
    }
  ],
  completed: []
};

// Mock Data
const mockContacts = [
  {
    id: 1,
    name: 'MEDICARE',
    phone: '(800) 633-4227',
    tag: 'Claims (IVR)',
    status: 'Claim Status',
    percentage: '85%',
    avgTime: '2.3m',
    calls: '245'
  },
  {
    id: 2,
    name: 'HUMANA',
    phone: '(800) 448-6262',
    tag: 'Claims (IVR)',
    status: 'Claim Status',
    percentage: '78%',
    avgTime: '3.1m',
    calls: '189'
  },
  {
    id: 3,
    name: 'Blue Cross Blue Shield of Wyoming',
    phone: '(307) 234-5443',
    tag: 'Claims (IVR)',
    status: 'Eligibility Check',
    percentage: '92%',
    avgTime: '1.8m',
    calls: '156'
  },
  {
    id: 4,
    name: 'CIGNA',
    phone: '(800) 997-1654',
    tag: 'Claims (IVR)',
    status: 'Claim Status',
    percentage: '88%',
    avgTime: '2.7m',
    calls: '134'
  }
];

const mockBatches = {
  draft: [
    {
      id: 'CB-1031',
      title: 'New Batch - AC Apr 01, 2026',
      type: 'Claims (IVR)',
      calls: '50',
      status: 'Not scheduled',
      date: 'Apr 01, 2026',
      creator: 'AC',
      action: 'Edit'
    }
  ],
  inQueue: [
    {
      id: 'CB-1030',
      title: '0401 Part1',
      type: 'Claims (IVR)',
      progress: '38 / 495',
      info: '38 Info',
      date: 'Apr 01, 2026',
      creator: 'AC',
      status: 'Calling',
      action: 'Stop'
    }
  ],
  review: [
    {
      id: 'CB-1029',
      title: 'Comm Ins 740325',
      type: 'Claims',
      progress: '105 / 130',
      info: '105 Info',
      date: 'Mar 30, 2026',
      creator: 'JD',
      status: 'Review',
      action: 'Review'
    }
  ],
  completed: []
};

// Component Definitions
const Sidebar: React.FC = () => {
  return (
    <div className="w-[180px] bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-lg font-bold text-blue-600">Standard Practice</h1>
      </div>

      {/* Organization */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">B</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Bristol Healthcare Services</p>
            <p className="text-sm text-gray-600">Alvin Cortez</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
          <span className="w-4 h-4 text-center">🏠</span>
          <span>Dashboard</span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
          <span className="w-4 h-4 text-center">📞</span>
          <span>Calls</span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
          <span className="w-4 h-4 text-center">📦</span>
          <span>Batches</span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
          <span className="w-4 h-4 text-center">📄</span>
          <span>Templates</span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
          <span className="w-4 h-4 text-center">📊</span>
          <span>Contact Insights</span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md">
          <span className="w-4 h-4 text-center">+</span>
          <span>Create Call Batch</span>
        </a>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
          <span className="w-4 h-4 text-center">⚙️</span>
          <span>Settings</span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
          <span className="w-4 h-4 text-center">❓</span>
          <span>Help Center</span>
        </a>
        <button className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md w-full">
          <span className="w-4 h-4 text-center">🚪</span>
          <span>Log Out</span>
        </button>
        <div className="pt-4 text-xs text-gray-500 text-center">
          <p>© 2024 Standard Practice</p>
          <p>Privacy Policy • Terms of Service</p>
        </div>
      </div>
    </div>
  );
};

const TopBanner: React.FC = () => {
  return (
    <div className="bg-gray-100 border-b border-gray-200 px-6 py-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-700">
          ⚠️ Outside Call Hours - Automated calls are paused until 9:00 AM
        </p>
        <p className="text-sm text-gray-600">Contact us</p>
      </div>
    </div>
  );
};

const HeaderBar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold" style={{ color: '#1d2230' }}>Call Dashboard</h1>
          <span className="text-sm text-gray-600">Updated 4/2/2026 6:16 AM</span>
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800">
            <span className="w-4 h-4 text-center">↻</span>
            <span>Refresh</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              <span>Recently Viewed Batches</span>
              <span className="w-4 h-4 text-center">▼</span>
            </button>

            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-md shadow-lg border z-10">
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">0401 Part1</p>
                        <p className="text-sm text-gray-600">38/495 calls</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Calling</span>
                        <button className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">Stop</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">Comm Ins 740325</p>
                        <p className="text-sm text-gray-600">105/130 calls</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Review</span>
                        <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">Review</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button className="flex items-center space-x-2 px-4 py-2 text-white rounded-md hover:opacity-90" style={{ backgroundColor: '#21a9ee' }}>
            <span className="w-4 h-4 text-center">+</span>
            <span>Create Call Batch</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const TopContactsRow: React.FC = () => {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Top Contacts</h2>
        <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>Last 90 Days</option>
        </select>
      </div>

      <div className="flex space-x-4 overflow-x-auto">
        {mockContacts.map((contact) => (
          <div key={contact.id} className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{contact.name}</h3>
                <p className="text-sm text-gray-600">{contact.phone}</p>
              </div>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                {contact.tag}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-700">{contact.status}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 font-medium">{contact.percentage}</span>
                <span className="text-gray-600">{contact.avgTime} avg</span>
                <span className="text-gray-600">{contact.calls} calls</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SystemCallsBar: React.FC = () => {
  return (
    <div className="mx-6 my-4 bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600">🌐</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">System Calls</h3>
            <p className="text-sm text-gray-600">No connections</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
            <span className="w-4 h-4 text-center">+</span>
            <span>Add connection</span>
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <span className="w-4 h-4 text-center">⚙️</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface BatchCardProps {
  batch: {
    id: string;
    title: string;
    type: string;
    calls?: string;
    progress?: string;
    info?: string;
    status?: string;
    date: string;
    creator: string;
    action: string;
  };
}

const BatchCard: React.FC<BatchCardProps> = ({ batch }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-sm mb-1">{batch.title}</h4>
          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium mb-2">
            {batch.type}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <span className="w-4 h-4 text-center">⋯</span>
        </button>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {batch.progress && (
          <div className="flex justify-between">
            <span>{batch.progress} Calls</span>
            {batch.info && <span>{batch.info}</span>}
          </div>
        )}
        {batch.calls && !batch.progress && (
          <div className="flex justify-between">
            <span>{batch.calls} calls</span>
            <span>{batch.status || 'Draft'}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span>{batch.date}</span>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-xs">{batch.creator}</span>
            </div>
            <button className={`px-3 py-1 rounded text-xs font-medium ${
              batch.action === 'Edit' ? 'bg-blue-600 text-white hover:bg-blue-700' :
              batch.action === 'Stop' ? 'border border-red-600 text-red-600 hover:bg-red-50' :
              batch.action === 'Review' ? 'bg-blue-600 text-white hover:bg-blue-700' :
              'bg-gray-600 text-white'
            }`}>
              {batch.action}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface BatchColumnProps {
  title: string;
  batches: any[];
  showViewAll?: boolean;
  count?: number;
  showToday?: boolean;
}

const BatchColumn: React.FC<BatchColumnProps> = ({ title, batches, showViewAll = false, count, showToday = false }) => {
  const getHeaderBg = () => {
    switch (title) {
      case 'Draft': return '#58595B'; // Dark grey from logo
      case 'In Queue': return '#1070B7'; // Blue from logo
      case 'Review': return '#C1272D'; // Red from logo
      case 'Completed': return '#6AB143'; // Green from logo
      default: return '#0f1222';
    }
  };

  return (
    <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
      <div className="text-white p-4" style={{ backgroundColor: getHeaderBg() }}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{title}</h3>
          <div className="flex items-center space-x-2">
            {showToday && (
              <div className="flex items-center space-x-1">
                <button className="text-white/70 hover:text-white">‹</button>
                <span className="px-2 py-0.5 bg-black/20 rounded text-[10px]">Today</span>
                <button className="text-white/70 hover:text-white">›</button>
              </div>
            )}
            {showViewAll && (
              <span className="text-xs text-white/70">View all ({count || 0})</span>
            )}
            {title === 'Completed' && (
              <span className="text-xs text-white/70">Last 30 days</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 min-h-[600px]">
        {batches.length > 0 ? (
          batches.map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))
        ) : title === 'Completed' ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="w-8 h-8 text-center text-2xl">📦</span>
            </div>
            <p className="text-gray-600 mb-4">No completed batches in the last 30 days</p>
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
              Create call batch
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const CallDashboard: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f7fb' }}>
      <Sidebar />
      <div className="ml-[180px]">
        <TopBanner />
        <HeaderBar />
        <TopContactsRow />
        <SystemCallsBar />

        <div className="px-6 pb-6">
          <div className="flex space-x-6">
            <BatchColumn title="Draft" batches={mockBatches.draft} showViewAll={true} count={12} />
            <BatchColumn title="In Queue" batches={mockBatches.inQueue} showToday={true} />
            <BatchColumn title="Review" batches={mockBatches.review} />
            <BatchColumn title="Completed" batches={mockBatches.completed} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallDashboard;