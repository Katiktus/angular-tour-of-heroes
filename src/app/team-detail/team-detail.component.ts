import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TeamService } from '../_services/team.service';
import { Team } from '../_models/team';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { InMemoryDataService } from '../_services/in-memory-data.service';
import { RoleType } from '../_models/role';
import { Hero } from '../_models/hero';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit {
  team: Team | undefined;
  currentUser!: User;
  error!: string;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private location: Location,
    private authenticationService: AuthenticationService, 
    private inMemoryDataService: InMemoryDataService 
  ) {
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  get isWriter() {
    return (
      this.currentUser &&
      this.currentUser.roles!.find(x => x.roletype === RoleType.HeroesWriter)
    );
  }

  ngOnInit(): void {
    this.getTeam();
  }

  getTeam(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.teamService.getTeam(id)
      .subscribe(team => this.team = team);
  }

  goBack(): void {
    this.location.back();
  }

  add(name: string): void {
    name = name.trim();
    this.error = "";
    if (!name) {
      return;
    }
    if(!this.inMemoryDataService.isInDb(this.team!.heroes, name)){
      this.teamService.addHero({ name } as Hero).subscribe(hero => {
      this.team!.heroes.push(hero);
      });
    }else{
      this.error = "Такой герой уже существует";
    }
  }

  
  delete(hero: Hero): void {
    this.team!.heroes = this.team!.heroes.filter(h => h !== hero);
    this.teamService.deleteHero(hero.id).subscribe();
  }


  save(): void {
    if (this.team) {
      this.teamService.updateTeam(this.team)
        .subscribe(() => this.goBack());
    }
  }
}
