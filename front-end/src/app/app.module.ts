import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule }   from '@angular/forms';

// Components
import { AppComponent } from './app.component';

// Services
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { PlaylistService } from './services/playlist.service';
import { StorageService } from './services/storage.service';
import { HomeComponent } from './components/home/home.component';
import { CallbackComponent } from './components/callback/callback.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CallbackComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
  	AuthService,
    StorageService,
    PlaylistService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
