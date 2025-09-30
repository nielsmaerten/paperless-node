"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuthResource: () => AuthResource,
  CorrespondentsResource: () => CorrespondentsResource,
  DocumentTypesResource: () => DocumentTypesResource,
  DocumentsResource: () => DocumentsResource,
  HttpClient: () => HttpClient,
  PaperlessApiError: () => PaperlessApiError,
  PaperlessClient: () => PaperlessClient,
  TagsResource: () => TagsResource,
  TasksResource: () => TasksResource,
  UsersResource: () => UsersResource,
  buildPath: () => buildPath,
  createOptionsFromEnv: () => createOptionsFromEnv,
  createPaperlessClient: () => createPaperlessClient,
  loadPaperlessEnv: () => loadPaperlessEnv
});
module.exports = __toCommonJS(index_exports);

// src/core/errors.ts
var PaperlessApiError = class _PaperlessApiError extends Error {
  status;
  url;
  method;
  data;
  headers;
  constructor(message, context = {}) {
    super(message);
    this.name = "PaperlessApiError";
    this.status = context.status;
    this.url = context.url;
    this.method = context.method;
    this.data = context.data;
    this.headers = context.headers;
    if (context.cause) {
      this.cause = context.cause;
    }
  }
  static fromAxiosError(error) {
    const message = error.message || "Unexpected Paperless API error";
    return new _PaperlessApiError(message, {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      headers: error.response?.headers,
      cause: error
    });
  }
  static from(error) {
    if (isAxiosError(error)) {
      return _PaperlessApiError.fromAxiosError(error);
    }
    if (error instanceof _PaperlessApiError) {
      return error;
    }
    if (error instanceof Error) {
      return new _PaperlessApiError(error.message, { cause: error });
    }
    return new _PaperlessApiError("Unknown Paperless API error", { data: error });
  }
};
var isAxiosError = (error) => typeof error === "object" && error !== null && "isAxiosError" in error;

// src/core/httpClient.ts
var import_axios = __toESM(require("axios"), 1);
var import_qs = __toESM(require("qs"), 1);
var HttpClient = class {
  instance;
  token;
  tokenPrefix;
  headerName;
  constructor({
    baseURL,
    token,
    tokenPrefix,
    headerName,
    timeout = 1e4,
    userAgent = "paperless-node",
    axiosConfig
  }) {
    this.instance = import_axios.default.create({
      baseURL,
      timeout,
      headers: {
        Accept: "application/json",
        "User-Agent": userAgent,
        ...axiosConfig?.headers
      },
      paramsSerializer: (params) => import_qs.default.stringify(params, {
        arrayFormat: "comma",
        skipNulls: true,
        encodeValuesOnly: true
      }),
      ...axiosConfig
    });
    this.token = token ?? void 0;
    this.tokenPrefix = tokenPrefix ?? (token ? "Token" : void 0);
    this.headerName = headerName ?? "Authorization";
    this.instance.interceptors.request.use((config) => {
      if (this.token) {
        const headerValue = this.tokenPrefix ? `${this.tokenPrefix} ${this.token}` : this.token;
        const headers = config.headers instanceof import_axios.AxiosHeaders ? config.headers : new import_axios.AxiosHeaders(config.headers);
        if (!headers.has(this.headerName)) {
          headers.set(this.headerName, headerValue);
        }
        config.headers = headers;
      }
      return config;
    });
  }
  setToken(token, options) {
    this.token = token ?? void 0;
    if (options?.prefix !== void 0) {
      this.tokenPrefix = options.prefix ?? void 0;
    }
  }
  clearToken() {
    this.token = void 0;
  }
  async request(config) {
    try {
      const response = await this.instance.request(config);
      return response.data;
    } catch (error) {
      throw PaperlessApiError.from(error);
    }
  }
  get(url, config = {}) {
    return this.request({ ...config, method: "GET", url });
  }
  post(url, data, config = {}) {
    return this.request({ ...config, method: "POST", url, data });
  }
  put(url, data, config = {}) {
    return this.request({ ...config, method: "PUT", url, data });
  }
  patch(url, data, config = {}) {
    return this.request({ ...config, method: "PATCH", url, data });
  }
  delete(url, config = {}) {
    return this.request({ ...config, method: "DELETE", url });
  }
  async *iteratePaginated(config) {
    let nextConfig = { ...config };
    while (nextConfig) {
      const page = await this.request(nextConfig);
      for (const item of page.results) {
        yield item;
      }
      if (!page.next) {
        break;
      }
      nextConfig = {
        ...config,
        url: page.next,
        params: void 0,
        baseURL: void 0
      };
    }
  }
  async listAll(config) {
    const items = [];
    for await (const item of this.iteratePaginated(config)) {
      items.push(item);
    }
    return items;
  }
};

