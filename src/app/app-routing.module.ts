import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { HeroesComponent } from "./heroes/heroes.component";
import { HeroDetailComponent } from "./hero-detail/hero-detail.component";
import { HeroDetailRoComponent } from "./hero-detail-ro/hero-detail-ro.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./_helpers/auth.guard";
import { RoleType } from "./_models/role";
import { TeamsComponent } from "./teams/teams.component";
import { TeamDetailComponent } from "./team-detail/team-detail.component";
import { TeamDetailRoComponent } from "./team-detail-ro/team-detail-ro.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full"
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { role: [RoleType.HeroesReader] }
  },
  {
    path: "detail/:id",
    component: HeroDetailComponent,
    canActivate: [AuthGuard],
    data: { role: [RoleType.HeroesWriter] }
  },
  {
    path: "detailro/:id",
    component: HeroDetailRoComponent,
    canActivate: [AuthGuard],
    data: { role: [RoleType.HeroesReader] }
  },
  {
    path: "team-detail/:id",
    component: TeamDetailComponent,
    canActivate: [AuthGuard],
    data: { role: [RoleType.HeroesWriter] }
  },
  {
    path: "team-detailro/:id",
    component: TeamDetailRoComponent,
    canActivate: [AuthGuard],
    data: { role: [RoleType.HeroesReader] }
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "heroes",
    component: HeroesComponent,
    canActivate: [AuthGuard],
    data: { role: [RoleType.HeroesReader] }
  },
  {
    path: "teams",
    component: TeamsComponent,
    canActivate: [AuthGuard],
    data: { role: [RoleType.HeroesReader] }
  },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}