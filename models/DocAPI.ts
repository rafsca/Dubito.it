export class DocAPI {
  path: string;
  method: string;
  authenticated: boolean;
  constructor(path: string, method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", authenticated: boolean) {
    this.path = `/api${path}`;
    this.method = method;
    this.authenticated = authenticated;
  }
}
