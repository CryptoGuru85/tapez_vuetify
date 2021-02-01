import Service from "./Service";
import i18n from "@/i18n";

export default class User extends Service {
  static route() {
    return "/api/user/";
  }
  constructor(doc) {
    super(doc);
  }
  static mutators() {
    return {
      id3_id: Number,
    };
  }
  ban(reason = "") {
    this.custom("ban", {
      method: "post",
      data: {
        reason: reason,
      },
    }).then((doc) => {
      this.set(doc);
      this.setState({ saving: false, loaded: true, active: false });
      return this;
    });
  }
  unban() {
    this.custom("unban", {
      method: "post",
    }).then((doc) => {
      this.set(doc);
      this.setState({ saving: false, loaded: true, active: false });
      return this;
    });
  }
  fullname(item = this) {
    return `${item.firstname} ${item.lastname}`;
  }
  static get status() {
    return {
      BANNED: 0,
      DEFAULT: 1,
    };
  }
  static get role() {
    return {
      ANONYMOUS: 0,
      USER: 1,
      MODERATOR: 2,
      ADMIN: 3,
    };
  }
  roleName(role = this.role) {
    return Object.entries(this.constructor.role).find(
      (item) => item[1] == role
    )[0];
  }
  localizedRoleName(role = this.role) {
    return i18n.t(`model.user.role.${this.roleName(role)}`);
  }
  statusName(status = this.status) {
    return Object.entries(this.constructor.status).find(
      (item) => item[1] == status
    )[0];
  }
  localizedStatusName(status = this.status) {
    return i18n.t(`model.user.status.${this.statusName(status)}`);
  }
}
