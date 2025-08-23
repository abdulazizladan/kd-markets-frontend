import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { BillingFormComponent } from '../billing-form-component/billing-form-component';

@Component({
  selector: 'app-payments-summary-component',
  standalone: false,
  templateUrl: './payments-summary-component.html',
  styleUrl: './payments-summary-component.scss'
})
export class PaymentsSummaryComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  // Dashboard metrics
  totalRevenue = 0;
  outstandingBills = 0;
  totalInvoices = 0;
  paidInvoices = 0;
  pendingInvoices = 0;
  monthlyGrowth = 0;
  
  // Chart data
  revenueChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [65000, 72000, 68000, 75000, 82000, 89000],
        label: 'Monthly Revenue',
        fill: true,
        tension: 0.4,
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        pointBackgroundColor: '#2196F3',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#2196F3'
      }
    ]
  };

  invoiceStatusChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['#4CAF50', '#FF9800', '#F44336'],
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#fff'
      }
    ]
  };

  // Chart options
  revenueChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  invoiceStatusChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Recent transactions
  recentTransactions = [
    { id: 'INV-001', customer: 'Market Stall A1', amount: 2500, status: 'Paid', date: '2024-01-15' },
    { id: 'INV-002', customer: 'Market Stall B3', amount: 1800, status: 'Pending', date: '2024-01-14' },
    { id: 'INV-003', customer: 'Market Stall C2', amount: 3200, status: 'Paid', date: '2024-01-13' },
    { id: 'INV-004', customer: 'Market Stall D4', amount: 1500, status: 'Overdue', date: '2024-01-10' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  loadDashboardData(): void {
    // Mock data - in real app, this would come from a service
    this.totalRevenue = 451000;
    this.outstandingBills = 12500;
    this.totalInvoices = 156;
    this.paidInvoices = 102;
    this.pendingInvoices = 45;
    this.monthlyGrowth = 12.5;
  }

  navigateToInvoices(): void {
    this.router.navigate(['/payments/invoices']);
  }

  navigateToCreateInvoice(): void {
    this.router.navigate(['/payments/create-invoice']);
  }

  navigateToPaymentHistory(): void {
    this.router.navigate(['/payments/history']);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'paid': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'overdue': return '#F44336';
      default: return '#757575';
    }
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  openBillingFormDialog() {
    this.dialog.open(BillingFormComponent, {
      width: '480px'
    })
  }
}
