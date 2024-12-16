// Angular imports
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StatisticsService } from './dashboard.service';
import { CustomCurrencyPipe } from './custom-currency.pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ColorHelper } from '@swimlane/ngx-charts';


// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule, NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export default class DashboardComponent implements OnInit {

  sales: any[] = []; // Lưu dữ liệu trả về từ API
  constructor(private statisticsService: StatisticsService, private http: HttpClient) { }
  selectedMonth: number = new Date().getMonth() + 1; // Mặc định là tháng hiện tại
  selectedYear: number = new Date().getFullYear();   // Mặc định là năm hiện tại
  monthlySales: any[] = [];
  chartData: any[] = [];
  stats = {
    productCount: 0,
    userCount: 0,
    categoryCount: 0,
  };

  salesData: any[] = [];
  view: [number, number] = [700, 400]; // Kích thước biểu đồ

  // Cấu hình biểu đồ doanh thu theo tháng
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Ngày';
  showYAxisLabel = true;
  yAxisLabel = 'Doanh thu theo ngày';
  colorScheme = 'cool';

  // Cấu hình biểu đồ doanh thu theo năm
  salesData1: any[] = [];
  view1: [number, number] = [700, 400]; // Kích thước biểu đồ

  
  showXAxis1 = true;
  showYAxis1 = true;
  gradient1 = false;
  showLegend1 = false;
  showXAxisLabel1 = true;
  xAxisLabel1 = 'Tháng';
  showYAxisLabel1 = true;
  yAxisLabel1 = 'Doanh thu theo tháng';
  colorScheme1 = 'vivid';

  ngOnInit() {
    setTimeout(() => {
      // this.initMapChart();
      // this.initLineChart();
    }, 500);

    const currentMonth = new Date().getMonth() ;

    this.statisticsService.getMonthlySales(currentMonth).subscribe((data) => {
      this.salesData = data.map((item) => ({
        name: item.ngay, // Ngày
        value: item.tongtiendaban, // Tổng tiền bán
      }));
    });

    this.statisticsService.getYearlySales().subscribe((data) => {
      console.log(data)
      this.salesData1 = data.map((item) => ({
        name: `Tháng ${item.thang}`, // Tháng
        value: item.tongtiendaban, // Tổng tiền bán
      }));
    });

    this.statisticsService.getStatistics().subscribe((data) => {
      this.stats = data;
    });
  }

}
