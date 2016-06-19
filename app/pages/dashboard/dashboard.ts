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
  public ketoneChartColours: Array<any> = [];
  public ketonePpmChartData: Array<any> = [
    { data: [], label: 'Ketones (PPM)' }
  ];
  public ketonePpmChartColours: Array<any> = [];
  public temperatureChartData: Array<any> = [
    { data: [], label: 'Temperature (°C)' }
  ];
  public temperatureChartColours: Array<any> = [];
  public humidityChartData: Array<any> = [
    { data: [], label: 'Humidity (%)' }
  ];
  public humidityChartColours: Array<any> = [];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    animation: false,
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          display: false
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  private lineChartLegend: boolean = false;
  private lineChartType: string = 'line';

  constructor(private zone: NgZone, private sensors: SensorService) {
    for (let i = 0; i < X_VALUES; i++) {
      this.ketoneChartColours = this.getColours(['#34495e']);
      this.ketonePpmChartColours = this.getColours(['#2ecc71']);
      this.temperatureChartColours = this.getColours(['#e74c3c']);
      this.humidityChartColours = this.getColours(['#3498db']);

      this.ketoneChartData[0].data.push(0);
      this.ketonePpmChartData[0].data.push(0);
      this.temperatureChartData[0].data.push(0);
      this.humidityChartData[0].data.push(0);

      this.lineChartLabels.push('');
    }

    sensors.addListener((data: string) => this.onDataReceived(data));
  }

  onDataReceived(data: string) {
    const values = data.split(',')
      .map(x => (Number(x) / 1000));

    if (values.length !== 5) {
      return;
    }

    const [mmol, ppmf, raw, humidity, temperature] = values;

    const [ketoneDataset] = this.ketoneChartData;
    const [ketonePpmDataset] = this.ketonePpmChartData;
    const [temperatureDataset] = this.temperatureChartData;
    const [humidityDataset] = this.humidityChartData;

    let _ketoneData = ketoneDataset.data.slice();

    _ketoneData.unshift(mmol);
    _ketoneData.pop();

    let _ketonePpmData = ketonePpmDataset.data.slice();

    _ketonePpmData.unshift(ppmf);
    _ketonePpmData.pop();

    let _temperatureData = temperatureDataset.data.slice();

    _temperatureData.unshift(temperature);
    _temperatureData.pop();

    let _humidityData = humidityDataset.data.slice();

    _humidityData.unshift(humidity);
    _humidityData.pop();

    this.ketoneChartData = [
      { data: _ketoneData, label: ketoneDataset.label }
    ];

    this.ketonePpmChartData = [
      { data: _ketonePpmData, label: ketonePpmDataset.label }
    ];

    this.temperatureChartData = [
      { data: _temperatureData, label: temperatureDataset.label }
    ];

    this.humidityChartData = [
      { data: _humidityData, label: humidityDataset.label }
    ];
  }

  rgba(colour, alpha) {
    return 'rgba(' + colour.concat(alpha).join(',') + ')';
  }

  hexToRgb(hex) {
    var bigint = parseInt(hex.substr(1), 16),
      r = (bigint >> 16) & 255,
      g = (bigint >> 8) & 255,
      b = bigint & 255;

    return [r, g, b];
  }

  getColour(colour) {
    return {
      backgroundColor: this.rgba(colour, 0.2),
      borderColor: this.rgba(colour, 1),
      pointBackgroundColor: this.rgba(colour, 1),
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: this.rgba(colour, 0.8)
    };
  }

  getColours(colours) {
    let _clrs = [];

    colours.forEach(
      color => {
        _clrs.push(this.getColour(this.hexToRgb(color)));
      }
    );

    return _clrs;
  }
}
