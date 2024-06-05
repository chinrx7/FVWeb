import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { FvInfo } from "../../state-managements/models/fv.model";
import * as fvInfoReducer from "../../state-managements/reducers/fv-info.reducer";
import { FvState } from "../../state-managements/states/app.states";
import { Observable } from "rxjs/Observable";
import { CoordinatesService } from "../../services/coordinate.service";
import { FvTimeService } from "../../services/fv-time.service";
import { FvInfoService } from "../../services/fv-info.service";
import { FvRealtimeService } from "../../services/fv-realtime.service";
import { FvOverviewService } from "../../services/fv-overview.service";
import { Animaions } from "./main.animation";
@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"],
  animations: [Animaions.routeAnimation],
})
export class MainComponent implements OnInit, OnDestroy {
  activeOffCanvas: boolean = false;
  fvinfoActive$: Observable<any>;
  showSidebar = true;

  constructor(
    public fvTimeService: FvTimeService,
    public coordinatesService: CoordinatesService,
    private store: Store<FvState>,
    private router: Router,
    private fvOverviewService: FvOverviewService,
    private fvInfoService: FvInfoService,
    private fvRealtimeService: FvRealtimeService,
    private route: ActivatedRoute
  ) {
    this.fvInfoService.start(this.route.snapshot.data.timer);
    this.fvRealtimeService.start(this.route.snapshot.data.timer);
    this.fvOverviewService.start(this.route.snapshot.data.timer);

    // this.fvinfoActive$ = this.store.select(fvInfoReducer.getFvInfosActive).map(r => {
    //     return (r) ? r.fvInfo : null;
    // })

    this.router.events.subscribe((res: NavigationEnd) => {
      let _url = res.url;
      if (_url && (_url == "/main/overview" || _url == "/")) {
        this.showSidebar = false;
      } else {
        this.showSidebar = true;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.fvInfoService.stop();
    this.fvOverviewService.stop();
  }

  toggle() {
    this.activeOffCanvas = !this.activeOffCanvas;
  }

  onSelectVessel(e: any) {
    this.activeOffCanvas = !this.activeOffCanvas;
  }

  getDepth(outlet) {
    return outlet.activatedRouteData["depth"];
  }
}
