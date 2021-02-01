import Service from "./Service";

export default class Tape extends Service {
  static route() {
    return "/api/tape/";
  }
  static mutators() {
    return {};
  }
  constructor(doc) {
    super(doc);
  }
  async save() {
    delete this.tracks;
    return super.save();
  }
  lock(reason = "") {
    return this.custom(`lock`, {
      method: "post",
      data: { reason },
    }).then((doc) => {
      this.set(doc);
      this.setState({ saving: false, loaded: true, active: false });
      return this;
    });
  }
  unlock() {
    return this.custom("unlock", {
      method: "post",
    }).then((doc) => {
      this.set(doc);
      this.setState({ saving: false, loaded: true, active: false });
      return this;
    });
  }
  report(report) {
    return this.custom("report", {
      method: "post",
      data: report,
    }).then((doc) => {
      this.setState({ saving: false, loaded: true, active: false });
      return doc;
    });
  }
  getOtherTapesByArtist(
    options = {
      page: 1,
      limit: 6,
    }
  ) {
    return Tape.get([
      ["artist", this.artist._id],
      ["limit", options.limit],
      ["page", options.page],
      ["_id", "!=", this._id],
    ]);
  }
}
