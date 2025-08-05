# SocialDraft AI

## Overview

SocialDraft AI is a React-based web application that helps influencers and brands draft social media posts using AI. The platform supports LinkedIn and Twitter/X content creation with personalized tone matching and is designed for draft creation only (not auto-posting). The application features a modern, responsive interface built with React, TypeScript, and Tailwind CSS, following a full-stack architecture with Express.js backend and PostgreSQL database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with JavaScript (MERN stack) for modern development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system and dark mode support
- **UI Components**: Shadcn/ui component library with Radix UI primitives for accessibility
- **State Management**: React Context API for global state (AppContext, ThemeContext)
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: JavaScript with ES modules (MERN stack)
- **Development**: Native Node.js execution in development
- **Production Build**: esbuild for fast, optimized server bundling
- **Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage)

### Data Storage Solutions
- **Database**: PostgreSQL configured via Drizzle ORM
- **Connection**: Neon Database serverless driver for cloud PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema definition
- **Current State**: Basic user schema with username/password fields
- **Temporary Storage**: In-memory storage for development with interface for future database integration

### Authentication and Authorization
- **Current Implementation**: Basic user storage structure in place
- **Session Management**: connect-pg-simple for PostgreSQL session store
- **Security**: Password field included in user schema for future authentication implementation

### External Dependencies
- **Database**: Neon Database (PostgreSQL serverless)
- **AI Services**: Prepared for AI integration (structure in place for chat interface)
- **Development Tools**: Replit integration with vite plugins for development experience
- **UI Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation and formatting

### Key Design Patterns
- **Component Organization**: Modular component structure with separation of UI components and page components
- **JavaScript MERN Stack**: Modern JavaScript development with React, Express, MongoDB-compatible patterns, and Node.js
- **Responsive Design**: Mobile-first approach with Tailwind CSS responsive utilities
- **Theme Support**: Dynamic dark/light mode with CSS custom properties
- **Form Handling**: React Hook Form with validation schemas
- **Error Handling**: Centralized error handling with toast notifications

### Recent Changes (January 2025)
- **Migration to JavaScript**: Successfully migrated entire codebase from TypeScript to JavaScript
- **MERN Stack Implementation**: Now using pure JavaScript with React frontend and Node.js/Express backend
- **Configuration Updates**: Updated Vite, Tailwind, and Drizzle configurations for JavaScript
- **Component Conversion**: All React components, hooks, contexts, and pages converted to JSX
- **Server Architecture**: Express server now running in pure Node.js without TypeScript compilation

### Application Features
- **Landing Page**: Marketing site with hero section, features, and testimonials
- **Onboarding Flow**: Multi-step form for user setup with progress tracking
- **Dashboard**: Overview with statistics, recent drafts, and quick actions
- **Content Creation**: Chat-style interface for AI-powered post generation
- **Draft Management**: Review, edit, and organize generated content
- **Template Library**: Categorized templates for different content types
- **Scheduling Interface**: Platform-specific scheduling with frequency options
- **Profile Management**: User settings and preferences configuration