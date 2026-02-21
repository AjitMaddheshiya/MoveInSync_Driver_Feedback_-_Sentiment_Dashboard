# Driver Feedback & Sentiment Dashboard

A React + TypeScript application for collecting post-trip feedback and visualizing driver sentiment analytics.

## Features

### Feedback Form (`/feedback`)
- **Multi-Entity Feedback**: Configurable feedback sections for Driver, Trip, App, and Marshal
- **Feature Flags**: Toggle feedback sections without code changes
- **Star Rating**: 1-5 star rating with hover states and keyboard accessibility
- **Tag Chips**: Quick feedback selection with toggleable tags
- **Character Count**: Real-time character counter with validation
- **Inline Validation**: Shows errors on blur
- **Progress Indicator**: Visual step progress for multi-section forms
- **Submission Handling**: Loading states, duplicate prevention, success confirmation

### Admin Dashboard (`/dashboard`)
- **Overview Panel**: 
  - Total feedback count (Today/7 Days/30 Days toggle)
  - Sentiment distribution donut chart
  - Average sentiment score
  - Drivers below threshold count
- **Driver Leaderboard**:
  - Sortable columns (name, trips, score)
  - Filter by score range
  - Search by driver name/ID
  - Color-coded rows (green ≥4.0, amber 2.5-3.9, red <2.5)
  - Expandable rows showing recent 5 feedbacks
  - Click to view detailed driver analytics
- **Feedback Timeline**:
  - Chronological feed with infinite scroll
  - Filters: entity type, sentiment
- **Driver Detail Modal**:
  - 30-day sentiment trend line chart
  - Tag breakdown bar chart
  - Full feedback history
- **Alert System**:
  - In-app notification banners for drivers below threshold
  - Bell icon with unread count badge
  - Direct links to driver detail pages

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **State Management**: Context API + useReducer
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: CSS Modules + CSS Variables

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```
bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```
bash
npm run build
```

The production build will be in the `dist` folder.

## Project Structure

```
src/
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── DriverDetailModal.tsx
│   │   ├── DriverLeaderboard.tsx
│   │   ├── FeedbackTimeline.tsx
│   │   ├── MetricCard.tsx
│   │   └── SentimentDonut.tsx
│   ├── feedback/         # Feedback form components
│   │   ├── FeedbackForm.tsx
│   │   ├── FeedbackSection.tsx
│   │   ├── ProgressIndicator.tsx
│   │   ├── StarRating.tsx
│   │   ├── SuccessScreen.tsx
│   │   └── TagChip.tsx
│   ├── Header.tsx
│   ├── Layout.tsx
│   └── Sidebar.tsx
├── context/
│   └── AppContext.tsx     # Global state management
├── data/
│   └── mockData.ts        # Mock data and helpers
├── pages/
│   ├── DashboardPage.tsx
│   └── FeedbackPage.tsx
├── types/
│   └── index.ts           # TypeScript type definitions
├── App.tsx
├── index.css              # Global styles
└── main.tsx               # Entry point
```

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation for star ratings (Tab, Arrow keys)
- Focus indicators visible
- Color contrast meets WCAG 2.1 AA standards
- Screen reader compatible

## Component Architecture

The application follows atomic design principles:
- **Atoms**: StarRating, TagChip, Badge
- **Molecules**: FeedbackSection, MetricCard
- **Organisms**: FeedbackForm, DriverLeaderboard
- **Templates**: Layout, DashboardPage
- **Pages**: FeedbackPage, DashboardPage

State is managed at appropriate levels:
- **Local State**: Form inputs, UI toggles, modal visibility
- **Global State**: Feature flags, driver data, alerts, filters

## Design System

- **Primary Color**: #2563EB (Blue)
- **Success**: #10B981 (Green - ≥4.0)
- **Warning**: #F59E0B (Amber - 2.5-3.9)
- **Danger**: #EF4444 (Red - <2.5)
- **Font**: DM Sans

## License

MIT
