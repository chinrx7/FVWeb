import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HttpClientService } from '../services/http-client.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/Observable/of';
const API_KEY: string = 'AIzaSyAFQJdh5aKn33Dl7ZFRy-wBVnMGJdPmiYQ'

declare var google: any;


@Injectable()
export class CoordinatesService {

    constructor(private decimalPipe: DecimalPipe,
        private httpClientService: HttpClientService) { }

    getLatLong(lat: string, long: string): string {
        if (lat && long) {
            let _lat, _long
            if (lat.indexOf('-') > -1)
                _lat = this.decimalPipe.transform(lat, '0.0-5') + " S"
            else
                _lat = this.decimalPipe.transform(lat, '0.0-5') + " N"

            if (long.indexOf('-') > -1)
                _long = this.decimalPipe.transform(long, '0.0-5') + " W"
            else
                _long = this.decimalPipe.transform(long, '0.0-5') + " E"

            return `${_lat}, ${_long}`
        }
        return null;
    }

    getLat(lat: string): string {
        
        if (lat && lat != '---') {
            let _lat
            if (lat.indexOf('-') > -1)
                _lat = this.decimalPipe.transform(lat, '0.0-5') + " S"
            else
                _lat = this.decimalPipe.transform(lat, '0.0-5') + " N"
            return `${_lat}`
        }
        return null;
    }


    getLong(long: string): string {
        if (long && long != '---') {
            let _long
            if (long.indexOf('-') > -1)
                _long = this.decimalPipe.transform(long, '0.0-5') + " W"
            else
                _long = this.decimalPipe.transform(long, '0.0-5') + " E"

            return `${_long}`
        }
        return null;
    }

    getUnitLat(lat: string) {
        if (lat) {
            if (lat.indexOf('-') > -1) {
                return " S"
            }
            else {
                return " N"
            }
        }
    }

    getUnitLong(long: string) {
        if (long) {
            if (long.indexOf('-') > -1) {
                return " W"
            }
            else {
                return " E"
            }
        }
    }

    async getNearby(vessel: any) {
        try {

            vessel.lat = '40.741895'
            vessel.long = '-73.989308'
            await this.httpClientService.getAddress(vessel.lat, vessel.long, API_KEY).subscribe(r => {
                if (r.status == "OK") {
                    if (r.results[0]) {
                        if (r.results[0].address_components[0]) {
                            let routes = r.results[0].address_components.filter(x => x.types.indexOf('locality') > -1)
                            if (routes.length > 0) {
                                let name = routes[0].short_name
                                return name
                            }
                        }
                    }
                }
            })
        }
        catch (ex) {
        }
    }
}

