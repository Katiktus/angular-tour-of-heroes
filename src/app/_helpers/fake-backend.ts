import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { delay, mergeMap, materialize, dematerialize } from "rxjs/operators";
import { User } from "../_models/user";
import { Role, RoleType } from "../_models/role";

const admin: Role[] = [
  { roletype: RoleType.HeroesReader },
  { roletype: RoleType.HeroesWriter }
];
const user: Role[] = [{ roletype: RoleType.HeroesReader }];

const users: User[] = [
  {
    id: 1,
    username: "a",
    password: "a",
    firstName: "Admin",
    lastName: "",
    roles: admin
  },
  {
    id: 2,
    username: "u",
    password: "u",
    firstName: "User",
    lastName: "",
    roles: user
  }
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith("/users/authenticate") && method === "POST":
          return authenticate();
        case url.endsWith("/users") && method === "GET":
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === "GET":
          return getUserById();
        default:
          return next.handle(request);
      }
    }

    function authenticate() {
      const { username, password } = body;
      const user = users.find(
        x => x.username === username && x.password === password
      );
      if (!user) return error("Username or password is incorrect");
      return ok({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        token: `fake-jwt-token.${user.id}`
      });
    }

    function getUsers() {
      if (!isWriter()) return unauthorized();
      return ok(users);
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized();

      if (!isWriter() && currentUser()!.id !== idFromUrl())
        return unauthorized();

      const user = users.find(x => x.id === idFromUrl());
      return ok(user);
    }

    function ok(body: any) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: "unauthorized" } });
    }

    function error(message: string) {
      return throwError({ status: 400, error: { message } });
    }

    function isLoggedIn() {
      const authHeader = headers.get("Authorization") || "";
      return authHeader.startsWith("Bearer fake-jwt-token");
    }

    function isWriter() {
      return (
        isLoggedIn() &&
        currentUser()!.roles!.find(x => x.roletype === RoleType.HeroesWriter)
      );
    }

    function currentUser() {
      if (!isLoggedIn()) return;
      const id = parseInt(headers.get("Authorization")!.split(".")[1]);
      return users.find(x => x.id === id);
    }

    function idFromUrl() {
      const urlParts = url.split("/");
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export const fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
