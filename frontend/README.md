# SWA-YATRA - Smart Heritage Tour Guide

An AI-powered Indian heritage tour guide and smart travel assistant application. SWA-YATRA provides intelligent recommendations, monument information, and travel assistance for exploring India's rich cultural heritage.

## Features

- **Monument Identification**: Get detailed historical information about heritage sites
- **Multi-language Support**: English, Hindi, and French
- **Smart Recommendations**: Time and crowd-based suggestions for nearby attractions
- **Local Insights**: Verified food recommendations, guides, and transport options
- **Digital City Pass**: QR-based single pass for multiple attractions
- **Safety Advisories**: Best visiting times and safety tips

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Asking Questions

You can ask SWA-YATRA about:
- **Monuments**: "Tell me about Hawa Mahal", "What is Amber Fort?"
- **Nearby Places**: "What's near me?", "Suggest nearby attractions"
- **Food**: "Where to eat?", "Best local food"
- **Guides**: "Find a guide", "Verified tour guides"
- **Transport**: "How to reach?", "Transport options"
- **City Pass**: "Show city pass", "QR code"

### Language Support

Switch between English, Hindi, and French using the language selector in the chat interface.

### Digital City Pass

Click the "City Pass" button in the header to generate a QR code that provides access to multiple attractions in Jaipur.

## Default Location

The application assumes the user is in **Jaipur, Rajasthan** unless another city is specified.

## Technology Stack

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **qrcode.react**: QR code generation

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── ChatInterface.tsx   # Main chat component
│   ├── ResponseDisplay.tsx # Response rendering
│   ├── CityPass.tsx        # City pass QR code
│   ├── Header.tsx          # App header
│   └── LanguageSelector.tsx # Language switcher
├── data/
│   ├── monuments.ts        # Monument data
│   └── recommendations.ts  # Food, guides, transport data
└── utils/
    ├── translations.ts     # Translation system
    └── responseGenerator.ts # Response logic
```

## Building for Production

```bash
npm run build
npm start
```

## License

This project is created for demonstration purposes.

