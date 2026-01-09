
import React, { useState, useEffect } from 'react';
import { getCampusPrediction } from '../geminiService';
import { PredictionResult } from '../types';
import PredictionIndicator from './PredictionIndicator';
import { savePredictionHistory, saveServiceUsage } from '../firestoreService';

const ExamModule: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [service, setService] = useState('Marks Card Collection');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    fetchPrediction();
  }, [selectedDay, selectedTime, service]);

  const fetchPrediction = async () => {
    setLoadingPrediction(true);
    const res = await getCampusPrediction('Exam Cell', selectedDay, selectedTime, `Service: ${service}`);
    setPrediction(res);
    setLoadingPrediction(false);
    
    // Save prediction history and service usage to Firestore
    if (res) {
      await savePredictionHistory('Exam Cell', selectedDay, selectedTime, res, `Service: ${service}`);
      await saveServiceUsage('Exam Cell', selectedDay, selectedTime, res.crowdLevel, res.estimatedWaitMinutes);
    }
  };

  const services = ['Marks Card Collection', 'Provisional Certificate', 'Revaluation Request', 'Exam Hall Ticket', 'Degree Verification'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Service & Schedule</h2>
          <div className="space-y-4">
             <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Service</label>
                <select value={service} onChange={(e) => setService(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-medium">
                   {services.map(s => <option key={s}>{s}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Date</label>
                <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <option key={d}>{d}</option>)}
                </select>
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Time</label>
                <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                  {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map(t => <option key={t}>{t}</option>)}
                </select>
             </div>
          </div>
        </div>

        <PredictionIndicator prediction={prediction} loading={loadingPrediction} />
      </div>

      <div className="lg:col-span-2 space-y-6">
        {booked && (
          <div className="bg-cyan-100 border border-cyan-200 text-cyan-800 px-6 py-4 rounded-2xl shadow-sm font-bold animate-in fade-in slide-in-from-top-4 duration-300">
            ✅ Exam cell slot booked for {service} on {selectedDay} at {selectedTime}.
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Request Status Tracking</h2>
          <div className="space-y-6 relative before:content-[''] before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
             {[
               { title: 'Degree Verification', status: 'In Review', date: 'Requested 2 days ago', active: true },
               { title: 'PDC Certificate', status: 'Completed', date: 'Issued on Jan 12', active: false }
             ].map((req, i) => (
               <div key={i} className="pl-10 relative">
                  <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${req.active ? 'bg-cyan-500' : 'bg-gray-300'}`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center transition-all hover:shadow-md">
                    <div>
                      <h4 className="font-bold text-gray-800">{req.title}</h4>
                      <p className="text-xs text-gray-400">{req.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${req.active ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-200 text-gray-600'}`}>
                      {req.status}
                    </span>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 p-10 rounded-3xl shadow-xl text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-2">Book Priority Slot</h3>
            <p className="opacity-80 mb-8 max-w-sm">Current prediction for {selectedTime}: {prediction?.crowdLevel} Crowd. Book now to bypass the queue.</p>
            <button 
              onClick={() => { setBooked(true); setTimeout(() => setBooked(false), 5000); }}
              className="bg-white text-cyan-700 px-10 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              CONFIRM PRIORITY BOOKING
            </button>
          </div>
          <svg className="absolute -right-10 -bottom-10 w-72 h-72 text-white/10 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
        </div>
      </div>
    </div>
  );
};

export default ExamModule;
