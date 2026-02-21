# Driver Feedback & Sentiment Dashboard - Specification

## Project Overview
- **Project Name**: Driver Feedback & Sentiment Dashboard
- **Type**: React Web Application (SPA)
- **Core Functionality**: A configurable post-trip feedback form for employees and a real-time admin analytics dashboard for driver sentiment tracking
- **Target Users**: Employees (feedback submitters), Operations teams & Administrators (dashboard viewers)

---

## UI/UX Specification

### Layout Structure

#### Feedback Form Page (`/feedback`)
- **Header**: Company logo, title "Post-Trip Feedback"
- **Main Content**: Multi-section feedback form
- **Footer**: Privacy note, submit button

#### Admin Dashboard Page (`/dashboard`)
- **Sidebar**: Navigation (Overview, Driver Leaderboard, Alerts)
- **Header**: Page title, date range toggle, bell icon for alerts
- **Main Content**: 
  - Overview Panel (metrics cards, charts)
  - Driver Leaderboard (sortable table)
  - Feedback Timeline (infinite scroll feed)
- **Driver Detail Modal/Page**: Trend charts, feedback breakdown

### Responsive Breakpoints
- **Mobile**: < 640px (single column, stacked layout)
- **Tablet**: 640px - 1024px (2-column where applicable)
- **Desktop**: > 1024px (full dashboard with sidebar)

### Visual Design

#### Color Palette
- **Primary**: `#2563EB` (Blue - trust, professionalism)
- **Primary Dark**: `#1D4ED8`
- **Secondary**: `#0F172A` (Dark slate - headers, text)
- **Accent Success**: `#10B981` (Green - positive sentiment, ≥4.0)
- **Accent Warning**: `#F59E0B` (Amber - neutral sentiment, 2.5-3.9)
- **Accent Danger**: `#EF4444` (Red - negative sentiment, <2.5)
- **Background**: `#F8FAFC` (Light gray)
- **Surface**: `#FFFFFF` (White cards)
- **Text Primary**: `#1E293B`
- **Text Secondary**: `#64748B`
- **Border**: `#E2E8F0`

#### Typography
- **Font Family**: `"DM Sans", "Segoe UI", sans-serif`
- **Headings**: 
  - H1: 32px, weight 700
  - H2: 24px, weight 600
  - H3: 18px, weight 600
- **Body**: 16px, weight 400
- **Small**: 14px, weight 400
- **Caption**: 12px, weight 500

#### Spacing System
- Base unit: 4px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

#### Visual Effects
- **Card shadows**: `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)`
- **Hover shadows**: `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)`
- **Border radius**: 8px (cards), 6px (buttons), 4px (inputs)
- **Transitions**: 150ms ease-in-out

### Components

#### 1. FeedbackForm (Container)
- Manages form state and submission
- Reads feature flag configuration
- Renders enabled feedback sections

#### 2. FeedbackSection (Presentational)
- Props: entityType, title, tags[], onUpdate
- Renders section header, star rating, tag chips, text area

#### 3. StarRating (Presentational)
- Props: value, onChange, disabled, label
- 5 stars with hover states (filled/empty)
- Keyboard accessible (arrow keys)
- ARIA labels for screen readers

#### 4. TagChip (Presentational)
- Props: label, selected, onClick
- Toggleable quick feedback chips
- Color change on selection

#### 5. TextArea (Presentational)
- Props: value, onChange, maxLength, label, error
- Character counter, inline validation

#### 6. ProgressIndicator (Presentational)
- Props: currentStep, totalSteps
- Visual step progress for multi-section forms

#### 7. MetricCard (Presentational)
- Props: title, value, trend, icon
- Display key metrics with optional trend

#### 8. SentimentDonut (Presentational)
- Props: positive, neutral, negative
- Animated donut chart for sentiment distribution

#### 9. DriverTable (Presentational)
- Props: drivers[], onRowClick, sortConfig
- Sortable columns, color-coded rows
- Expandable rows for recent feedback

