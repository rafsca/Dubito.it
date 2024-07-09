export class ModelUser {
  primaryKeyUser: number;
  username: string;
  email: string;
  password: string;

  constructor(username: string, email: string, password: string) {
    this.primaryKeyUser = Math.random();
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
