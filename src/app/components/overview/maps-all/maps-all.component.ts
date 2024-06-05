import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as fvOverviewReducer from '../../../state-managements/reducers/fv-overview.reducer';
import { FvState } from '../../../state-managements/states/app.states';
declare var google: any;

@Component({
  selector: 'app-maps-all',
  templateUrl: './maps-all.component.html',
  styleUrls: ['./maps-all.component.css']
})
export class MapsAllComponent implements OnInit {
  map: any
  markers: any[] = []
  _data: any[];
  checkLoad = 0;

  centerPosition = { lat: 9.5, lng: 101 };

  get allowDay(): any[] {
    return this._data;
  }

  @Input('data')
  set data(value: any[]) {
    this._data = value;

    if (this.map) {
      this.renderMap(value)
    }
  }

  constructor(private store: Store<FvState>,
    private router: Router) { }

  ngOnInit() {
    // let position = { lat: 9, lng: 101.5 };
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: this.centerPosition,
      zoom: 6
    });

    this.store.select(fvOverviewReducer.getFvOverviewData).subscribe(res => {
      if (res) {
        let id = 1
        for (let r of res) {
          let newData = {}
          if(r.datas)
          {
            for (let d of r.datas) {
              newData[d.name] = {}
              newData[d.name].value = d.value
              newData[d.name].timestamp = d.dateTime
              newData[d.name].tagName = d.tagName
            }
            r['newData'] = newData
            r['id'] = id++
          }
        }
        this.data = res
        if (this.data && this.data.length > 0 && this.map) {
          this.renderMap(this.data)
        }
      }
    });
  }

  renderMap(data) {
    this.clearOverlays()
    this.markers = []
    let i: number = 0
    for (let r of data) {
      if(r.id){
        let heading = +r['newData']['VES_GPS_HEAD'].value
        let lat = +r['newData']['VES_GPS_LAT'].value
        let long = +r['newData']['VES_GPS_LONG'].value
        let id = i++;
        this.markers[id] = new google.maps.Marker({
          position: this.getPosition(lat, long),
          map: this.map,
          label: this.getLabel(r.id.toString()),
          icon: this.getIcon(heading),
        });
        this.markers[id].addListener('click', () => {
          this.clickMarker(r.fv.prefix)
        })
      }
    }
    if (this.markers.length > 0 && this.checkLoad == 0) {
      this.map.setZoom(6);
      // this.map.setCenter(this.markers[0].getPosition());
      this.map.setCenter( this.centerPosition);
      this.checkLoad = 1;
    }
  }

  clickMarker(prefix: string) {
    this.router.navigate(['/main/realtime', prefix]);
  }

  getIcon(heading: number) {
    // let path = 'M 1.958 15 v -33.531  l 20 -30 l 20 30 v 33.531 Z'
    let path = 'M -20 15 v -33.531  l 20 -30 l 20 30 v 33.531 Z'
    let pathArrowScale = 0.5;

    return {
      path: path,
      fillColor: '#ED7D31',
      labelOrigin: new google.maps.Point(0, -5),
      fillOpacity: 1,
      scale: pathArrowScale,
      strokeColor: 'white',
      strokeWeight: 1,
      rotation: heading,
    }
  }

  getPosition(lat: number, long: number) {
    return { lat: lat, lng: long };
  }

  getLabel(text: string) {
    return {
      text: text,
      color: 'white',
      fontSize: '12px',
      fontWeight: 'bold',
      fontFamily: '"Roboto", sans-serif',
      labelClass: 'TrackingMapLabel',
      background: 'blue'
    }
  }

  clearOverlays() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers.length = 0;
  }
}
