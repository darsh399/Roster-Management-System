# Provider Calendar Application

A responsive calendar application for healthcare providers with dark/light mode support.

## Features Implemented

- **Provider Management**: View all available providers with their schedules
- **Slot Display**: Time slots shown in a compact 4-column grid format
- **Filtering**: Filter providers by service type, center, and in-house/external status
- **Dark/Light Mode**: Toggle between light and dark color schemes
- **Responsive Design**: Works on desktop and mobile devices
- **Calendar View**: Detailed view of provider availability

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation
1. Clone the repository:
   git clone https://github.com/darsh399/Roster-Management-System.git

2. Install dependencies:
   npm install

3. Start the development server:
   npm start
   

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts
- `start`: Runs the app

## Important Note About Provisional Data

The application uses sample data from `src/provisionalData.json`. To see available slots in the UI:

1. Open `src/provisionalData.json` in your code editor
2. Find all date fields (they appear as `"date": "YYYY-MM-DD"`)
3. Change these dates to today's date (or future dates) in the same format
4. Save the file
5. Refresh the application in your browser

Example change:
```json
"date": "2023-11-15"