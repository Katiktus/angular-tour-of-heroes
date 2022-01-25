import { Component, OnInit } from '@angular/core';
import { RoleType } from '../_models/role';
import { Team } from '../_models/team';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { InMemoryDataService } from '../_services/in-memory-data.service';
import { TeamService } from '../_services/team.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  teams!: Team[];
  currentUser!: User;
  error!: string;
  
  constructor(
    private teamService: TeamService,
    private authenticationService: AuthenticationService, 
    private inMemoryDataService: InMemoryDataService 
  ) { 
    this.authenticationService.currentUser.subscribe(
      x => (this.currentUser = x)
    );
  }

  ngOnInit(){
    this.getTeams();
  }

  getHeroes(): void {
    this.teamService.getTeams().subscribe(teams => (this.teams = teams));
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
    if(!this.inMemoryDataService.isInDb(this.teams, name)){
      this.teamService.addTeam({ name } as Team).subscribe(team => {
      this.teams.push(team);
      });
    }else{
      this.error = "Такой герой уже существует";
    }
  }

  delete(team: Team): void {
    this.teams = this.teams.filter(t => t !== team);
    this.teamService.deleteTeam(team.id).subscribe();
  }

}

