import Service from "./Service";

export default class Genre extends Service {
  static route() {
    return "/api/genre/";
  }
  constructor(doc) {
    super(doc);
  }
  static mutators() {
    return {
      id3_id: Number,
    };
  }
}
