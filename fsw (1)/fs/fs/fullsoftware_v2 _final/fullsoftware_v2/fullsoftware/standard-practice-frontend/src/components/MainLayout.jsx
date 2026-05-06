import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Phone,
  Layers,
  FileText,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
} from 'lucide-react';
import logoSymbol from '../assets/logo.png';

const MainLayout = ({ onLogout }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className="flex h-screen bg-[#F7F8FA] overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`bg-[#3B82F6] border-r border-[#3B82F6] flex flex-col z-50 transition-all duration-300 ease-in-out fixed inset-y-0 left-0 lg:relative
          ${isSidebarOpen ? 'w-64 translate-x-0 shadow-2xl lg:shadow-none' : 'w-20 translate-x-0'}`}
      >
        <div className={`flex flex-col items-center py-6 mb-2 ${isSidebarOpen ? 'px-6' : 'w-full'}`}>
          <div className={`flex items-center w-full mb-6 ${!isSidebarOpen && 'justify-center'}`}>
            {isSidebarOpen ? (
              <div className="flex items-center space-x-2">
                 <img src={logoSymbol} alt="B" className="w-8 h-8 object-contain bg-white rounded-full p-1" />
                 <span className="text-white font-bold text-xl leading-tight">BRISTOL<br/><span className="text-[10px] font-normal tracking-wide">Healthcare Services</span></span>
              </div>
            ) : (
              <img src={logoSymbol} alt="B" className="w-10 h-10 object-contain bg-white rounded-full p-1" />
            )}
          </div>
          <button 
            onClick={toggleSidebar}
            className={`flex items-center p-2 text-white/80 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200 ${isSidebarOpen ? 'self-start w-auto px-3' : 'w-full justify-center'}`}
            aria-label="Toggle Sidebar"
          >
            <Menu size={24} />
            {isSidebarOpen && <span className="ml-4 text-sm font-bold text-white">Menu</span>}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" to="/" active={location.pathname === '/'} isOpen={isSidebarOpen} />
          <NavItem icon={<Phone size={20} />} label="Calls" to="/search-calls" active={location.pathname === '/search-calls'} isOpen={isSidebarOpen} />
          <NavItem icon={<Layers size={20} />} label="Batches" to="/search-batches" active={location.pathname === '/search-batches'} isOpen={isSidebarOpen} />
          <NavItem icon={<FileText size={20} />} label="Templates" to="/templates" active={location.pathname === '/templates'} isOpen={isSidebarOpen} />
          <NavItem icon={<Users size={20} />} label="Contact Insights" to="/contact-insights" active={location.pathname === '/contact-insights'} isOpen={isSidebarOpen} />
          
          <div className="pt-4 mt-4 border-t border-white/10">
            <NavItem icon={<Settings size={20} />} label="Settings" to="/settings" active={location.pathname === '/settings'} isOpen={isSidebarOpen} />
            <NavItem icon={<HelpCircle size={20} />} label="Help Center" to="/help" active={location.pathname === '/help'} isOpen={isSidebarOpen} />
          </div>
        </nav>

        <div className="p-3 mt-auto">
          <button 
            onClick={onLogout}
            className={`flex items-center w-full p-3 text-white hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200 group
              ${!isSidebarOpen && 'lg:justify-center'}`}
          >
            <LogOut size={20} className={`${isSidebarOpen && 'mr-4'} group-hover:scale-110 transition-transform`} />
            {isSidebarOpen && <span className="text-sm font-semibold">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#F7F8FA]">
          <Outlet context={{ onLogout, isSidebarOpen }} />
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, to, active, isOpen }) => {
  return (
    <Link
      to={to}
      className={`flex items-center p-3 rounded-full transition-all duration-200 group mb-1
        ${active 
          ? 'bg-white text-[#3B82F6]' 
          : 'text-white hover:bg-white/10 hover:text-white'}
        ${!isOpen && 'lg:justify-center'}`}
      title={!isOpen ? label : ''}
    >
      <div className={`${isOpen && 'mr-4'} transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      {isOpen && <span className="text-sm font-semibold whitespace-nowrap">{label}</span>}
      {active && isOpen && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />}
    </Link>
  );
};

export default MainLayout;