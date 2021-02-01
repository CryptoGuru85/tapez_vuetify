import Service from "./Service";

export default class Report extends Service {
  static route() {
    return "/api/report/";
  }
  constructor(doc) {
    super(doc);
  }
  create() {
    throw new Error("Reports must be created via Tape Service");
  }
  approve() {
    this.setState({ loading: true });
    return this.custom("approve", {
      method: "post",
    }).then((doc) => {
      this.set(doc);
      this.setState({ saving: false, loaded: true, active: false });
      return this;
    });
  }
  approveAndLock(reason = "") {
    this.setState({ loading: true });
    return this.custom("approve", {
      method: "post",
      data: {
        lock: true,
        reason,
      },
    }).then((doc) => {
      this.set(doc);
      this.setState({ saving: false, loaded: true, active: false });
      return this;
    });
  }
  reject() {
    this.setState({ loading: true });
    return this.custom("reject", {
      method: "post",
    }).then((doc) => {
      this.set(doc);
      this.setState({ saving: false, loaded: true, active: false });
      return this;
    });
  }
  static get reasonMnemonics() {
    return {
      1: "COPYRIGHT_MATERIAL",
      2: "COPYRIGHT_CLAIM",
      3: "INAPPROPRIATE_CONTENT",
      4: "HATE_SPEECH",
      5: "SPAM",
      6: "OTHER",
    };
  }
  get reasonMnemonic() {
    return this.constructor.reasonMnemonics[this.reason];
  }
}
