
import React, { useState, useEffect } from 'react';
import { getCampusPrediction, getDemandForecast } from '../geminiService';
// Fix: Removed GroupOrderMember which is not defined in types.ts and not used in this component.
import { PredictionResult, MenuItem, LeaderboardEntry } from '../types';
import PredictionIndicator from './PredictionIndicator';
import { savePredictionHistory, saveServiceUsage } from '../firestoreService';

const MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'South Indian Thali', price: 60, category: 'Main', demandFactor: 8, imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=300&q=80' },
  { id: '2', name: 'Hyderabadi Biryani', price: 120, category: 'Main', demandFactor: 9, imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=300&q=80' },
  { id: '3', name: 'Butter Masala Dosa', price: 45, category: 'Breakfast', demandFactor: 7, imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&q=80' },
  { id: '4', name: 'Filtered Coffee', price: 20, category: 'Beverage', demandFactor: 6, imageUrl: 'https://images.unsplash.com/photo-1544787210-2211d24731b4?auto=format&fit=crop&w=300&q=80' },
  { id: '5', name: 'Fresh Fruit Bowl', price: 45, category: 'Healthy', demandFactor: 5, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80' },
];

const LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', studentName: 'Aditi Sharma', branch: 'Computer Science', score: 98 },
  { id: '2', studentName: 'Karthik Raja', branch: 'Electronics', score: 95 },
  { id: '3', studentName: 'Rahul Verma', branch: 'Mechanical', score: 92 },
  { id: '4', studentName: 'Sanya Mirza', branch: 'Information Science', score: 89 },
];

const CanteenModule: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedTime, setSelectedTime] = useState('12:30 PM');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [isGroupOrder, setIsGroupOrder] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [forecastedItems, setForecastedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchPrediction();
    loadForecast();
  }, [selectedDay, selectedTime]);

  const fetchPrediction = async () => {
    setLoadingPrediction(true);
    const res = await getCampusPrediction('Canteen', selectedDay, selectedTime);
    setPrediction(res);
    setLoadingPrediction(false);
    
    // Save prediction history and service usage to Firestore
    if (res) {
      await savePredictionHistory('Canteen', selectedDay, selectedTime, res);
      await saveServiceUsage('Canteen', selectedDay, selectedTime, res.crowdLevel, res.estimatedWaitMinutes);
    }
  };

  const loadForecast = async () => {
    const items = await getDemandForecast(selectedDay);
    setForecastedItems(items);
  };

  const addToCart = (item: MenuItem) => {
    setCart([...cart, item]);
  };

  const confirmOrder = () => {
    setOrderConfirmed(true);
    setTimeout(() => {
      setOrderConfirmed(false);
      setCart([]);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Token Prediction
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Day</label>
              <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pick Time Slot</label>
              <select value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none">
                {['08:00 AM', '09:00 AM', '10:30 AM', '11:30 AM', '12:30 PM', '01:30 PM', '02:30 PM', '03:30 PM', '04:30 PM', '05:30 PM'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        <PredictionIndicator prediction={prediction} loading={loadingPrediction} />

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Clean Plate Leaderboard</h3>
          <div className="space-y-3">
            {LEADERBOARD.map((item, i) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-transparent hover:border-teal-100 transition-all">
                <div className="flex items-center space-x-3">
                  <span className={`text-xs font-bold w-4 ${i < 3 ? 'text-teal-600' : 'text-gray-400'}`}>{i + 1}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.studentName}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-medium">{item.branch}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-teal-600">{item.score} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex space-x-2">
            {['Standard', 'Group Mode'].map(mode => (
              <button key={mode} onClick={() => setIsGroupOrder(mode === 'Group Mode')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${((mode === 'Group Mode') === isGroupOrder) ? 'bg-teal-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>{mode}</button>
            ))}
          </div>
          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">Live: 14 In Queue</div>
        </div>

        {orderConfirmed && (
          <div className="bg-green-100 border border-green-200 text-green-800 px-6 py-4 rounded-2xl flex items-center shadow-lg animate-bounce">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            <span className="font-bold">✅ Order Placed! Your token #CAN-882 is generated.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex justify-between items-center">
              Available Menu
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Fresh Today</span>
            </h3>
            {MENU_ITEMS.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:border-teal-300 transition-all group overflow-hidden">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                    <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 leading-tight mb-1">{item.name}</h4>
                    <p className="text-sm text-teal-600 font-extrabold">₹{item.price}</p>
                    <span className="text-[9px] bg-gray-100 px-2 py-0.5 rounded uppercase font-bold text-gray-400">{item.category}</span>
                  </div>
                </div>
                <button onClick={() => addToCart(item)} className="bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white p-3 rounded-xl transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[400px]">
             <h3 className="text-lg font-bold text-gray-800 mb-6 flex justify-between">
               {isGroupOrder ? 'Group Order Session' : 'Your Order Token'}
               <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">{cart.length} items</span>
             </h3>
             <div className="flex-grow space-y-3 overflow-y-auto mb-6">
               {cart.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-4">
                    <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    <p className="text-sm font-bold">Tray Empty. Select food items to generate a token.</p>
                 </div>
               ) : (
                 cart.map((item, idx) => (
                   <div key={idx} className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl border border-gray-100">
                     <span className="font-bold text-gray-700">{item.name}</span>
                     <div className="flex items-center space-x-3">
                       <span className="font-bold text-teal-600">₹{item.price}</span>
                       <button onClick={() => setCart(cart.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                     </div>
                   </div>
                 ))
               )}
             </div>
             <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Estimated Wait</span>
                  <span className="text-lg font-bold text-teal-600">{prediction?.estimatedWaitMinutes || '--'} min</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-bold">Total Amount</span>
                  <span className="text-2xl font-black text-gray-800">₹{cart.reduce((s, i) => s + i.price, 0)}</span>
                </div>
                <button onClick={confirmOrder} disabled={cart.length === 0} className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-teal-700 active:scale-[0.98] transition-all disabled:opacity-50">
                  GENERATE ORDER TOKEN
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanteenModule;
