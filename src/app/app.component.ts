import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import ApexCharts from 'apexcharts';
import { environment } from 'src/environments/environment';
import { Klines, parseKline } from './models/klines.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  constructor(private http: HttpClient) {}

  private options = {
    series: [
      {
        data: [
          {
            x: new Date(1538778600000),
            y: [6629.81, 6650.5, 6623.04, 6633.33],
          },
        ],
      },
    ],
    chart: {
      type: 'candlestick',
      height: 350,
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left',
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  ngAfterViewInit() {
    this.getKlines();
  }

  getKlines() {
    const data: {
      x: Date;
      y: number[];
    }[] = [];

    return this.http.get<Klines[]>(environment.url + '/klines').subscribe(
      (res: Klines[]) => {
        res.forEach((element: Klines) => {
          data.push(parseKline(element));
        });
        this.options.series[0].data = data;
        console.log(this.options.series[0].data);

        const chart = new ApexCharts(
          document.querySelector('#chart'),
          this.options
        );
        chart.render();
      },
      () => {},
      () => {}
    );
  }
}
