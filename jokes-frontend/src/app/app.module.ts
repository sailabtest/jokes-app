import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { HelperService }  from './service/helper.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent }  from './components/page_not_found/pageNotFound.component';

export const router: Routes = [
  {path: '',redirectTo: 'home',pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: '**',component: PageNotFoundComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule,ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(
      router, { enableTracing: false, useHash: true } // <-- debugging purposes only
    ) 
  ],
  providers: [HelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
