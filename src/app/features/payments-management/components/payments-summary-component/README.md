# Payment Summary Dashboard Component

This component provides a comprehensive dashboard for payment management with charts, metrics, and quick navigation.

## Features

### 📊 Key Metrics Cards
- **Total Revenue**: Displays total revenue with monthly growth percentage
- **Outstanding Bills**: Shows amount of unpaid bills requiring attention
- **Total Invoices**: Count of all invoices with paid count
- **Pending Invoices**: Number of invoices awaiting payment

### 📈 Charts
- **Revenue Trend Chart**: Line chart showing monthly revenue performance over 6 months
- **Invoice Status Chart**: Doughnut chart displaying distribution of invoice statuses (Paid, Pending, Overdue)

### 🚀 Quick Actions
- Create Invoice button
- View All Invoices button
- Payment History button

### 📋 Recent Transactions
- List of latest payment activities with status indicators
- Color-coded status chips (Green for Paid, Orange for Pending, Red for Overdue)

## Technical Details

### Dependencies
- `@angular/material` - Material Design components
- `ng2-charts` - Chart.js integration for Angular
- `chart.js` - Charting library

### Chart Configuration
- **Revenue Chart**: Line chart with area fill, smooth curves, and currency formatting
- **Status Chart**: Doughnut chart with custom colors and percentage tooltips

### Responsive Design
- Mobile-first approach with responsive grid layouts
- Charts automatically resize for different screen sizes
- Touch-friendly interface for mobile devices

### Dark Theme Support
- Automatically adapts to system dark mode preference
- Consistent color scheme across light and dark themes

## Usage

The component is automatically loaded when navigating to the payments management module root path (`/payments`).

## Data Sources

Currently uses mock data for demonstration. In production, integrate with:
- `PaymentsService.getPaymentDashboardData()`
- `PaymentsService.getInvoices()`
- `PaymentsService.getPaymentHistory()`

## Styling

Uses SCSS with:
- CSS Grid for responsive layouts
- Material Design elevation and shadows
- Smooth hover animations
- Consistent spacing and typography
