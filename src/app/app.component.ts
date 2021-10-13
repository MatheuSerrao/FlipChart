import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import ApexCharts from 'apexcharts';
import { OptionChart } from 'src/app/classes/options-chart.class';
import { environment } from 'src/environments/environment';
import {
  Klines,
  parseGaussianSmoothHg,
  parseGaussianSmoothLw,
  parseKline,
} from './models/klines.interface';
interface MaxMin {
  max: {
    length: number;
    data: Klines[];
  };
  min: {
    length: number;
    data: Klines[];
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.getKlines();
    this.getMemoryVolatilityBands();
  }

  private symbol = 'BTCUSDT';
  private timeFrame = '1d';
  private att = 'highestPrice';

  getKlines() {
    const data: {
      x: Date;
      y: number[];
    }[] = [];

    let options!: OptionChart;

    return this.http
      .get<Klines[]>(
        environment.url +
          `/klines?symbol=${this.symbol}&timeFrame=${this.timeFrame}`
      )
      .subscribe(
        (res: Klines[]) => {
          res.forEach((element: Klines) => {
            data.push(parseKline(element));
          });
          const body = [
            {
              data: data,
            },
          ];
          options = new OptionChart(body, 'candlestick', 'Candlestick');
        },
        () => {},
        () => {
          const chart = new ApexCharts(
            document.querySelector('#candlestick'),
            options.value()
          );
          chart.render();
        }
      );
  }

  getMaxMin() {
    return this.http
      .get<MaxMin>(
        environment.url +
          `/volatility/min-max-locals?symbol=${this.symbol}&timeFrame=${this.timeFrame}`
      )
      .subscribe(
        (res: MaxMin) => {
          const data: {
            x: Date;
            y: number;
          }[] = [];

          // let klines: Klines[] = res.max.data.concat(res.min.data);
          // klines = this.sortByStartDate(klines);
          // klines.forEach((element: Klines) => {
          //   data.push(parseKlineMaxMin(element));
          // });
          // this.options.series[0].data = data;
        },
        () => {},
        () => {}
      );
  }

  getMemoryVolatilityBands() {
    interface MaxMin {
      max: Klines[];
      min: Klines[];
    }

    let options!: OptionChart;

    return this.http
      .get<MaxMin>(
        environment.url +
          `/volatility/memory-volatility-bands?symbol=${this.symbol}&timeFrame=${this.timeFrame}&att=${this.att}`
      )
      .subscribe(
        (res: MaxMin) => {
          const dataMax: {
            x: Date;
            y?: number;
          }[] = [];

          const dataMin: {
            x: Date;
            y?: number;
          }[] = [];
          let max: Klines[] = res.max;
          let min: Klines[] = res.min;
          max.forEach((element: Klines) => {
            dataMax.push(parseGaussianSmoothHg(element));
          });
          min.forEach((element: Klines) => {
            dataMin.push(parseGaussianSmoothLw(element));
          });

          const body = [
            {
              name: 'Max',
              type: 'line',
              data: dataMax,
            },
            {
              name: 'Min',
              type: 'line',
              data: dataMin,
            },
          ];
          options = new OptionChart(body, 'line', 'Gaussian Smooth');
        },
        () => {},
        () => {
          const chart = new ApexCharts(
            document.querySelector('#line'),
            options.value()
          );
          chart.render();
        }
      );
  }

  private getTime(date?: Date) {
    return date != null ? new Date(date).getTime() : 0;
  }

  public sortByStartDate(array: Klines[]): Klines[] {
    return array.sort((a: Klines, b: Klines) => {
      return (
        this.getTime(new Date(a.openTime)) - this.getTime(new Date(b.openTime))
      );
    });
  }
}