// src/resources/auth.ts
var AuthResource = class {
  constructor(http) {
    this.http = http;
  }
  login(body) {
    return this.http.post("/api/token/", body);
  }
  regenerateProfileToken() {
    return this.http.post("/api/profile/generate_auth_token/");
  }
};

// src/utils/url.ts
var buildPath = (template, params) => {
  if (!params) {
    const missing = template.match(/\{(\w+)\}/);
    if (missing) {
      throw new Error(`Missing path parameter: ${missing[1]}`);
    }
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    if (!(key in params)) {
      throw new Error(`Missing path parameter: ${key}`);
    }
    const value = params[key];
    if (value === void 0 || value === null) {
      throw new Error(`Path parameter '${key}' is ${value === null ? "null" : "undefined"}`);
    }
    return encodeURIComponent(String(value));
  });
};

// src/resources/correspondents.ts
var CorrespondentsResource = class {
  constructor(http) {
    this.http = http;
  }
  list(query) {
    return this.http.get("/api/correspondents/", { params: query });
  }
  listAll(query) {
    return this.http.listAll({
      method: "GET",
      url: "/api/correspondents/",
      params: query
    });
  }
  retrieve(id) {
    const url = buildPath("/api/correspondents/{id}/", { id });
    return this.http.get(url);
  }
  create(body) {
    return this.http.post("/api/correspondents/", body);
  }
  update(id, body) {
    const url = buildPath("/api/correspondents/{id}/", { id });
    return this.http.put(url, body);
  }
  partialUpdate(id, body) {
    const url = buildPath("/api/correspondents/{id}/", { id });
    return this.http.patch(url, body);
  }
  remove(id) {
    const url = buildPath("/api/correspondents/{id}/", { id });
    return this.http.delete(url);
  }
};

// src/resources/documentTypes.ts
var DocumentTypesResource = class {
  constructor(http) {
    this.http = http;
  }
  list(query) {
    return this.http.get("/api/document_types/", { params: query });
  }
  listAll(query) {
    return this.http.listAll({
      method: "GET",
      url: "/api/document_types/",
      params: query
    });
  }
  retrieve(id) {
    const url = buildPath("/api/document_types/{id}/", { id });
    return this.http.get(url);
  }
  create(body) {
    return this.http.post("/api/document_types/", body);
  }
  update(id, body) {
    const url = buildPath("/api/document_types/{id}/", { id });
    return this.http.put(url, body);
  }
  partialUpdate(id, body) {
    const url = buildPath("/api/document_types/{id}/", { id });
    return this.http.patch(url, body);
  }
  remove(id) {
    const url = buildPath("/api/document_types/{id}/", { id });
    return this.http.delete(url);
  }
};