#### 10. FeedbackTimeline (Presentational)
- Props: feedback[], loading, onLoadMore
- Infinite scroll feed with filters

#### 11. TrendChart (Presentational)
- Props: data[], xKey, yKey, color
- Line chart for sentiment trends

#### 12. AlertBanner (Presentational)
- Props: driverName, score, onDismiss
- In-app notification for threshold breaches

#### 13. AlertList (Presentational)
- Props: alerts[], onAlertClick
- Dropdown list of unread alerts with badges

---

## Functionality Specification

### Feature Flag Configuration
```
typescript
interface FeatureFlags {
  driverFeedback: boolean;
  tripFeedback: boolean;
  appFeedback: boolean;
  marshalFeedback: boolean;
}
```
- Loaded from mock API/config
- Dynamic rendering without page reload
- Empty state when all flags false

### Feedback Form Interactions
1. User sees only enabled feedback sections
2. Star rating: hover preview, click to select, keyboard accessible
3. Tag chips: click to toggle multiple selection
4. Text area: inline validation on blur, character count
5. Progress indicator shows current section if multi-step
6. Submit: disable button, show loading, display success toast
7. Prevent duplicate submissions

### Dashboard Features
1. **Overview Panel**:
   - Total feedback count (today/7d/30d toggle)
   - Sentiment distribution donut chart
   - Average sentiment score
   - Drivers below threshold count

2. **Driver Leaderboard**:
   - Sortable by name, score, trips
   - Filter by score range
   - Search by driver name/ID
   - Color-coded rows (green/amber/red)
   - Expandable to show 5 recent feedbacks
   - Click row to open detail view

3. **Feedback Timeline**:
   - Chronological feed
   - Infinite scroll pagination
   - Filters: entity type, sentiment, date range, driver

4. **Driver Detail**:
   - 30-day sentiment trend line chart
   - Tag breakdown bar chart
   - Full feedback history table
   - Alert badge if below threshold

5. **Alert System**:
   - In-app banner when driver drops below threshold
   - Bell icon with unread count
   - Click to navigate to driver detail

### State Management
- **Local State**: Form inputs, UI toggles, modal visibility
- **Global State**: 
  - Feature flags (Context)
  - Driver data (Context + useReducer)
  - Alerts (Context)
  - Dashboard filters (Context)

### Mock Data
- Generate realistic mock data for:
  - 20 drivers with varied sentiment scores
  - 100+ feedback entries
  - Various entity types and tags

---

## Acceptance Criteria

### Feedback Form
- [ ] Only renders enabled feedback sections based on feature flags
- [ ] Star rating is keyboard accessible (Tab, Arrow keys)
- [ ] Inline validation shows errors on blur
- [ ] Character count updates in real-time
- [ ] Submit button shows loading state and prevents duplicate submission
- [ ] Success toast appears after submission
- [ ] Empty state shows when all flags are false
- [ ] Mobile-responsive with touch-friendly targets (min 44px)

### Dashboard
- [ ] Overview shows correct metrics with date range toggle
- [ ] Donut chart displays sentiment distribution
- [ ] Driver table is sortable and filterable
- [ ] Rows are color-coded correctly
- [ ] Clicking driver opens detail view
- [ ] Trend chart shows 30-day history
- [ ] Feedback timeline supports infinite scroll
- [ ] Alerts appear when driver score drops below 2.5
- [ ] Bell icon shows unread count
- [ ] Responsive layout works on all breakpoints

### Accessibility
- [ ] All interactive elements have ARIA labels
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Focus indicators visible
- [ ] Screen reader compatible

### Performance
- [ ] Lazy loading for chart components
- [ ] Memoization prevents unnecessary re-renders
- [ ] Virtualized list for large feedback datasets
- [ ] Initial load under 3 seconds

---

## Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **State Management**: Context API + useReducer
- **Routing**: React Router v6
- **Charts**: Recharts
- **Styling**: CSS Modules + CSS Variables
- **Icons**: Lucide React
- **Testing**: React Testing Library + Jest (optional)
