import Axios from "axios";
import apiURL from "../util/apiURL";
import store from "@/store/index";
import omit from "lodash/omit";
import cloneDeep from "lodash/cloneDeep";

export default class Service {
  constructor(doc, options) {
    const ignoreFields = this.constructor.ignoreFields();
    const mutators = this.constructor.mutators();
    const proxy = new Proxy(this, {
      set(obj, prop, value) {
        if (!ignoreFields.includes[prop]) {
          obj.setState({
            active: true,
          });
        }
        if (mutators[prop]) {
          obj[prop] = mutators[prop](value);
        } else obj[prop] = value;
        return true;
      },
    });
    if (typeof doc === "string") {
      proxy._id = doc;
    } else Object.assign(this, doc);
    proxy.$ = cloneDeep(this);
    proxy.$options = this.constructor.getOptions(options);
    proxy.setState({
      loading: false,
      loaded: false,
      saving: false,
      active: false,
      deleted: false,
    });
    return proxy;
  }
  static route() {
    return "/api/model/";
  }
  static mutators() {
    return {};
  }
  setState(state) {
    this.$state = Object.assign({}, this.$state, state);
  }
  static getOptions(merge) {
    return { showSnackbar: true, silent: false, ...merge };
  }
  static ignoreFields() {
    return [
      "get",
      "save",
      "sync",
      "discard",
      "delete",
      "create",
      "applyDefaultHandlers",
      "toPlain",
      "$",
      "$state",
      "$options",
      "setState",
    ];
  }
  static getSingle(id, options = this.getOptions(options)) {
    return Axios.get(apiURL(this.route(), id))
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (options.showSnackbar) store.dispatch("ajaxError", err);
        if (!options.silent) throw err;
      })
      .then((doc) => {
        const self = new this(doc);
        self.setState({
          loaded: true,
          loading: false,
          deleted: false,
          active: false,
        });
        return self;
      });
  }
  static getQuery(query, options = this.getOptions(options)) {
    return Axios.get(apiURL(this.route(), query))
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        if (options.showSnackbar) store.dispatch("ajaxError", err);
        if (!options.silent) throw err;
      })
      .then((coll) => {
        if (coll.docs)
          return {
            ...coll,
            docs: coll.docs.map((doc) => new this(doc)),
          };
        return {
          docs: coll.map((doc) => new this(doc)),
        };
      });
  }
  static get(idOrQuery, options) {
    if (idOrQuery instanceof Array) return this.getQuery(idOrQuery, options);
    return this.getSingle(idOrQuery, options);
  }
  get(idOrQuery, options = this.$options) {
    return this.constructor
      .get(idOrQuery, options)
      .then((self) => this.set(self));
  }
  save() {
    this.setState({ saving: true });
    if (!this._id) {
      this.create();
      return;
    }
    this.applyDefaultHandlers(
      Axios.patch(apiURL(this.constructor.route(), this._id), this.toPlain())
    ).then(() => {
      this.setState({
        saving: false,
        loaded: true,
        active: false,
        deleted: false,
      });
      return this;
    });
  }
  sync(options) {
    return this.get(this._id, options);
  }
  discard() {
    // eslint-disable-next-line no-unused-vars
    const { $, $state, ...self } = this;
    Object.assign(this, self);
    this.setState({ active: false });
  }
  delete(payload = null) {
    this.setState({
      saving: true,
    });
    return this.applyDefaultHandlers(
      Axios.delete(apiURL(this.constructor.route(), this._id), {
        data: payload,
      })
    ).then(() => {
      this.setState({
        saving: false,
        loaded: false,
        active: false,
        deleted: true,
      });
      return this;
    });
  }
  create() {
    this.setState({
      saving: true,
    });
    this.applyDefaultHandlers(
      Axios.post(apiURL(this.constructor.route()), this.toPlain())
    ).then(() => {
      this.setState({
        saving: false,
        loaded: true,
        active: false,
        deleted: false,
      });
      return this;
    });
  }
  custom(route, request) {
    const defaults = {
      method: "get",
    };
    return Axios.request({
      ...defaults,
      ...request,
      url: `${this.constructor.route()}${this._id}/${route}`,
    })
      .then((response) => response.data)
      .catch((err) => {
        if (this.$options.showSnackbar) store.dispatch("ajaxError", err);
        if (!this.$options.silent) throw err;
      });
  }
  applyDefaultHandlers(promise) {
    return promise
      .then((response) => response.data)
      .catch((err) => {
        if (this.$options.showSnackbar) store.dispatch("ajaxError", err);
        if (!this.$options.silent) throw err;
      })
      .then((doc) => this.set(doc));
  }
  set(props) {
    Object.assign(this, props);
    this.$ = cloneDeep(this);
  }
  toPlain() {
    return omit(this, this.constructor.ignoreFields());
  }
}
