import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { MainComponent }        from '../core/main/main.component';
import { LoginComponent }       from '../core/login/login.component';
import { RealtimeComponent }    from '../components/realtime/realtime.component';
import { DataLoggerComponent } from '../components/data-logger/data-logger.component';
import { ChartComponent } from '../components/chart/chart.component';
import { ReportComponent } from '../components/report/report.component';
import { NotfoundComponent } from '../components/notfound/notfound.component';
import { OverviewComponent } from '../components/overview/overview.component'; 
// guards
import { AuthGuard }    from './guards/auth-guard';
import { LoginGuard }   from './guards/login-guard';

// resolves
import { TimerResolver } from './resolves/timer.resolve';

// services
import { AuthService }  from '../services/auth.service';


const routes: Routes = [
    {
        path:'',
        redirectTo:'/main/overview',
        pathMatch :'full',

    },
    {
        path:'login',
        component:LoginComponent,
        canActivate: [LoginGuard],
    },
    {
        path:'main',
        component:MainComponent,
        canActivate: [AuthGuard],
        resolve : {
            timer : TimerResolver
        },
        children:[
            {
                path:'',

                children:[
                    { 
                        path: '', 
                        redirectTo:'/overview',
                        pathMatch: 'full',
                    },
                    {
                        path:'overview',
                        component:OverviewComponent,
                        canActivateChild:[AuthGuard],
                        data:{
                            depth:1
                        }
                    },
                    {
                        path:'realtime',
                        component:RealtimeComponent,
                        canActivateChild:[AuthGuard],
                        data:{
                            depth:2
                        }
                    },
                    {
                        path:'realtime/:id',
                        component:RealtimeComponent,
                        canActivateChild:[AuthGuard],
                        data:{
                            depth:2
                        }
                    },
                    {
                        path:'datalogger',
                        component:DataLoggerComponent,
                        canActivateChild:[AuthGuard],
                        data:{
                            depth:3
                        }
                    },
                    {
                        path:'chart',
                        component:ChartComponent,
                        canActivateChild:[AuthGuard],
                        data:{
                            depth:4
                        }
                    },
                    {
                        path:'report',
                        component:ReportComponent,
                        canActivateChild:[AuthGuard],
                        data:{
                            depth:5
                        }
                    },
                    {
                        path:'**',
                        component:NotfoundComponent
                    }
                ]
            },
        ],
    }
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes,{
          useHash:true
        }),
      ],
    exports: [RouterModule],
    providers: [
      AuthGuard,
      LoginGuard,
      TimerResolver
    ]
  })
  export class AppRoutingModule { }