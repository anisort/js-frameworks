import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {AppState} from './store/app.state';
import {taskReducer} from './store/task/task.reducer';
import {TaskEffects} from './store/task/task.effects';
import {routerReducer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {authReducer} from './store/auth/auth.reducer';
import {AuthEffects} from './store/auth/auth.effects';
import {CoreModule} from './core/core.module';
import {InsideModule} from './inside/inside.module';
import {OutsideModule} from './outside/outside.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    InsideModule,
    OutsideModule,
    StoreModule.forRoot<AppState>({
      tasks: taskReducer,
      auth: authReducer,
      router: routerReducer
    }),
    EffectsModule.forRoot([TaskEffects, AuthEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
