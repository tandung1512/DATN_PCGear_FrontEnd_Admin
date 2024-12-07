// Angular imports
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StatisticsService } from './dashboar.service';
import { CustomCurrencyPipe } from './custom-currency.pipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ColorHelper } from '@swimlane/ngx-charts';


// Project imports
import { SharedModule } from 'src/app/theme/shared/shared.module';

// Declare AmCharts globally
declare const AmCharts: any;

// Import AmCharts scripts
import '../../../assets/charts/amchart/amcharts.js';
import '../../../assets/charts/amchart/gauge.js';
import '../../../assets/charts/amchart/serial.js';
import '../../../assets/charts/amchart/light.js';
import '../../../assets/charts/amchart/pie.min.js';
import '../../../assets/charts/amchart/ammap.min.js';
import '../../../assets/charts/amchart/usaLow.js';
import '../../../assets/charts/amchart/radar.js';
import '../../../assets/charts/amchart/worldLow.js';

// Importing fake data
import dataJson from 'src/fake-data/map_data';
import mapColor from 'src/fake-data/map-color-data.json';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule, CustomCurrencyPipe, NgxChartsModule],
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
  yAxisLabel = 'Doanh thu';
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
  yAxisLabel1 = 'Doanh thu';
  colorScheme1 = 'vivid';

  ngOnInit() {
    setTimeout(() => {
      this.initMapChart();
      this.initLineChart();
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
  }

  // Card data for display
  card = [
    { design: 'border-bottom', number: '235', text: 'TOTAL IDEAS', icon: 'icon-zap text-c-green' },
    { number: '26', text: 'TOTAL LOCATIONS', icon: 'icon-map-pin text-c-blue' }
  ];

  // Social media card data
  social_card = [
    { design: 'col-md-12', icon: 'fab fa-facebook-f text-primary', amount: '12,281', percentage: '+7.2%', color: 'text-c-green', target: '35,098', progress: 60, duration: '3,539', progress2: 45 },
    { design: 'col-md-6', icon: 'fab fa-twitter text-c-blue', amount: '11,200', percentage: '+6.2%', color: 'text-c-purple', target: '34,185', progress: 40, duration: '4,567', progress2: 70 },
    { design: 'col-md-6', icon: 'fab fa-google-plus-g text-c-red', amount: '10,500', percentage: '+5.9%', color: 'text-c-blue', target: '25,998', progress: 80, duration: '7,753', progress2: 50 }
  ];

  // Progressing data
  progressing = [
    { number: '5', amount: '384', progress: 70 },
    { number: '4', amount: '145', progress: 35 },
    { number: '3', amount: '24', progress: 25 },
    { number: '2', amount: '1', progress: 10 },
    { number: '1', amount: '0', progress: 0 }
  ];

  // Table data for displaying user activities
  tables = [
    { src: 'assets/images/user/avatar-1.jpg', title: 'Isabella Christensen', text: 'Lorem Ipsum is simply dummy', time: '11 MAY 12:56', color: 'text-c-green' },
    { src: 'assets/images/user/avatar-2.jpg', title: 'Ida Jorgensen', text: 'Lorem Ipsum is simply', time: '11 MAY 10:35', color: 'text-c-red' },
    { src: 'assets/images/user/avatar-3.jpg', title: 'Mathilda Andersen', text: 'Lorem Ipsum is simply dummy', time: '9 MAY 17:38', color: 'text-c-green' },
    { src: 'assets/images/user/avatar-1.jpg', title: 'Karla Soreness', text: 'Lorem Ipsum is simply', time: '19 MAY 12:56', color: 'text-c-red' },
    { src: 'assets/images/user/avatar-2.jpg', title: 'Albert Andersen', text: 'Lorem Ipsum is', time: '21 July 12:56', color: 'text-c-green' }
  ];

  

  onDateChange(event: any) {
    const selectedDate = event.value; // Ngày người dùng chọn
    this.getSalesByDate(selectedDate);
  }

  getSalesByDate(date: Date): void {
    const formattedDate = date.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
    this.http.get(`http://localhost:8080/api/statistics/sales-by-date?date=${formattedDate}`)
      .subscribe(data => {
        console.log(data); // Hiển thị dữ liệu trả về
      });
  }

  private initMapChart() {
    const latlong = dataJson;
    const mapData = mapColor;

    const minBulletSize = 3;
    const maxBulletSize = 70;
    let min = Infinity;
    let max = -Infinity;

    // Calculate min and max values from mapData
    mapData.forEach(dataItem => {
      const value = dataItem.value;
      if (value < min) min = value;
      if (value > max) max = value;
    });

    const maxSquare = maxBulletSize ** 2 * 2 * Math.PI;
    const minSquare = minBulletSize ** 2 * 2 * Math.PI;

    const images = mapData.map(dataItem => {
      const value = dataItem.value;
      let square = ((value - min) / (max - min)) * (maxSquare - minSquare) + minSquare;
      square = square < minSquare ? minSquare : square; // Ensure square is not less than minSquare
      const size = Math.sqrt(square / (Math.PI * 8));
      const id = dataItem.code;

      return {
        type: 'circle',
        theme: 'light',
        width: size,
        height: size,
        color: dataItem.color,
        longitude: latlong[id].longitude,
        latitude: latlong[id].latitude,
        title: `${dataItem.name}</br> [ ${value} ]`,
        value: value
      };
    });

    // Create world-low chart
    AmCharts.makeChart('world-low', {
      type: 'map',
      projection: 'eckert6',
      dataProvider: {
        map: 'worldLow',
        images: images
      },
      export: {
        enabled: true
      }
    });
  }

  private initLineChart() {
    const chartDatac = [
      { day: 'Mon', value: 60 },
      { day: 'Tue', value: 45 },
      { day: 'Wed', value: 70 },
      { day: 'Thu', value: 55 },
      { day: 'Fri', value: 70 },
      { day: 'Sat', value: 55 },
      { day: 'Sun', value: 70 }
    ];

    // Create widget-line-chart
    AmCharts.makeChart('widget-line-chart', {
      type: 'serial',
      addClassNames: true,
      defs: {
        filter: [
          {
            id: 'blur',
            x: '-50%',
            y: '-50%',
            width: '200%',
            height: '200%',
            feGaussianBlur: {
              in: 'SourceGraphic',
              stdDeviation: '30'
            }
          },
          {
            id: 'shadow',
            x: '-10%',
            y: '-10%',
            width: '120%',
            height: '120%',
            feOffset: {
              result: 'offOut',
              in: 'SourceAlpha',
              dx: '0',
              dy: '20'
            },
            feGaussianBlur: {
              result: 'blurOut',
              in: 'offOut',
              stdDeviation: '10'
            },
            feColorMatrix: {
              result: 'blurOut',
              type: 'matrix',
              values: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .2 0'
            },
            feBlend: {
              in: 'SourceGraphic',
              in2: 'blurOut',
              mode: 'normal'
            }
          }
        ]
      },
      fontSize: 15,
      dataProvider: chartDatac,
      autoMarginOffset: 0,
      marginRight: 0,
      categoryField: 'day',
      categoryAxis: {
        color: '#fff',
        gridAlpha: 0,
        axisAlpha: 0,
        lineAlpha: 0,
        offset: -20,
        inside: true
      },
      valueAxes: [{
        fontSize: 0,
        inside: true,
        gridAlpha: 0,
        axisAlpha: 0,
        lineAlpha: 0,
        minimum: 0,
        maximum: 100
      }],
      chartCursor: {
        valueLineEnabled: false,
        valueLineBalloonEnabled: false,
        cursorAlpha: 0,
        zoomable: false,
        valueZoomable: false,
        cursorColor: '#fff',
        categoryBalloonColor: '#51b4e6',
        valueLineAlpha: 0
      },
      graphs: [{
        id: 'g1',
        type: 'line',
        valueField: 'value',
        lineColor: '#ffffff',
        lineAlpha: 1,
        lineThickness: 3,
        fillAlphas: 0,
        showBalloon: true,
        balloon: {
          drop: true,
          adjustBorderColor: false,
          color: '#ffffff',
          fillAlphas: 0.2,
          bullet: 'round',
          bulletBorderAlpha: 1,
          bulletSize: 5,
          hideBulletsCount: 50,
          lineThickness: 2,
          useLineColorForBulletBorder: true,
          valueField: 'value',
          balloonText: '<span style="font-size:18px;">[[value]]</span>'
        }
      }]
    });
  }
}
