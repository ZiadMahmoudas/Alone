import { Component, DOCUMENT, Inject, inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./main-layout/navbar/navbar";
import { Footer } from "./main-layout/footer/footer";
import { Loader } from "./main-layout/loader/loader";
import { ThemeService } from './core/services/theme/theme-service';
import { TranslateService } from '@ngx-translate/core';
import { LangService } from './core/services/lang/lang';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Loader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Alone';

constructor(
    private themeService:ThemeService,

){}

  ngOnInit(): void {
    const theme = this.themeService.getTheme();
    document.body.classList.toggle("dark-theme", theme === 'dark');
    document.body.classList.toggle("light-theme", theme !== 'dark');
  }


}
