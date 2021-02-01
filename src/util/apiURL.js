export default (relativePath, params) => {
  let query = "";
  if (params && params instanceof Array) {
    query = "?";
    for (let param of params) {
      if (param.length > 2) query += `${param[0]}${param[1]}${param[2]}&`;
      else query += `${param[0]}=${param[1]}&`;
    }
  } else {
    query = params || "";
  }
  return new URL(relativePath + query, process.env.VUE_APP_API_BASE_URL).href;
};
