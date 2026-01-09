
import React, { useState, useEffect } from 'react';
import { getCampusPrediction } from '../geminiService';
import { PredictionResult, LibrarySeat } from '../types';
import PredictionIndicator from './PredictionIndicator';
import { savePredictionHistory, saveServiceUsage } from '../firestoreService';

const LibraryModule: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedTime, setSelectedTime] = useState('02:00 PM');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoadingPrediction(true);
      const res = await getCampusPrediction('Library', selectedDay, selectedTime, "During exam preparation week");
      setPrediction(res);
      setLoadingPrediction(false);
      
      // Save prediction history and service usage to Firestore
      if (res) {
        await savePredictionHistory('Library', selectedDay, selectedTime, res, "During exam preparation week");
        await saveServiceUsage('Library', selectedDay, selectedTime, res.crowdLevel, res.estimatedWaitMinutes);
      }
    };
    fetchPrediction();
  }, [selectedDay, selectedTime]);

  const sections = ['Quiet Zone', 'Discussion Hub', 'Computer Lab'];
  const seats: LibrarySeat[] = Array.from({ length: 48 }, (_, i) => ({
    id: `${i + 1}`,
    section: sections[Math.floor(i / 16)],
    floor: Math.floor(i / 24) + 1,
    isOccupied: Math.random() > 0.6
  }));

  const handleBooking = () => {
    setIsBooked(true);
    setTimeout(() => setIsBooked(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Library Slot Selection</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Time Slot</label>
              <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                {['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        <PredictionIndicator prediction={prediction} loading={loadingPrediction} />
      </div>

      <div className="lg:col-span-2 space-y-6">
        {isBooked && (
          <div className="bg-teal-100 border border-teal-200 text-teal-800 px-6 py-4 rounded-2xl shadow-md font-bold text-center animate-in slide-in-from-top duration-300">
            ✅ Your library slot has been successfully booked.
          </div>
        )}
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-gray-800">Available Seats - Floor {selectedSeat ? Math.ceil(parseInt(selectedSeat)/24) : 1}</h2>
             <div className="flex space-x-4 text-[10px] font-bold uppercase tracking-wider">
                <div className="flex items-center text-teal-600"><span className="w-3 h-3 bg-teal-500 rounded mr-1"></span> Free</div>
                <div className="flex items-center text-gray-400"><span className="w-3 h-3 bg-gray-200 rounded mr-1"></span> Taken</div>
             </div>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
            {seats.map(seat => (
              <button
                key={seat.id}
                disabled={seat.isOccupied}
                onClick={() => setSelectedSeat(seat.id)}
                className={`h-12 rounded-xl flex items-center justify-center font-bold transition-all text-xs ${
                  seat.isOccupied 
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                  : selectedSeat === seat.id 
                    ? 'bg-white border-2 border-teal-500 text-teal-600 shadow-lg scale-110' 
                    : 'bg-teal-500 text-white hover:bg-teal-600 hover:shadow-md'
                }`}
              >
                {seat.id}
              </button>
            ))}
          </div>

          <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm font-bold text-gray-700">Selected: {selectedSeat ? `Seat ${selectedSeat}` : 'Pick a seat'}</p>
              <p className="text-xs text-gray-400">Slots are valid for a maximum of 4 hours.</p>
            </div>
            <button 
              onClick={handleBooking}
              disabled={!selectedSeat || isBooked}
              className="bg-teal-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg disabled:opacity-50 hover:bg-teal-700 transition-all active:scale-95"
            >
              CONFIRM SLOT BOOKING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryModule;
