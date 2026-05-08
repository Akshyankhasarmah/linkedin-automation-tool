LinkedIn Automation Tool

Overview

LinkedIn Automation Tool is an AI-powered full-stack web application designed to automate LinkedIn feed monitoring, job intelligence extraction, and professional content analysis. The system uses automation workflows, AI-based NLP analysis, and dashboard analytics to help users identify relevant career opportunities and filter low-quality content.
The project combines frontend, backend, database, automation, and AI technologies into a single intelligent career assistance platform.

Features

-	Automated LinkedIn feed monitoring
-	AI-based content classification
-	Toxicity and spam detection
-	Intelligent job matching
-	Human-like automated scrolling
-	Real-time analytics dashboard
-	Report and log generation
-	User authentication and session management
-	Automation scheduling
-	Cloud synchronization

  
Technologies Used

Technology | Purpose

React.js -Frontend UI 
Vite -Frontend build tool 
Tailwind CSS -Styling and responsive design 
TypeScript -Safer frontend development 
Node.js -Backend runtime 
Express.js -REST API development 
SQLite -Database storage 
Firebase -Authentication and cloud sync 
Gemini AI Pro -AI-based content analysis 
Go Language -Automation microservice 
Node-cron -Task scheduling 
REST APIs -Frontend-backend communication 
Vercel -Deployment 

Project Architecture

User
   ↓
React Frontend
   ↓
Node.js + Express Backend
   ↓
Firebase Authentication
   ↓
Automation Engine
   ↓
Go Microservice
   ↓
Gemini AI Analysis
   ↓
SQLite Database
   ↓
Dashboard Visualization


Modules
1.	User Authentication
●	Secure login using Firebase Authentication
●	Session management and access control
2.	Automation Engine
●	Automated LinkedIn monitoring
●	Human-like scrolling and extraction
●	Scheduled automation using Node-cron
3.	Feed Extraction
●	Extracts LinkedIn posts and job-related data
●	Processes professional content automatically
4.	AI Content Analysis
●	Gemini AI performs NLP-based analysis
●	Categorizes content and generates insights
5.	Toxicity Detection
●	Detects spam and low-quality content
●	Improves professional feed quality
6.	Job Matching
●	Matches jobs based on user interests
●	AI-generated relevance scoring
7.	Dashboard Analytics
●	Displays reports, logs, and AI insights
 
Firebase Firestore API	Cloud synchronization

REST APIs	Frontend-backend communication

Node-cron	Automation scheduling SQLite API	Database operations

Conclusion
The LinkedIn Automation Tool is an AI-powered automation platform that combines LinkedIn feed extraction, intelligent content analysis, job matching, and dashboard analytics into a single system. The project demonstrates the integration of full-stack development, automation workflows, cloud services, and AI technologies for professional career assistance

<img width="1144" height="808" alt="image" src="https://github.com/user-attachments/assets/97549fac-1ae3-4600-a1d1-96cf3a40eb56" />

<img width="744" height="885" alt="image" src="https://github.com/user-attachments/assets/392ebab2-bed2-4b6f-8aaa-3f34a8d316d4" />


<img width="1144" height="333" alt="image" src="https://github.com/user-attachments/assets/e1b298e7-7776-4bbc-b62f-34dc2e02398a" />

<img width="1144" height="675" alt="image" src="https://github.com/user-attachments/assets/ffe2b255-6399-4ced-ba2a-53bf999881ed" />


<img width="1144" height="655" alt="image" src="https://github.com/user-attachments/assets/074c3947-acc0-4058-bc21-84cba283a9bf" />


<img width="1144" height="438" alt="image" src="https://github.com/user-attachments/assets/08d1f9d4-c6d1-49f9-baec-2b86ff89a87c" />


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
