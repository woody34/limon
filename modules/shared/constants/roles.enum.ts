// using flagged enum to support many different role combos and keep the user jwt lightweight

export enum Roles {
  None = 0,

  General = 1 << 0,
  ManageUsers = 1 << 1,
  Write = 1 << 2,
  Special = 1 << 3,

  Root = ~(~0 << 4),
}
