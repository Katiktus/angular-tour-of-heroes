import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { TeamService } from '../_services/team.service';
import { Team } from '../_models/team';

@Component({
  selector: 'app-team-detail-ro',
  templateUrl: './team-detail-ro.component.html',
  styleUrls: ['./team-detail-ro.component.css']
})
export class TeamDetailRoComponent implements OnInit {
  @Input() team!: Team;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getTeam();
  }

  getTeam(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.teamService.getTeam(id)
      .subscribe(team => this.team = team);
  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.teamService.updateTeam(this.team)
      .subscribe(() => this.goBack());
  }
}
