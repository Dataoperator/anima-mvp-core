# ANIMA MVP Core

Simplified MVP implementation of ANIMA: Living NFTs on the Internet Computer

## Core Flow

1. 🏠 Landing
   - User arrives
   - Sees intro content
   - Connects wallet

2. 🏛️ Quantum Vault
   - Views collection
   - Button to mint anima

3. ✨ Genesis
   - Starts minting process
   - Makes ICP payment
   - Gets tokenId

4. 👁️ ANIMA Display
   - Views individual ANIMA
   - Sees basic stats
   - Access to neural link

5. 🧠 Neural Link
   - Simple interaction interface
   - Basic chat functionality

## Project Structure

```
src/
├── components/         # React components
│   ├── genesis/       # Minting interface
│   ├── simple-vault/  # Collection view
│   ├── simple-anima/  # ANIMA display
│   └── simple-neural/ # Neural link interface
├── contexts/          # React contexts
├── utils/             # Utility functions
└── lib.rs            # Rust backend
```

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features

- Wallet Integration
- ICP Payment Handling
- Basic ANIMA Minting
- Simple Stats Display
- Basic Neural Link Chat

## Backend Features

- ANIMA State Management
- Payment Processing
- Basic Interaction System
