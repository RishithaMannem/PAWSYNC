# PAWSYNC

**Every Paw. Every Need. One Place.**

A polished, modern, responsive pet-care web application built with React, TypeScript, and Vite.

## Features

### Core Features
- **Dashboard** - Personalized overview of pet care activities
- **My Pets** - Create, view, edit, and manage multiple pet profiles
- **Health & Vaccinations** - Track vaccinations, appointments, and health records
- **Daily Care** - Log meals, water intake, and exercise with daily checklist
- **AI Pet Assistant** - Demo AI assistant with pet-context aware responses
- **Services** - Browse and book pet care services (demo)
- **Shop** - Product catalog with cart and demo checkout
- **Adoption** - Browse adoptable pets and submit interest forms
- **Pet-Friendly Places** - Discover pet-friendly locations
- **Lost & Found** - Report lost or found pets
- **Community & Guides** - Educational pet care articles
- **Expenses** - Track and analyze pet expenses with charts
- **Settings** - Data management and app preferences

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router DOM
- Lucide React (icons)
- Recharts (for expense charts)
- UUID
- date-fns

## Installation

1. Install dependencies:
`ash
npm install
`

2. Start the development server:
`ash
npm run dev
`

3. Open your browser and navigate to http://localhost:5173

## Build

`ash
npm run build
`

## Preview Production Build

`ash
npm run preview
`

## Demo Features

Many features are in demo mode and don't connect to real services:
- AI Assistant uses pre-programmed responses
- Service bookings are simulated
- Shop checkout is a demo (no real payment)
- Adoption listings are sample data
- Pet-friendly places are sample listings
- Lost & Found reports are stored locally only

## Data Storage

This app uses browser localStorage for data persistence. All data stays on your device.

## Usage

1. Go to Settings and load Sample Data to get started quickly
2. Add your pets in My Pets
3. Start tracking care activities in Daily Care
4. Explore all features from the sidebar

## Notes

- This is a single-user local demo application
- Not intended for production use with sensitive data
- Health advice is general information, not veterinary diagnosis
- Always consult a licensed veterinarian for medical decisions
