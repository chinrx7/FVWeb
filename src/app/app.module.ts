import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {
    FormsModule,
    ReactiveFormsModule
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe, DecimalPipe,DeprecatedI18NPipesModule,CommonModule  } from '@angular/common';

// state managements 
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { reducers } from './state-managements/reducers/recuder';
import { FvInfoEffects } from './state-managements/effects/fv-info.effects';
import { FvOverviewEffects } from './state-managements/effects/fv-overview.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
// modules
import { AppRoutingModule } from './routes/routing.module';
import { MaterialModules } from './third-party/material.modules';
import { PrimeNGModules } from './third-party/primeng.modules';
import { HighchartModules } from './third-party/highchart.modules';
import { PdfViewerModule }  from 'ng2-pdf-viewer';
// services
import { AuthService } from './services/auth.service';
import { FvInfoService } from './services/fv-info.service';
import { HttpClientService } from './services/http-client.service';
import { CoordinatesService } from './services/coordinate.service';
import { FvTimeService } from './services/fv-time.service';
import { TooltipFormatService } from './services/tooltip-format.service';
import { FvRealtimeService } from './services/fv-realtime.service';
import { FvOverviewService } from './services/fv-overview.service';
import { TagService } from './services/tag.service';
// share
import { ValueLengthPipe } from './share/pipes/value-length.pipe';
import { RealTimeValueDirective } from './share/directives/realtime-value.directive';
import { RealTimeColorDirective } from './share/directives/realtime-color.directive';
// components
import { AppComponent } from './app.component';
import { MainComponent } from './core/main/main.component';
import { LoginComponent } from './core/login/login.component';
import { HeaderComponent } from './core/header/header.component';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { RealtimeComponent } from './components/realtime/realtime.component';
import { DataLoggerComponent } from './components/data-logger/data-logger.component';
import { ChartComponent } from './components/chart/chart.component';
import { ReportComponent } from './components/report/report.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { MainEngineComponent } from './components/realtime/main-engine/main-engine.component';
import { MainEngineElectricComponent } from './components/realtime/main-engine-electric/main-engine-electric.component';
import { DieselGeneratorNoRpmComponent } from './components/realtime/diesel-generator-no-rpm/diesel-generator-no-rpm.component';
import { DieselGeneratorNoRpmVtotalComponent } from './components/realtime/diesel-generator-no-rpm-vtotal/diesel-generator-no-rpm-vtotal.component';
import { ElectricMotorComponent } from './components/realtime/electric-motor/electric-motor.component';
import { AuxEngineComponent } from './components/realtime/aux-engine/aux-engine.component';
import { SummaryComponent } from './components/realtime/summary/summary.component';
import { MapComponent } from './components/realtime/map/map.component';
import { OverviewComponent } from './components/overview/overview.component';
import { DateControlComponent } from './components/date-control/date-control.component';
import { DatetimeControlComponent } from './components/datetime-control/datetime-control.component';
import { SummaryOverviewComponent } from './components/overview/summary-overview/summary-overview.component';
import { MapsAllComponent } from './components/overview/maps-all/maps-all.component';
import { SummaryOverviewCardComponent } from './components/overview/summary-overview-card/summary-overview-card.component';
import { OverviewCardComponent } from './components/overview/summary-overview-card/overview-card/overview-card.component';
import { FooterComponent } from './core/footer/footer.component';
import { SecurityService } from './services/security.service';



@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        LoginComponent,
        HeaderComponent,
        SidebarComponent,
        RealtimeComponent,
        DataLoggerComponent,
        ChartComponent,
        ReportComponent,
        NotfoundComponent,
        MainEngineComponent,
        MainEngineElectricComponent,
        DieselGeneratorNoRpmComponent,
        DieselGeneratorNoRpmVtotalComponent,
        ElectricMotorComponent,
        AuxEngineComponent,
        SummaryComponent,
        MapComponent,
        ValueLengthPipe,
        RealTimeValueDirective,
        RealTimeColorDirective,
        DatetimeControlComponent,
        DateControlComponent,
        OverviewComponent,
        SummaryOverviewComponent,
        MapsAllComponent,
        SummaryOverviewCardComponent,
        OverviewCardComponent,
        FooterComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot([FvInfoEffects,FvOverviewEffects]),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production
        }),
        MaterialModules,
        PrimeNGModules,
        HighchartModules,
        PdfViewerModule,
        CommonModule,
        DeprecatedI18NPipesModule,
        AppRoutingModule
    ],
    providers: [
        AuthService,
        FvInfoService,
        HttpClientService,
        CoordinatesService,
        FvTimeService,
        DatePipe,
        DecimalPipe,
        TooltipFormatService,
        FvRealtimeService,
        FvOverviewService,
        TagService,
        SecurityService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

 }
