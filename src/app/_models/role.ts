export class Role {
    roletype! : RoleType;
}
export enum RoleType
{
  HeroesReader = 'HeroesReader',
  HeroesWriter = 'HeroesWriter'
}