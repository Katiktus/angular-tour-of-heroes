import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";

import { AuthenticationService } from "../_services/authentication.service";
import { RoleType } from "../_models/role";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}
  autorized!: Boolean;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      this.autorized = false;

      if (
        route.data['role'] &&
        currentUser.roles!.find(x => x.roletype === route.data["role"][0])
      ) {
        this.autorized = true;
      }
      if (!route.data["role"]) {
        this.autorized = true;
      }

      if (this.autorized) {
        return true;
      } else {
        this.router.navigate(["/"]);
        return false;
      }
    }

    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
