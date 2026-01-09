
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CanteenModule from './components/CanteenModule';
import LibraryModule from './components/LibraryModule';
import AdminModule from './components/AdminModule';
import ExamModule from './components/ExamModule';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView onNavigate={setActiveTab} />;
      case 'canteen':
        return <CanteenModule />;
      case 'library':
        return <LibraryModule />;
      case 'admin':
        return <AdminModule />;
      case 'exams':
        return <ExamModule />;
      default:
        return <HomeView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar activeTab={activeTab} onNavigate={setActiveTab} />
      <main className="animate-in fade-in duration-500">
        {renderContent()}
      </main>
    </div>
  );
};

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const services = [
    {
      id: 'canteen',
      title: 'Smart Canteen',
      desc: 'Predictive pre-ordering & group splitting.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'bg-teal-500',
    },
    {
      id: 'library',
      title: 'Library Hub',
      desc: 'Real-time seat availability & floor analytics.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      color: 'bg-blue-600',
    },
    {
      id: 'admin',
      title: 'Administration',
      desc: 'Digital token system for campus services.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-indigo-600',
    },
    {
      id: 'exams',
      title: 'Exam Cell',
      desc: 'Certificate requests & verification slots.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'bg-cyan-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-12">
      <header className="mb-12 text-center lg:text-left">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome back, Student</h2>
        <p className="text-lg text-gray-500">Your campus is smarter today. Check live status and save time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => onNavigate(service.id)}
            className="group cursor-pointer bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
          >
            <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
              {service.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
            <div className="mt-6 flex items-center text-teal-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Explore Service
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white flex flex-col justify-between min-h-[300px] overflow-hidden relative">
          <div className="relative z-10">
             <span className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-2 block">Campus Update</span>
             <h3 className="text-3xl font-bold mb-4">Canteen Peak Hour Approaching</h3>
             <p className="opacity-80 max-w-sm mb-6">AI predicts high congestion in 25 minutes. Pre-order now to skip the 15-minute queue.</p>
             <button onClick={() => onNavigate('canteen')} className="bg-teal-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-400 transition-all">
                PRE-ORDER NOW
             </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-3xl -mr-20 -mt-20"></div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Campus Efficiency Hub</h3>
              <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-bold uppercase">Live Stats</span>
           </div>
           <div className="space-y-6">
              {[
                { label: 'Avg. Wait Time Reduced', val: '22%', color: 'bg-green-500' },
                { label: 'Food Waste Prevented', val: '14.2 kg', color: 'bg-teal-500' },
                { label: 'Resources Optimized', val: '89%', color: 'bg-blue-500' }
              ].map((stat, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                    <span>{stat.label}</span>
                    <span className="font-bold text-gray-900">{stat.val}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: idx === 0 ? '75%' : idx === 1 ? '60%' : '89%' }}></div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

    </div>
  );
};

export default App;
