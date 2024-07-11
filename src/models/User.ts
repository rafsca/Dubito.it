export class ModelUser {
  primaryKeyUser: string;
  username: string;
  email: string;
  password: string;

  constructor(username: string, email: string, password: string) {
    this.primaryKeyUser = Math.random().toString(20).slice(2);
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
