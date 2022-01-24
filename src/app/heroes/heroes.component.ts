import { Component, OnInit } from "@angular/core";

import { Hero } from "../_models/hero";
import { HeroService } from "../_services/hero.service";
import { User } from "../_models/user";
import { AuthenticationService } from "../_services/authentication.service";
import { Role, RoleType } from "../_models/role";
import { InMemoryDataService } from '../_services/in-memory-data.service';
import { Validators } from "@angular/forms";

@Component({
  selector: "app-heroes",
  templateUrl: "./heroes.component.html",
  styleUrls: ["./heroes.component.css"]
})
export class HeroesComponent implements OnInit {
  heroes!: Hero[];
  currentUser!: User;
  error!: string;
  constructor(
    private heroService: HeroService,
    private authenticationService: AuthenticationService, 
    private inMemoryDataService: InMemoryDataService 
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => (this.heroes = heroes));
  }
  get isWriter() {
    return (
      this.currentUser &&
      this.currentUser.roles!.find(x => x.roletype === RoleType.HeroesWriter)
    );
  }
  add(name: string): void {
    name = name.trim();
    this.error = "";
    if (!name) {
      return;
    }
    if(!this.inMemoryDataService.isInDb(this.heroes, name)){
      this.heroService.addHero({ name } as Hero).subscribe(hero => {
      this.heroes.push(hero);
      });
    }else{
      this.error = "Такой герой уже существует";
    }
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }
}