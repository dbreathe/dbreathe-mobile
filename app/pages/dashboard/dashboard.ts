import { Component, NgZone } from '@angular/core';
import {CHART_DIRECTIVES} from 'ng2-charts';
import {SensorService} from '../../services/sensor';

const X_VALUES = 60;

@Component({
  templateUrl: 'build/pages/dashboard/dashboard.html',
  providers: [SensorService],
  directives: [CHART_DIRECTIVES]
})
export class DashboardPage {
  public ketoneChartData: Array<any> = [
    { data: [], label: 'Ketones (mmol/L)' }
  ];
  public ketoneChartLabels: Array<any> = [];
  public ketoneChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public tempretureChartData: Array<any> = [
    { data: [], label: 'Tempreture (°C)' },
    { data: [], label: 'Humidity (%)' }
  ];
  public tempretureChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    animation: false,
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          display: false
        }
      }]
    }
  };
  private lineChartLegend: boolean = false;
  private lineChartType: string = 'line';

  constructor(private zone: NgZone, private sensors: SensorService) {
    for (let i = 0; i < X_VALUES; i++) {
      this.ketoneChartData[0].data.push(0);
      this.ketoneChartLabels.push('');

      this.tempretureChartData[0].data.push(0);
      this.tempretureChartData[1].data.push(0);
      this.tempretureChartLabels.push('');
    }

    sensors.addListener((data: string) => this.onDataReceived(data));
  }

  onDataReceived(data: string) {
    const values = data.split(',')
      .map(x => (Number(x) / 1000));

    if (values.length !== 5) {
      return;
    }

    const [mmol, ppmf, raw, humidity, tempreture] = values;

    const [ketonesDataset] = this.ketoneChartData;
    const [tempretureDataset, humidtyDataset] = this.tempretureChartData;

    let _keytonesData = ketonesDataset.data.slice();

    _keytonesData.unshift(mmol);
    _keytonesData.pop();

    let _tempretureData = tempretureDataset.data.slice();

    _tempretureData.unshift(tempreture);
    _tempretureData.pop();

    let _humidityData = humidtyDataset.data.slice();

    _humidityData.unshift(humidity);
    _humidityData.pop();

    this.ketoneChartData = [
      { data: _keytonesData, label: ketonesDataset.label }
    ];

    this.tempretureChartData = [
      { data: _tempretureData, label: tempretureDataset.label },
      { data: _humidityData, label: humidtyDataset.label }
    ];
  }
}
