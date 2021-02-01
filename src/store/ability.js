import { defineAnonymousRules } from "../roles/roles";

export default (store) => {
  const ability = store.getters.ability;

  ability.update(store.state.rules);

  return store.subscribe((mutation) => {
    switch (mutation.type) {
      case "SET_RULES":
        if (mutation.payload) {
          ability.update(mutation.payload);
        } else {
          ability.update(defineAnonymousRules());
        }
        break;
    }
  });
};
