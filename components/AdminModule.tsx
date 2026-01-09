
import React, { useState, useEffect } from 'react';
import { getCampusPrediction } from '../geminiService';
import { PredictionResult } from '../types';
import PredictionIndicator from './PredictionIndicator';
import { savePredictionHistory, saveServiceUsage } from '../firestoreService';

const AdminModule: React.FC = () => {
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    if (serviceType) {
      fetchPrediction();
    }
  }, [serviceType, selectedDay, selectedTime]);

  const fetchPrediction = async () => {
    setLoadingPrediction(true);
    const res = await getCampusPrediction('Admin Office', selectedDay, selectedTime, `Service: ${serviceType}`);
    setPrediction(res);
    setLoadingPrediction(false);
    
    // Save prediction history and service usage to Firestore
    if (res && serviceType) {
      await savePredictionHistory('Admin Office', selectedDay, selectedTime, res, `Service: ${serviceType}`);
      await saveServiceUsage('Admin Office', selectedDay, selectedTime, res.crowdLevel, res.estimatedWaitMinutes);
    }
  };

  const services = ['Scholarship Help', 'ID Card Issues', 'Transport Desk', 'Fees & Accounts', 'Bus Pass Renewal'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Select Service & Slot</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
              <select value={serviceType || ''} onChange={(e) => setServiceType(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                <option value="" disabled>Choose service...</option>
                {services.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Day</label>
              <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
              <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                {['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '01:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {serviceType && <PredictionIndicator prediction={prediction} loading={loadingPrediction} />}
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[500px]">
          {!bookingConfirmed ? (
            <div className="max-w-md w-full">
              <div className="w-24 h-24 bg-teal-100 rounded-3xl flex items-center justify-center mb-6 mx-auto rotate-12 transition-transform hover:rotate-0">
                <svg className="w-12 h-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Slot-Based Appointment</h2>
              <p className="text-gray-500 mb-8">Select your service and preferred slot to see AI predicted crowd levels before booking.</p>
              
              <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-dashed border-gray-200 text-left">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Current Selection</p>
                <p className="font-bold text-gray-700">{serviceType || 'Service not selected'}</p>
                <p className="text-sm text-gray-500">{selectedDay} at {selectedTime}</p>
              </div>

              <button 
                onClick={() => setBookingConfirmed(true)}
                disabled={!serviceType || loadingPrediction}
                className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-teal-700 transition-all disabled:opacity-50"
              >
                CONFIRM APPOINTMENT
              </button>
            </div>
          ) : (
            <div className="max-w-sm w-full animate-in zoom-in duration-300">
               <div className="bg-teal-600 rounded-t-3xl p-8 text-white text-left shadow-lg">
                  <p className="text-xs font-bold opacity-70 uppercase tracking-widest mb-1">Appointment Confirmed</p>
                  <h3 className="text-2xl font-black leading-tight">You are booked for {serviceType}</h3>
               </div>
               <div className="bg-white border-x border-b border-gray-100 rounded-b-3xl p-8 space-y-6 shadow-sm">
                  <div className="flex justify-between items-center text-left">
                     <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Time</p>
                        <p className="font-black text-gray-800 text-xl">{selectedTime}</p>
                        <p className="text-xs text-gray-500">{selectedDay}</p>
                     </div>
                     <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                     </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                     <p className="text-xs text-gray-400 font-bold uppercase mb-1">Predicted Wait</p>
                     <p className="font-bold text-teal-600">~{prediction?.estimatedWaitMinutes || 10} Mins</p>
                  </div>
                  <button onClick={() => setBookingConfirmed(false)} className="text-gray-400 text-xs font-bold hover:text-red-500 transition-colors">Reschedule Appointment</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModule;
