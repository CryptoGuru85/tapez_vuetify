import { AbilityBuilder, Ability } from "@casl/ability";
import store from "../store";

function defineAnonymousRules() {
  const { can, rules } = new AbilityBuilder();
  can("read", "tapes");
  can("read", "tracks");
  can("read", "genres");
  can("read", "comments");
  can("read", "users");

  return rules;
}
function defineUserRules() {
  const { can, rules } = new AbilityBuilder();
  can("update", "users");
  can("create", "tapes");
  can("update", "tapes", { user: () => store.state.user._id });
  can("create", "comments");
  can("update", "users", { _id: () => store.state.user._id });
  can("update", "comments", { user: store.state.user._id });
  can("vote", "tapes");

  return [...defineAnonymousRules(), ...rules];
}

function defineModRules() {
  const { can, rules } = new AbilityBuilder();

  can("update", "tapes");
  can("update", "comments");
  can("lock", "tapes");
  can("delete", "comments");

  return [...defineUserRules(), ...rules];
}
function defineAdminRules() {
  const { can, rules } = new AbilityBuilder();

  can("manage", "all");

  return rules;
}
function getAbilityForUser(user) {
  if (!user || !user.role) {
    return new Ability(defineAnonymousRules());
  }
  switch (user.role) {
    case 1:
      return new Ability(defineUserRules());
    case 2:
      return new Ability(defineModRules());
    case 3:
      return new Ability(defineAdminRules());
    default:
      return new Ability(defineAnonymousRules());
  }
}

export {
  defineAdminRules,
  defineAnonymousRules,
  defineModRules,
  defineUserRules,
  getAbilityForUser,
};
