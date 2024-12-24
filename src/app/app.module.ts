import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SharedModule} from "./shared/shared.module";
import {HttpClientModule, provideHttpClient, withInterceptors} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MessageService} from "primeng/api";
import { ServiceWorkerModule } from '@angular/service-worker';
import {ToastModule} from "primeng/toast";
import {AppLayoutModule} from "./shared/layout/app.layout.module";
import {DialogService} from "primeng/dynamicdialog";
import {serverErrorInterceptor} from "./shared/interceptors/server-error.interceptor";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SharedModule,
      AppLayoutModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        ToastModule
    ],
  providers: [
    MessageService, DialogService,
    provideHttpClient(withInterceptors([serverErrorInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
