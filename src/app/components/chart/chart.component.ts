import { Component, OnInit } from '@angular/core';
import { Highcharts }   from 'angular-highcharts';
import { DatePipe } from '@angular/common';
import { Chart } from 'angular-highcharts';
import { HttpClientService } from '../../services/http-client.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  constructor(private datePipe: DatePipe,
    private http : HttpClientService) { }
  loading:boolean
  chart: Chart
  ngOnInit() {
  }

  showLogger(event){
    this.loading = true
    let _start = this.datePipe.transform(event.start, "yyyy-MM-dd HH:mm:00")
    let _end = this.datePipe.transform(event.end, "yyyy-MM-dd HH:mm:00")

    this.http.getChartRawData(_start, _end, event.tags).subscribe((res: any) => {
        let series : any[]  = []
        for(let r of res){
            let data : any[] =[]
            for(let v of r.values){
                data.push([new Date(v.timestamp).getTime(),parseFloat(v.value)])
            }
            series.push({
                type: 'line',
                name: r.point.name,
                data:data,
                marker: {
                    enabled: false
                }
            })
        }
    
        let yAxis = this.getYaxis(series)
        this.initChart(yAxis,series,_start,_end)
        this.loading = false
    })
  }


  getYaxis(series:any[]) : any[]{
    let res:any[] = []
    let i=0;
    for(let s of series){
        res.push({
            title:{
                text:null,
            },
            labels: {
                format: '{value}',
                style: {
                    color: Highcharts.getOptions().colors[i],
                    fontWeight:'bold'
                }
            },
        })
        s.yAxis = i
        i++
    }
    return res
}


initChart(yAxixSeries :any[],series: any,start:string,end:string) {
    let _min = new Date(start).getTime()
    let _max = new Date(end).getTime()

    this.chart = new Chart({
        credits: {
            enabled: false
        },
        exporting: {
            chartOptions: { // specific options for the exported image
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: false
                        }
                    }
                }
            },
            fallbackToExportServer:false
        },
        plotOptions: {
            series: {
                lineWidth: 1
            }
        },
        xAxis: {
            type: 'datetime',
            min:_min,
            max:_max
        },
        yAxis:yAxixSeries,
        title: {
            text: null,
        },
        chart: {
            type: 'column',
            zoomType: 'x'
        },
        series: series,
        tooltip: {
            xDateFormat: '%d-%b-%Y %H:%M',
            shared: true,
            split: false,
            enabled: true,
            crosshairs: true
        }
        
    });
  
}

}
