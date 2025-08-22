import { Component } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard-component',
  standalone: false,
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss'
})
export class DashboardComponent {
  // Pie chart type
  pieChartType: ChartType = 'pie';

  // Pie chart labels and data
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Electronics', 'Groceries', 'Clothing', 'Books', 'Other'],
    datasets: [
      {
        data: [300, 500, 100, 120, 80],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderWidth: 1,
      }
    ]
  };

  // Pie chart options
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            return `${context.label}: ${value}`;
          }
        }
      }
    }
  };
}
