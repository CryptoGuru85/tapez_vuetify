import Service from "./Service";

export default class Track extends Service {
  static route() {
    return "/api/track/";
  }
  constructor(doc) {
    super(doc);
  }
  mutators() {
    return {};
  }
}
