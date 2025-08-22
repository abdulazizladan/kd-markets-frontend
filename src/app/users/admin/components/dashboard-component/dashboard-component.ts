import { Component } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard-component',
  standalone: false,
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss'
})
export class DashboardComponent {
  // Chart types
  barChartType: ChartType = 'bar';
  lineChartType: ChartType = 'line';
  pieChartType: ChartType = 'pie';
  doughnutChartType: ChartType = 'doughnut';
  stackedBarChartType: ChartType = 'bar';

  // KPI Data
  kpiData = {
    totalMarkets: 24,
    totalStalls: 1247,
    totalRevenue: '₦45.2M',
    occupancyRate: '87%'
  };

  // Rent Payment Status
  rentPaymentStatus = {
    collected: 78,
    outstanding: 22,
    totalExpected: 12500000 // 12.5M in kobo
  };

  // Markets by LGA - Bar Chart
  marketsByLGAData: ChartData<'bar'> = {
    labels: ['Birnin Gwari', 'Zaria', 'Chikun', 'Kaduna North', 'Kaduna South', 'Igabi'],
    datasets: [
      {
        data: [4, 6, 3, 5, 4, 2],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        label: 'Number of Markets'
      }
    ]
  };

  // Stall Occupancy Status - Doughnut Chart
  stallOccupancyData: ChartData<'doughnut'> = {
    labels: ['Occupied (Active)', 'Vacant', 'Under Maintenance'],
    datasets: [
      {
        data: [1085, 108, 54],
        backgroundColor: [
          'rgba(46, 125, 50, 0.8)',
          'rgba(198, 40, 40, 0.8)',
          'rgba(251, 140, 0, 0.8)'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  // Building Status by Market - Stacked Bar Chart
  buildingStatusData: ChartData<'bar'> = {
    labels: ['Central Market', 'New Market', 'Sabon Gari', 'Tudun Wada'],
    datasets: [
      {
        label: 'Occupied',
        data: [45, 38, 52, 29],
        backgroundColor: 'rgba(46, 125, 50, 0.8)',
        borderColor: 'rgba(46, 125, 50, 1)',
        borderWidth: 1
      },
      {
        label: 'Vacant',
        data: [8, 12, 5, 11],
        backgroundColor: 'rgba(198, 40, 40, 0.8)',
        borderColor: 'rgba(198, 40, 40, 1)',
        borderWidth: 1
      },
      {
        label: 'Under Maintenance',
        data: [3, 2, 1, 4],
        backgroundColor: 'rgba(251, 140, 0, 0.8)',
        borderColor: 'rgba(251, 140, 0, 1)',
        borderWidth: 1
      }
    ]
  };

  // Monthly Revenue Trend - Line Chart
  monthlyRevenueData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Actual Revenue',
        data: [3.2, 3.8, 4.1, 3.9, 4.5, 4.8, 4.2, 4.6, 4.9, 5.1, 4.7, 5.3],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      },
      {
        label: 'Forecast',
        data: [null, null, null, null, null, null, null, null, null, null, 4.7, 5.3],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.4
      }
    ]
  };

  // Revenue Breakdown by Market - Stacked Bar Chart
  revenueBreakdownData: ChartData<'bar'> = {
    labels: ['Central Market', 'New Market', 'Sabon Gari', 'Tudun Wada', 'Kawo Market'],
    datasets: [
      {
        label: 'Rent Payments',
        data: [2.8, 2.1, 2.9, 1.8, 2.3],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Utility Fees',
        data: [0.4, 0.3, 0.5, 0.2, 0.3],
        backgroundColor: 'rgba(255, 206, 86, 0.8)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      },
      {
        label: 'Service Charges',
        data: [0.2, 0.1, 0.3, 0.1, 0.2],
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  // Maintenance Request Categories - Bar Chart
  maintenanceCategoriesData: ChartData<'bar'> = {
    labels: ['Plumbing', 'Electrical', 'Structural', 'Waste Management', 'HVAC', 'Security'],
    datasets: [
      {
        data: [23, 18, 15, 12, 8, 6],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
        borderWidth: 1,
        label: 'Number of Requests'
      }
    ]
  };

  // Maintenance Completion Rate - Line Chart
  maintenanceCompletionData: ChartData<'line'> = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: [65, 72, 78, 85, 82, 88, 91, 89],
        borderColor: 'rgba(46, 125, 50, 1)',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(46, 125, 50, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  // Maintenance Costs by Market - Pie Chart
  maintenanceCostsData: ChartData<'pie'> = {
    labels: ['Central Market', 'New Market', 'Sabon Gari', 'Tudun Wada', 'Kawo Market'],
    datasets: [
      {
        data: [35, 25, 20, 12, 8],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  // Chart Options
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 12 }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `${value}` }
      }
    }
  };

  lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 12 }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}M`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `${value}M` }
      }
    }
  };

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12 }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed}%`
        }
      }
    }
  };

  doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12 }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            // Ensure all data points are numbers and not null/undefined
            const data = Array.isArray(context.dataset.data)
              ? context.dataset.data.filter((v): v is number => typeof v === 'number' && v !== null && v !== undefined)
              : [];
            const total = data.reduce((a, b) => a + b, 0);
            const value = typeof context.parsed === 'number' ? context.parsed : 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  stackedBarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 12 }
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`
        }
      }
    },
    scales: {
      x: { stacked: true },
      y: { 
        stacked: true,
        beginAtZero: true,
        ticks: { callback: (value) => `${value}` }
      }
    }
  };
}