// src/resources/documents.ts
var import_form_data = __toESM(require("form-data"), 1);
var DocumentsResource = class {
  constructor(http) {
    this.http = http;
  }
  list(query) {
    return this.http.get("/api/documents/", { params: query });
  }
  async *iterate(query) {
    yield* this.http.iteratePaginated({
      method: "GET",
      url: "/api/documents/",
      params: query
    });
  }
  listAll(query) {
    return this.http.listAll({
      method: "GET",
      url: "/api/documents/",
      params: query
    });
  }
  retrieve(id, query) {
    const url = buildPath("/api/documents/{id}/", { id });
    return this.http.get(url, { params: query });
  }
  update(id, body) {
    const url = buildPath("/api/documents/{id}/", { id });
    return this.http.put(url, body);
  }
  partialUpdate(id, body) {
    const url = buildPath("/api/documents/{id}/", { id });
    return this.http.patch(url, body);
  }
  remove(id) {
    const url = buildPath("/api/documents/{id}/", { id });
    return this.http.delete(url);
  }
  async upload(options) {
    const form = new import_form_data.default();
    form.append("document", options.document);
    if (options.title) form.append("title", options.title);
    if (options.correspondent !== void 0 && options.correspondent !== null) {
      form.append("correspondent", String(options.correspondent));
    }
    if (options.document_type !== void 0 && options.document_type !== null) {
      form.append("document_type", String(options.document_type));
    }
    if (options.storage_path !== void 0 && options.storage_path !== null) {
      form.append("storage_path", String(options.storage_path));
    }
    if (options.tags) {
      for (const tag of options.tags) {
        form.append("tags", String(tag));
      }
    }
    if (options.archive_serial_number !== void 0 && options.archive_serial_number !== null) {
      form.append("archive_serial_number", String(options.archive_serial_number));
    }
    if (options.custom_fields) {
      for (const field of options.custom_fields) {
        form.append("custom_fields", String(field));
      }
    }
    if (options.from_webui !== void 0) {
      form.append("from_webui", String(options.from_webui));
    }
    if (options.created) {
      form.append("created", options.created);
    }
    return this.http.post("/api/documents/post_document/", form, {
      headers: form.getHeaders()
    });
  }
  async download(id, { original, responseType = "arraybuffer" } = {}) {
    const url = buildPath("/api/documents/{id}/download/", { id });
    const params = original === void 0 ? void 0 : { original };
    if (responseType === "stream") {
      return this.http.get(url, {
        params,
        responseType
      });
    }
    return this.http.get(url, {
      params,
      responseType
    });
  }
  history(id, query) {
    const url = buildPath("/api/documents/{id}/history/", { id });
    return this.http.get(url, { params: query });
  }
  notes(id, query) {
    const url = buildPath("/api/documents/{id}/notes/", { id });
    return this.http.get(url, { params: query });
  }
  addNote(id, body) {
    const url = buildPath("/api/documents/{id}/notes/", { id });
    return this.http.post(url, body);
  }
  removeNote(id, noteId) {
    const url = buildPath("/api/documents/{id}/notes/", { id });
    const params = { id: noteId };
    return this.http.delete(url, { params });
  }
  sendByEmail(id, body) {
    const url = buildPath("/api/documents/{id}/email/", { id });
    return this.http.post(url, body);
  }
  selectionData(body) {
    return this.http.post("/api/documents/selection_data/", body);
  }
};

// src/resources/tags.ts
var TagsResource = class {
  constructor(http) {
    this.http = http;
  }
  list(query) {
    return this.http.get("/api/tags/", { params: query });
  }
  listAll(query) {
    return this.http.listAll({
      method: "GET",
      url: "/api/tags/",
      params: query
    });
  }
  retrieve(id) {
    const url = buildPath("/api/tags/{id}/", { id });
    return this.http.get(url);
  }
  create(body) {
    return this.http.post("/api/tags/", body);
  }
  update(id, body) {
    const url = buildPath("/api/tags/{id}/", { id });
    return this.http.put(url, body);
  }
  partialUpdate(id, body) {
    const url = buildPath("/api/tags/{id}/", { id });
    return this.http.patch(url, body);
  }
  remove(id) {
    const url = buildPath("/api/tags/{id}/", { id });
    return this.http.delete(url);
  }
};

