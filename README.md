🏫 CMRIT Smart Campus Optimizer
📌 Problem Statement

At CMRIT, students face crowd congestion, long waiting times, and inefficient access to campus services due to the lack of real-time service visibility and demand awareness.

💡 Proposed Solution

A smart campus platform that provides real-time service visibility and demand insights to help students choose less crowded time slots and reduce waiting time.

🚀 Project Overview

CMRIT Smart Campus Optimizer is a web-based application designed to improve the efficiency of campus services such as:

Smart Canteen

Library Hub

Administration Office

Examination Cell

The system predicts crowd levels based on time and usage patterns and presents them in a simple, user-friendly dashboard.

✨ Key Features

Crowd level prediction based on day and time

Waiting time estimation

Smart canteen token system

Library slot booking awareness

Administration office appointment visibility

Examination cell request tracking

Real-time service status dashboard

Clean and responsive UI

Data-driven decision support

Scalable and AI-ready architecture

🗺️ Google Maps Integration - Campus location mapping and directions

📅 Google Calendar Integration - Add appointments directly to your calendar

🛠 Tech Stack

Frontend: React + TypeScript + Vite

Styling: CSS

Prediction Logic: Local data-driven inference

Google Services: Maps API, Calendar API

AI Integration: Google Gemini AI (optional)

Deployment: Netlify

Version Control: GitHub

▶️ How to Run Locally
git clone https://github.com/Karthisha25/cmritsmartcampusoptimizer.git
cd cmritsmartcampusoptimizer
npm install
npm run dev


The application will run on:

http://localhost:5173

🔑 Google Services Setup (Optional)

To enable Google Maps and Calendar features:

1. **Google Maps API Key:**
   - Get your API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "Maps JavaScript API" and "Maps Embed API"
   - Add to `index.html` (replace `YOUR_API_KEY`) or set `VITE_GOOGLE_MAPS_API_KEY` in `.env`

2. **Google Gemini AI (Optional):**
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Set `VITE_GEMINI_API_KEY` in `.env` file

3. **Create `.env` file:**
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key_here
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

Note: The application works without API keys using rule-based predictions and static maps.

🏗 Build for Production
npm run build


This generates a dist folder ready for deployment.

🌐 Live Demo

🔗 Live Application:
https://samrtcampusoptimizer.netlify.app

🔗 GitHub Repository:
https://github.com/Karthisha25/cmritsmartcampusoptimizer

🎯 Impact

Reduced waiting time for students

Better planning of campus visits

Improved service utilization

Enhanced campus experience at CMRIT

👥 Team Contributions

Frontend development and UI design

Prediction logic and data handling

Deployment and GitHub management

Documentation and presentation

📌 Future Scope

Integration with real AI models

Firebase database integration

Mobile application version

Personalized user dashboards

👤 Author

Karthisha
CMRIT Smart Campus Optimizer Project
