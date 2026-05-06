import { useState } from 'react';
import { User, Bell, Phone, Activity, Camera, Settings as SettingsIcon, Lock, Trash2, ChevronRight, Mail, CheckCircle2, BarChart2, Calendar, Info, Zap, Snail, Sliders, Save, Upload, Code, HeartPulse, ExternalLink } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'calls', label: 'Calls', icon: <Phone size={18} /> },
    { id: 'system-calls', label: 'System Calls', icon: <Activity size={18} /> },
  ];

  const [selectedTimeZone, setSelectedTimeZone] = useState('');
  const allTimeZones = Intl.supportedValuesOf('timeZone');

  // New state for settings with localStorage persistence
  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      batchUpdates: true,
      batchReview: true,
      batchCompleted: true,
      dailyReports: true,
      weeklyReports: true
    };
  });

  const [batchSpeed, setBatchSpeed] = useState(() => {
    return localStorage.getItem('batchSpeed') || 'max';
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const turnOffAllNotifications = () => {
    setNotificationSettings({
      batchUpdates: false,
      batchReview: false,
      batchCompleted: false,
      dailyReports: false,
      weeklyReports: false
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Persist to localStorage
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    localStorage.setItem('batchSpeed', batchSpeed);

    // Simulate API call or actual backend call here
    // In a real app, you'd use axios.post('/api/settings', { notificationSettings, batchSpeed })
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const detectTimeZone = () => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setSelectedTimeZone(detected);
    } catch (e) {
      console.error('Failed to detect time zone:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">
      {/* Breadcrumbs */}
      <div className="text-sm mb-4">
        <span className="text-[#0050C8] font-bold cursor-pointer hover:underline">Dashboard</span>
        <span className="text-[#98A2B3] mx-2">&gt;</span>
        <span className="text-[#1A1C21] font-semibold">Settings</span>
      </div>

      <h1 className="text-3xl font-extrabold text-[#1A1C21] tracking-tight mb-8">Settings</h1>

      {/* Horizontal Sub-navigation */}
      <div className="border-b border-[#EAECEF] mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-2 border-b-2 font-semibold text-sm transition-colors flex items-center gap-2 ${activeTab === tab.id
                ? 'border-[#0050C8] text-[#0050C8]'
                : 'border-transparent text-[#717784] hover:text-[#1A1C21] hover:border-[#D0D5DD]'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Account Tab Content */}
      {activeTab === 'account' && (
        <div className="space-y-8">
          {/* Top Row - User Information & Call Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Information Card */}
            <div className="bg-white border border-[#EAECEF] rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-[#F0F5FF] rounded-full flex items-center justify-center text-[#0050C8]">
                    <User size={20} />
                 </div>
                 <h2 className="text-xl font-bold text-[#1A1C21]">User Information</h2>
              </div>

              {/* Profile Picture */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-20 h-20 bg-[#F7F8FA] rounded-full flex items-center justify-center border-2 border-[#EAECEF]">
                  <span className="text-2xl font-bold text-[#4A4F59]">AC</span>
                </div>
                <button className="flex items-center gap-2 text-[#0050C8] hover:text-[#003B95] font-medium transition-colors">
                  <Camera size={16} /> Add Photo
                </button>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-[#4A4F59] mb-2">First Name</label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className="w-full px-4 py-3 border border-[#EAECEF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0050C8] focus:border-transparent bg-white shadow-sm placeholder-[#98A2B3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#4A4F59] mb-2">Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    className="w-full px-4 py-3 border border-[#EAECEF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0050C8] focus:border-transparent bg-white shadow-sm placeholder-[#98A2B3]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#4A4F59] mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-[#EAECEF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0050C8] focus:border-transparent bg-white shadow-sm placeholder-[#98A2B3]"
                />
              </div>

              {/* Organization */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#4A4F59] mb-2">Organization</label>
                <input
                  type="text"
                  placeholder="Enter your organization"
                  className="w-full px-4 py-3 border border-[#EAECEF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0050C8] focus:border-transparent bg-white shadow-sm placeholder-[#98A2B3]"
                />
              </div>

              {/* Time Zone */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#4A4F59] mb-2">Time Zone</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedTimeZone}
                    onChange={(e) => setSelectedTimeZone(e.target.value)}
                    className="flex-1 px-4 py-3 border border-[#EAECEF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0050C8] focus:border-transparent bg-white text-sm shadow-sm"
                  >
                    <option value="">Select your time zone</option>
                    {allTimeZones.map(tz => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                  <button
                    onClick={detectTimeZone}
                    className="px-6 py-3 border border-[#0050C8] text-[#0050C8] rounded-lg hover:bg-[#F0F5FF] transition-colors font-semibold text-sm whitespace-nowrap bg-white"
                  >
                    Find My Time Zone
                  </button>
                </div>
              </div>

              {/* Save Changes */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full px-6 py-3 bg-[#0050C8] text-white rounded-lg hover:bg-[#003B95] transition-colors font-bold text-sm disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Call Configuration Card */}
            <div className="bg-white border border-[#EAECEF] rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-[#F0F5FF] rounded-full flex items-center justify-center text-[#0050C8]">
                    <Phone size={20} />
                 </div>
                 <h2 className="text-xl font-bold text-[#1A1C21]">Call Configuration</h2>
              </div>

              {/* Call Hours */}
              <div className="mb-6 border-b border-[#EAECEF] pb-6">
                <h3 className="text-sm font-bold text-[#4A4F59] uppercase tracking-wider mb-3">Call Hours</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#717784]">Regular Calls:</span>
                    <span className="text-sm text-[#1A1C21] font-semibold">Mon–Fri, 11:00 AM – 9:00 PM EDT</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#717784]">IVR Only:</span>
                    <span className="text-sm text-[#1A1C21] font-semibold">24/7</span>
                  </div>
                </div>
              </div>

              {/* Available Call Types */}
              <div className="mb-6 border-b border-[#EAECEF] pb-6">
                <h3 className="text-sm font-bold text-[#4A4F59] uppercase tracking-wider mb-3">Available Call Types</h3>
                <div className="flex space-x-3">
                  <span className="px-4 py-1.5 bg-[#F0F5FF] text-[#0050C8] border border-[#D0E1FF] rounded-full text-xs font-semibold">Claims</span>
                  <span className="px-4 py-1.5 bg-[#F0F5FF] text-[#0050C8] border border-[#D0E1FF] rounded-full text-xs font-semibold">Claims (IVR)</span>
                </div>
              </div>

              {/* Available Call Lines */}
              <div className="mb-6 border-b border-[#EAECEF] pb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#4A4F59] uppercase tracking-wider">Available Call Lines</h3>
                  <span className="text-sm text-[#1A1C21] font-semibold">1 line</span>
                </div>
                <button className="mt-2 text-[#0050C8] hover:text-[#003B95] font-semibold transition-colors text-sm">
                  Add lines
                </button>
              </div>

              {/* Smart Review */}
              <div className="mb-6 border-b border-[#EAECEF] pb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#4A4F59] uppercase tracking-wider">Smart Review</h3>
                  <span className="px-3 py-1 bg-[#ECFDF3] text-[#027A48] rounded-md text-xs font-semibold">Enabled</span>
                </div>
                <p className="text-xs text-[#717784] mt-1">AI-assisted data verification</p>
              </div>

              {/* Outbound Numbers */}
              <div>
                <h3 className="text-sm font-bold text-[#4A4F59] uppercase tracking-wider mb-2">Outbound Numbers</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-[#1A1C21] font-semibold">562-365-2392</span>
                  <span className="text-xs text-[#717784]">(appears on recipient caller ID)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Account Changes */}
          <div className="bg-white border border-[#EAECEF] rounded-xl p-8 mb-12">
             <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex gap-4 w-full lg:w-1/3">
                   <div className="w-12 h-12 bg-[#F0F5FF] rounded-full flex items-center justify-center text-[#0050C8] flex-shrink-0">
                      <SettingsIcon size={24} />
                   </div>
                   <div>
                      <h2 className="text-lg font-bold text-[#1A1C21]">Account Changes</h2>
                      <p className="text-sm text-[#717784] mt-1">Manage your account security and preferences.</p>
                   </div>
                </div>
                <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Change Password Card */}
                   <div className="border border-[#EAECEF] rounded-xl p-6 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer bg-white">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-[#F0F5FF] rounded-full flex items-center justify-center text-[#0050C8] flex-shrink-0">
                            <Lock size={20} />
                         </div>
                         <div>
                            <h3 className="text-base font-bold text-[#0050C8]">Change Password</h3>
                            <p className="text-xs text-[#717784] mt-1">Send password reset link<br/>to your email</p>
                         </div>
                      </div>
                      <ChevronRight size={20} className="text-[#98A2B3]" />
                   </div>

                   {/* Delete Account Card */}
                   <div className="border border-[#EAECEF] rounded-xl p-6 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer bg-white">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-[#FEF3F2] rounded-full flex items-center justify-center text-[#D92D20] flex-shrink-0">
                            <Trash2 size={20} />
                         </div>
                         <div>
                            <h3 className="text-base font-bold text-[#D92D20]">Delete Account</h3>
                            <p className="text-xs text-[#717784] mt-1">Permanently delete<br/>your account</p>
                         </div>
                      </div>
                      <ChevronRight size={20} className="text-[#98A2B3]" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white border border-[#EAECEF] rounded-xl p-8 mb-12">
          {/* Main Section Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1A1C21]">Email Notifications</h2>
            <span className="text-sm font-medium text-[#717784] bg-[#F7F8FA] px-3 py-1 rounded-md border border-[#EAECEF]">(MEST)</span>
          </div>

          {/* Toggle Options */}
          <div className="space-y-4">
            {/* Batch Updates */}
            <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-[#EAECEF] hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#F0F5FF] rounded-full flex items-center justify-center text-[#0050C8] flex-shrink-0">
                    <Mail size={24} />
                 </div>
                 <div>
                   <h3 className="text-base font-bold text-[#1A1C21]">Batch Updates (Immediate)</h3>
                   <p className="text-sm text-[#717784] mt-1">Receive email updates for batch completions</p>
                   <p className="text-xs text-[#98A2B3] mt-0.5">Calling does not include System Calls when batches finish.</p>
                 </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                <input
                  type="checkbox"
                  checked={notificationSettings.batchUpdates}
                  onChange={() => handleNotificationChange('batchUpdates')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0050C8]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0050C8]"></div>
              </label>
            </div>

            {/* Batch Review */}
            <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-[#EAECEF] hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#F0F5FF] rounded-full flex items-center justify-center text-[#0050C8] flex-shrink-0">
                    <Bell size={24} />
                 </div>
                 <div>
                   <h3 className="text-base font-bold text-[#1A1C21]">Batch Review</h3>
                   <p className="text-sm text-[#717784] mt-1">Get notified when batches enter review status</p>
                 </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                <input
                  type="checkbox"
                  checked={notificationSettings.batchReview}
                  onChange={() => handleNotificationChange('batchReview')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0050C8]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0050C8]"></div>
              </label>
            </div>

            {/* Batch Completed */}
            <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-[#EAECEF] hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#F0F5FF] rounded-full flex items-center justify-center text-[#0050C8] flex-shrink-0">
                    <CheckCircle2 size={24} />
                 </div>
                 <div>
                   <h3 className="text-base font-bold text-[#1A1C21]">Batch Completed</h3>
                   <p className="text-sm text-[#717784] mt-1">Receive notifications for fully processed batches</p>
                   <p className="text-xs text-[#98A2B3] mt-0.5">Daily reports for completed batches</p>
                 </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                <input
                  type="checkbox"
                  checked={notificationSettings.batchCompleted}
                  onChange={() => handleNotificationChange('batchCompleted')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0050C8]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0050C8]"></div>
              </label>
            </div>

            {/* Call Reports */}
            <div className="p-6 bg-white rounded-xl border border-[#EAECEF]">
              <div className="flex items-start gap-4 mb-6">
                 <div className="w-12 h-12 bg-[#F0F5FF] rounded-full flex items-center justify-center text-[#0050C8] flex-shrink-0">
                    <BarChart2 size={24} />
                 </div>
                 <div>
                   <h3 className="text-base font-bold text-[#1A1C21]">Call Reports (Daily/Weekly)</h3>
                   <p className="text-sm text-[#717784] mt-1">Get reports on call activities and performance</p>
                 </div>
              </div>

              <div className="ml-16 bg-[#F7F8FA] border border-[#EAECEF] rounded-lg p-2">
                 {/* Daily Reports Toggle */}
                 <div className="flex items-center justify-between p-4 bg-white rounded-md border border-[#EAECEF] mb-2">
                   <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-[#0050C8]" />
                      <div>
                        <h4 className="text-sm font-bold text-[#1A1C21]">Daily Reports</h4>
                        <p className="text-xs text-[#717784] mt-0.5">Reports sent at 3pm (weekdays)</p>
                      </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input
                       type="checkbox"
                       checked={notificationSettings.dailyReports}
                       onChange={() => handleNotificationChange('dailyReports')}
                       className="sr-only peer"
                     />
                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0050C8]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0050C8]"></div>
                   </label>
                 </div>

                 {/* Weekly Reports Toggle */}
                 <div className="flex items-center justify-between p-4 bg-white rounded-md border border-[#EAECEF]">
                   <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-[#0050C8]" />
                      <div>
                        <h4 className="text-sm font-bold text-[#1A1C21]">Weekly Reports</h4>
                        <p className="text-xs text-[#717784] mt-0.5">Reports sent every Friday for all System Calls</p>
                      </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input
                       type="checkbox"
                       checked={notificationSettings.weeklyReports}
                       onChange={() => handleNotificationChange('weeklyReports')}
                       className="sr-only peer"
                     />
                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#0050C8]/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0050C8]"></div>
                   </label>
                 </div>
              </div>
            </div>
            
            {/* Footer Notes */}
            <div className="flex items-center gap-3 text-sm text-[#0050C8] bg-[#F0F5FF] p-4 rounded-xl border border-[#D0E1FF]">
              <Info size={18} className="flex-shrink-0" />
              <p>Receive a report calls made at 3pm (weekdays) on Friday System Calls, includes Daily/Weekly reports.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#EAECEF]">
            <button
              onClick={turnOffAllNotifications}
              className="text-sm text-[#717784] hover:text-[#1A1C21] font-medium transition-colors"
            >
              Turn off all notifications
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#0050C8] text-white rounded-lg hover:bg-[#003B95] transition-colors font-semibold text-sm disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      )}

      {/* Calls Tab */}
      {activeTab === 'calls' && (
        <div className="bg-white border border-[#EAECEF] rounded-xl p-8 mb-12">
          {/* Section Title and Helper Text */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 bg-[#F0F5FF] rounded-full flex items-center justify-center text-[#0050C8] flex-shrink-0">
               <Phone size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1A1C21]">Default Batch Speed</h2>
              <p className="text-[#717784] text-sm mt-1 max-w-3xl">
                Choose how fast outbound calls should be placed. Slower speeds help avoid overwhelming smaller providers with too many calls.
              </p>
            </div>
          </div>

          {/* Speed Options */}
          <div className="space-y-4 mb-8">
            {/* Max Speed */}
            <div
              onClick={() => setBatchSpeed('max')}
              className={`flex items-center space-x-4 p-5 rounded-xl border cursor-pointer transition-all duration-200 ${batchSpeed === 'max'
                ? 'border-[#0050C8] bg-[#F0F5FF]'
                : 'border-[#EAECEF] hover:bg-[#F7F8FA]'
                }`}
            >
              <input
                type="radio"
                name="batchSpeed"
                value="max"
                checked={batchSpeed === 'max'}
                onChange={(e) => setBatchSpeed(e.target.value)}
                className="w-4 h-4 text-[#0050C8] border-[#D0D5DD] focus:ring-[#0050C8] cursor-pointer accent-[#0050C8] flex-shrink-0"
              />
              <div className="flex items-center gap-3">
                 <Zap size={20} className="text-[#0050C8]" />
                 <div>
                   <div className="flex items-center gap-2">
                     <span className="font-bold text-base text-[#1A1C21]">Max Speed</span>
                     <span className="text-sm">⚡</span>
                   </div>
                   <p className="text-sm text-[#717784] mt-0.5">As fast as possible</p>
                 </div>
              </div>
            </div>

            {/* Low Speed */}
            <div
              onClick={() => setBatchSpeed('low')}
              className={`flex items-center space-x-4 p-5 rounded-xl border cursor-pointer transition-all duration-200 ${batchSpeed === 'low'
                ? 'border-[#0050C8] bg-[#F0F5FF]'
                : 'border-[#EAECEF] hover:bg-[#F7F8FA]'
                }`}
            >
              <input
                type="radio"
                name="batchSpeed"
                value="low"
                checked={batchSpeed === 'low'}
                onChange={(e) => setBatchSpeed(e.target.value)}
                className="w-4 h-4 text-[#0050C8] border-[#D0D5DD] focus:ring-[#0050C8] cursor-pointer accent-[#0050C8] flex-shrink-0"
              />
              <div className="flex items-center gap-3">
                 <Snail size={20} className="text-[#027A48]" />
                 <div>
                   <div className="flex items-center gap-2">
                     <span className="font-bold text-base text-[#1A1C21]">Low Speed</span>
                     <span className="text-sm">🐢</span>
                   </div>
                   <p className="text-sm text-[#717784] mt-0.5">One concurrent call per contact every 60 minutes</p>
                 </div>
              </div>
            </div>

            {/* Custom Speed */}
            <div
              onClick={() => setBatchSpeed('custom')}
              className={`flex items-center space-x-4 p-5 rounded-xl border cursor-pointer transition-all duration-200 ${batchSpeed === 'custom'
                ? 'border-[#0050C8] bg-[#F0F5FF]'
                : 'border-[#EAECEF] hover:bg-[#F7F8FA]'
                }`}
            >
              <input
                type="radio"
                name="batchSpeed"
                value="custom"
                checked={batchSpeed === 'custom'}
                onChange={(e) => setBatchSpeed(e.target.value)}
                className="w-4 h-4 text-[#0050C8] border-[#D0D5DD] focus:ring-[#0050C8] cursor-pointer accent-[#0050C8] flex-shrink-0"
              />
              <div className="flex items-center gap-3">
                 <Sliders size={20} className="text-[#6941C6]" />
                 <div>
                   <div className="flex items-center gap-2">
                     <span className="font-bold text-base text-[#1A1C21]">Custom Speed</span>
                     <span className="text-sm">⚙️</span>
                   </div>
                   <p className="text-sm text-[#717784] mt-0.5">One concurrent call per contact every custom interval</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Save Changes Button */}
          <div className="flex justify-start">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0050C8] text-white rounded-lg hover:bg-[#003B95] transition-colors font-semibold text-sm disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* System Calls Tab */}
      {activeTab === 'system-calls' && (
        <div className="space-y-6 max-w-5xl">
          {/* Subtitle Banner */}
          <div className="flex items-center gap-3 bg-[#F0F5FF] border border-[#D0E1FF] rounded-xl p-4">
            <Info size={20} className="text-[#0050C8] flex-shrink-0" />
            <p className="text-[#0050C8] font-medium text-sm">
              All system calls programmed via SFTP, API, or EHR connection
            </p>
          </div>

          {/* Connection Cards */}
          <div className="space-y-4">
            {/* SFTP Card */}
            <div className="bg-white border border-[#EAECEF] rounded-xl p-6 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[#F0F5FF] rounded-full flex items-center justify-center text-[#0050C8] flex-shrink-0">
                  <Upload size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1C21] mb-2">SFTP</h3>
                  <button className="flex items-center space-x-1 text-[#0050C8] hover:text-[#003B95] font-bold text-sm transition-colors">
                    <span className="text-lg leading-none">+</span>
                    <span>Add Connection</span>
                  </button>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#FEF3F2] text-[#B42318] rounded-full text-xs font-semibold self-start mt-2">
                Not Connected
              </span>
            </div>

            {/* API Card */}
            <div className="bg-white border border-[#EAECEF] rounded-xl p-6 flex items-start justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-[#F0F5FF] rounded-full flex items-center justify-center text-[#0050C8] flex-shrink-0">
                  <Code size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1C21] mb-1">API</h3>
                  <p className="text-sm text-[#717784] mb-3">
                    Learn what data to send and what responses to expect.
                  </p>
                  <button className="flex items-center space-x-1.5 text-[#0050C8] hover:text-[#003B95] font-bold text-sm transition-colors mb-4">
                    <span>View Docs</span>
                    <ExternalLink size={14} />
                  </button>
                  <button className="flex items-center space-x-1 text-[#0050C8] hover:text-[#003B95] font-bold text-sm transition-colors">
                    <span className="text-lg leading-none">+</span>
                    <span>Add Connection</span>
                  </button>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#FEF3F2] text-[#B42318] rounded-full text-xs font-semibold mt-2">
                Not Connected
              </span>
            </div>

            {/* EHR Card */}
            <div className="bg-white border border-[#EAECEF] rounded-xl p-6 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[#F0F5FF] rounded-full flex items-center justify-center text-[#0050C8] flex-shrink-0">
                  <HeartPulse size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1A1C21] mb-2">EHR</h3>
                  <button className="flex items-center space-x-1 text-[#0050C8] hover:text-[#003B95] font-bold text-sm transition-colors">
                    <span className="text-lg leading-none">+</span>
                    <span>Add Connection</span>
                  </button>
                </div>
              </div>
              <span className="px-3 py-1 bg-[#FEF3F2] text-[#B42318] rounded-full text-xs font-semibold self-start mt-2">
                Not Connected
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-[#1A1C21] text-white px-6 py-3 rounded-lg shadow-2xl flex items-center space-x-3 animate-toast-in z-50">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-medium">Changes saved successfully</span>
        </div>
      )}
    </div>
  );
};

export default Settings;