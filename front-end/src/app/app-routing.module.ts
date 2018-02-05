import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CallbackComponent } from './components/callback/callback.component';


const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'callback',
		component: CallbackComponent
	},
	{
		path: '**',
		redirectTo: '/',
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
