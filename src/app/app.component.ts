import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { HeroComponent } from "./components/hero/hero.component";
import { AboutComponent } from "./components/about/about.component";
import { TechniquesAgroecoComponent } from "./components/techniques-agroeco/techniques-agroeco.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
    selector: "app-root",
    imports: [
        RouterOutlet,
        NavbarComponent,
        HeroComponent,
        AboutComponent,
        TechniquesAgroecoComponent,
        FooterComponent,
    ],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent {}
