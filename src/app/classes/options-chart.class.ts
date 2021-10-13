export class OptionChart {
  private series!: any[];
  private chart!: any;
  private title!: any;
  private xaxis = {
    type: 'datetime',
  };
  private yaxis = {
    show: false,
    tooltip: {
      enabled: true,
    },
  };

  constructor(series: any, type: string, name: string) {
    this.series = series;
    this.chart = {
      heigh: 100,
      type: type,
    };
    this.title = {
      text: name,
      align: 'left',
    };
  }

  value() {
    return {
      series: this.series,
      chart: this.chart,
      title: this.title,
      xaxis: this.xaxis,
      yaxis: this.yaxis,
    };
  }
}