// src/resources/tasks.ts
var TasksResource = class {
  constructor(http) {
    this.http = http;
  }
  list(query) {
    return this.http.get("/api/tasks/", { params: query });
  }
  retrieve(id, query) {
    return this.http.get(`/api/tasks/${id}/`, { params: query });
  }
  acknowledge(body, query) {
    return this.http.post("/api/tasks/acknowledge/", body, {
      params: query
    });
  }
  run(body, query) {
    return this.http.post("/api/tasks/run/", body, {
      params: query
    });
  }
};

// src/resources/users.ts
var UsersResource = class {
  constructor(http) {
    this.http = http;
  }
  list(query) {
    return this.http.get("/api/users/", { params: query });
  }
  listAll(query) {
    return this.http.listAll({
      method: "GET",
      url: "/api/users/",
      params: query
    });
  }
  retrieve(id) {
    const url = buildPath("/api/users/{id}/", { id });
    return this.http.get(url);
  }
  create(body) {
    return this.http.post("/api/users/", body);
  }
  update(id, body) {
    const url = buildPath("/api/users/{id}/", { id });
    return this.http.put(url, body);
  }
  partialUpdate(id, body) {
    const url = buildPath("/api/users/{id}/", { id });
    return this.http.patch(url, body);
  }
  remove(id) {
    const url = buildPath("/api/users/{id}/", { id });
    return this.http.delete(url);
  }
  deactivateTotp(id, body) {
    const url = buildPath("/api/users/{id}/deactivate_totp/", { id });
    return this.http.post(url, body);
  }
};

// src/core/paperlessClient.ts
var PaperlessClient = class {
  http;
  documents;
  documentTypes;
  correspondents;
  tags;
  tasks;
  users;
  auth;
  constructor(options) {
    this.http = new HttpClient(options);
    this.documents = new DocumentsResource(this.http);
    this.documentTypes = new DocumentTypesResource(this.http);
    this.correspondents = new CorrespondentsResource(this.http);
    this.tags = new TagsResource(this.http);
    this.tasks = new TasksResource(this.http);
    this.users = new UsersResource(this.http);
    this.auth = new AuthResource(this.http);
  }
  setToken(token, options) {
    this.http.setToken(token, options);
  }
  clearToken() {
    this.http.clearToken();
  }
};
var createPaperlessClient = (options) => new PaperlessClient(options);

// src/utils/env.ts
var import_dotenv = require("dotenv");
var loadPaperlessEnv = ({ dotenv = true } = {}) => {
  if (dotenv) {
    const options = typeof dotenv === "object" ? dotenv : void 0;
    (0, import_dotenv.config)(options);
  }
  return {
    baseURL: process.env.PAPERLESS_BASE_URL ?? process.env.PAPERLESS_URL,
    token: process.env.PAPERLESS_TOKEN ?? process.env.PAPERLESS_API_TOKEN,
    tokenPrefix: process.env.PAPERLESS_TOKEN_PREFIX,
    headerName: process.env.PAPERLESS_AUTH_HEADER
  };
};
var createOptionsFromEnv = ({ defaults, dotenv } = {}) => {
  const envConfig = loadPaperlessEnv({ dotenv });
  const baseURL = envConfig.baseURL ?? defaults?.baseURL;
  if (!baseURL) {
    throw new Error("Paperless base URL is required. Set PAPERLESS_BASE_URL or provide baseURL.");
  }
  return {
    ...defaults,
    baseURL,
    token: envConfig.token ?? defaults?.token,
    tokenPrefix: envConfig.tokenPrefix ?? defaults?.tokenPrefix,
    headerName: envConfig.headerName ?? defaults?.headerName
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthResource,
  CorrespondentsResource,
  DocumentTypesResource,
  DocumentsResource,
  HttpClient,
  PaperlessApiError,
  PaperlessClient,
  TagsResource,
  TasksResource,
  UsersResource,
  buildPath,
  createOptionsFromEnv,
  createPaperlessClient,
  loadPaperlessEnv
});
//# sourceMappingURL=index.cjs.map