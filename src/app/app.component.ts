import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import ApexCharts from 'apexcharts';
import { environment } from 'src/environments/environment';
import {
  Klines,
  parseKline,
  parseKlineMaxMin,
} from './models/klines.interface';

interface ApexChartOptions {
  series: {
    name: string;
    type: string;
    data: {
      x: Date;
      y: number[] | number;
    }[];
  }[];
  chart?: any;
  title?: any;
  xaxis?: any;
  yaxis?: any;
  stroke?: any;
  tooltip?: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  constructor(private http: HttpClient) {}

  private options: ApexChartOptions = {
    series: [
      {
        name: 'line',
        type: 'line',
        data: [],
      },
    ],
    chart: {
      height: 350,
      type: 'line',
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left',
    },
    stroke: {
      width: [3, 1],
    },
    // tooltip: {
    //   shared: true,
    //   custom: [
    //     (seriesIndex: number, dataPointIndex: number, w: any) =>
    //       w.globals.series[seriesIndex][dataPointIndex],
    //     (seriesIndex: number, dataPointIndex: number, w: any) => {
    //       var o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
    //       var h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
    //       var l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
    //       var c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
    //       return '';
    //     },
    //   ],
    // },
    xaxis: {
      type: 'datetime',
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
        const body = {
          name: 'candle',
          type: 'candlestick',
          data: data,
        };
        this.options.series.push(body);
        this.getMaxMin();
      },
      () => {},
      () => {
        const chart = new ApexCharts(
          document.querySelector('#chart'),
          this.options
        );
        chart.render();
      }
    );
  }

  getMaxMin() {
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

    return this.http
      .get<MaxMin>(environment.url + '/volatility/min-max-locals')
      .subscribe(
        (res: MaxMin) => {
          const data: {
            x: Date;
            y: number;
          }[] = [];

          let klines: Klines[] = res.max.data.concat(res.min.data);
          klines = this.sortByStartDate(klines);
          klines.forEach((element: Klines) => {
            data.push(parseKlineMaxMin(element));
          });
          this.options.series[0].data = data;
        },
        () => {},
        () => {}
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
