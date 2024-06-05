import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { FvState } from '../../../state-managements/states/app.states';
import * as fvInfoReducer from '../../../state-managements/reducers/fv-info.reducer';

declare var google: any;
declare var $: any;


@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    @Input() lat
    @Input() long
    map: any
    marker: any
    isMapFullScreen = false;
    constructor(private store: Store<FvState>) {

    }

    ngOnInit() {
        $(document).bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', this.onFullScreen.bind(this));
        this.store.select(fvInfoReducer.getFvRealtimeDataLatLong).subscribe(r => {
            if (r)
                this.setLatLong(r.lat, r.long)
        })
    }

    setLatLong(lat: string, long: string) {
        if (!lat || !long) {
            this.map = null
            return
        }
        else if (this.map == null) {
            var myLatLng = { lat: parseFloat(lat), lng: parseFloat(long) };
            this.map = new google.maps.Map(document.getElementById('map'), {
                center: myLatLng,
                zoom: 6
            });
            this.marker = new google.maps.Marker({
                position: myLatLng,
                map: this.map
            });

            this.map.setCenter(this.marker.getPosition());
        }
        else {
            var newLatLng = new google.maps.LatLng(lat, long);
            this.marker.setPosition(newLatLng);
            this.map.panTo(this.marker.getPosition());
        }
    }

    onFullScreen() {
        var isFullScreen = document['fullScreen'] ||
            document['mozFullScreen'] ||
            document.webkitIsFullScreen;
        if (isFullScreen) {
            this.map.setCenter(this.marker.getPosition());
        } else {
            this.map.setCenter(this.marker.getPosition());
        }
    }

}
