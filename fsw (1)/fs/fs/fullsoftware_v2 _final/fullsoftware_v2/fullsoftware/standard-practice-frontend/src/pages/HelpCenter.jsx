import React, { useState } from 'react';
import {
  Search,
  HelpCircle,
  MessageSquare,
  Book,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ChevronUp,
  ArrowRight,
  BookOpen,
  Layers,
  Headphones,
  Settings,
  FileText,
  Play,
  Lightbulb
} from 'lucide-react';
import HelpChatbot from './HelpChatbot';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const faqs = [
    {
      id: 'getting-started',
      icon: <BookOpen size={24} />,
      title: 'Getting Started',
      subtitle: 'Learn the basics and get up to speed quickly',
      questions: [
        {
          q: 'How do I create my first call batch?',
          a: 'To create your first call batch, click the "Create Call Batch" button in the sidebar or dashboard. Follow the wizard steps to select your template, configure settings, and schedule your batch.'
        },
        {
          q: 'What is a call batch?',
          a: 'A call batch is a collection of phone numbers that will be called automatically using your selected IVR template. Batches can be scheduled, monitored, and managed from the dashboard.'
        }
      ]
    },
    {
      id: 'batch-management',
      icon: <Layers size={24} />,
      title: 'Batch Management',
      subtitle: 'Manage and process your batches efficiently',
      questions: [
        {
          q: 'How do I stop a running batch?',
          a: 'Navigate to the dashboard and find your batch in the "In Queue" column. Click the "Stop" button and confirm the action. The batch will be stopped immediately.'
        },
        {
          q: 'Can I edit a batch after it\'s created?',
          a: 'Yes, draft batches can be edited. Click the "Edit" button on any draft batch in the dashboard to modify its settings, template, or phone list.'
        },
        {
          q: 'How do I review completed batches?',
          a: 'Completed batches appear in the "Review" column on the dashboard. Click "Review" to analyze call results, success rates, and generate reports.'
        }
      ]
    },
    {
      id: 'templates',
      icon: <Headphones size={24} />,
      title: 'Templates & IVR',
      subtitle: 'Create and manage templates and IVR flows',
      questions: [
        {
          q: 'How do I create a custom IVR template?',
          a: 'Go to the Templates page and click "Create new template". Choose your template type and customize the call flow, messages, and responses.'
        },
        {
          q: 'What template types are available?',
          a: 'We support Claims IVR templates for insurance claims processing, with customizable voice responses and data collection options.'
        }
      ]
    },
    {
      id: 'settings',
      icon: <Settings size={24} />,
      title: 'Settings & Configuration',
      subtitle: 'Configure system settings and preferences',
      questions: [
        {
          q: 'How do I add a phone connection?',
          a: 'Go to Settings > System Calls and click "Add connection". Enter your phone number details and configure the connection settings.'
        },
        {
          q: 'Can I change call hours?',
          a: 'Call hours are configured in Settings > Calls. You can set regular business hours and IVR availability (which is 24/7 by default).'
        }
      ]
    }
  ];

  const quickLinks = [
    { 
      title: 'Contact Support', 
      icon: <Phone size={24} />, 
      action: 'Call us at 1-800-HELP-NOW', 
      hasLink: false 
    },
    { 
      title: 'Email Support', 
      icon: <Mail size={24} />, 
      action: 'support@standardpractice.com', 
      hasLink: false 
    },
    { 
      title: 'Documentation', 
      icon: <FileText size={24} />, 
      action: 'View full documentation', 
      hasLink: true, 
      linkText: 'View docs' 
    },
    { 
      title: 'Video Tutorials', 
      icon: <Play size={24} />, 
      action: 'Watch tutorial videos', 
      hasLink: true, 
      linkText: 'Watch now' 
    }
  ];

  const filteredFaqs = faqs.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.questions.some(q =>
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA] overflow-y-auto">
      <div className="max-w-[1400px] mx-auto w-full">
        {/* Header Section */}
        <div className="px-8 py-8 pb-4">
          <div className="text-sm mb-4">
            <span className="text-[#0050C8] font-bold cursor-pointer hover:underline">Dashboard</span>
            <span className="text-[#98A2B3] mx-2">&gt;</span>
            <span className="text-[#1A1C21] font-semibold">Help Center</span>
          </div>
          
          <h1 className="text-[32px] font-bold text-[#1A1C21] leading-tight">Help Center</h1>
          <p className="text-base text-[#717784] mt-1">Find answers and get support</p>

          {/* Search Bar */}
          <div className="mt-8 flex gap-3 items-center max-w-4xl">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#98A2B3]" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-4 py-4 bg-white border border-[#EAECEF] rounded-xl text-base placeholder-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#0050C8] focus:border-transparent shadow-sm"
              />
            </div>
            <button className="bg-[#E5EFFF] text-[#0050C8] p-4 rounded-xl hover:bg-[#D0E1FF] transition-colors border border-[#E5EFFF]">
              <Search size={24} />
            </button>
          </div>

          {/* Popular Topics */}
          <div className="flex items-center gap-3 mt-6">
            <span className="text-sm text-[#717784] font-medium">Popular topics:</span>
            <div className="flex gap-2">
              {['Calls', 'Batches', 'Templates', 'IVR', 'Reports'].map((topic) => (
                <button key={topic} className="px-5 py-2 bg-white border border-[#EAECEF] rounded-full text-sm font-semibold text-[#0050C8] hover:bg-[#F0F5FF] transition-colors shadow-sm">
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="px-8 pb-12 flex gap-8">
          
          {/* Left Column */}
          <div className="flex-1 min-w-0 space-y-10 mt-6">
            
            {/* Quick Support */}
            <div>
              <h2 className="text-xl font-bold text-[#1A1C21] mb-5">Quick Support</h2>
              <div className="grid grid-cols-2 gap-5">
                {quickLinks.map((link, index) => (
                  <div key={index} className="bg-white border border-[#EAECEF] rounded-xl p-6 flex flex-col justify-between hover:shadow-md transition-all duration-200 border-l-[3px] border-l-[#0050C8] shadow-sm">
                     <div className="flex flex-col h-full justify-between">
                       <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[#F0F5FF] rounded-full flex items-center justify-center text-[#0050C8] flex-shrink-0">
                            {link.icon}
                          </div>
                          <div className="flex-1 mt-1">
                             <h3 className="text-base font-bold text-[#1A1C21]">{link.title}</h3>
                             <p className="text-sm text-[#717784] mt-1">{link.action}</p>
                             {link.hasLink && (
                               <a href="#" className="inline-flex items-center gap-1 text-sm font-bold text-[#0050C8] mt-3 hover:underline">
                                 {link.linkText} <ExternalLink size={14} />
                               </a>
                             )}
                          </div>
                          <ArrowRight size={20} className="text-[#0050C8] self-center ml-2" />
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Browse Help Topics */}
            <div>
              <h2 className="text-xl font-bold text-[#1A1C21] mb-5">Browse Help Topics</h2>
              <div className="space-y-4">
                {filteredFaqs.map(section => (
                  <div key={section.id} className="bg-white border border-[#EAECEF] rounded-xl overflow-hidden hover:shadow-sm transition-shadow shadow-sm">
                     <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-6 py-5 text-left flex items-center justify-between bg-white hover:bg-[#F7F8FA] transition-colors"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-[#F0F5FF] rounded-xl flex items-center justify-center text-[#0050C8]">
                             {section.icon}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#1A1C21]">{section.title}</h3>
                            <p className="text-sm text-[#717784] mt-0.5">{section.subtitle}</p>
                          </div>
                        </div>
                        {expandedSections[section.id] ?
                          <ChevronUp size={24} className="text-[#98A2B3]" /> :
                          <ChevronDown size={24} className="text-[#98A2B3]" />
                        }
                      </button>
                      {expandedSections[section.id] && (
                        <div className="px-6 pb-6 pt-2 pl-24 space-y-4">
                           <div className="space-y-4">
                              {section.questions.map((faq, index) => (
                                <div key={index} className="border-t border-[#F2F4F7] pt-4 first:border-t-0 first:pt-0">
                                  <h4 className="text-sm font-bold text-[#1A1C21] mb-2">{faq.q}</h4>
                                  <p className="text-sm text-[#717784] leading-relaxed">{faq.a}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                      )}
                  </div>
                ))}
                {filteredFaqs.length === 0 && searchQuery && (
                  <div className="text-center py-12 bg-white rounded-xl border border-[#EAECEF]">
                    <HelpCircle size={48} className="mx-auto text-[#D0D5DD] mb-4" />
                    <h3 className="text-lg font-bold text-[#1A1C21] mb-2">No results found</h3>
                    <p className="text-sm text-[#717784]">Try adjusting your search terms or browse the topics above.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="w-[340px] space-y-6 flex-shrink-0 pt-[48px] mt-6">
             
             {/* Need more help? */}
             <div className="bg-white border border-[#EAECEF] rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 bg-[#F0F5FF] rounded-full flex items-center justify-center text-[#0050C8]">
                      <Headphones size={20} />
                   </div>
                   <h3 className="text-base font-bold text-[#1A1C21]">Need more help?</h3>
                </div>
                <p className="text-sm text-[#1A1C21] font-medium mb-1">Chat with our support team</p>
                <p className="text-xs text-[#717784] mb-5">We typically reply in a few minutes.</p>
                <button 
                   onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
                   className="w-full py-2.5 bg-[#0050C8] text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#003B95] transition-colors"
                >
                   <MessageSquare size={18} /> Start a chat
                </button>
             </div>

          </div>
        </div>
      </div>
      <HelpChatbot />
    </div>
  );
};

export default HelpCenter;