'use strict';

class User {

    constructor(login, password, alias) {
      this.login = login;
      this.password = password;
      this.alias = alias;
    }

    display() {
      return this.login + " " + this.password + " " + this.alias;
    }

    getLogin() {
      return this.login;
    }

    getPassword() {
      return this.password;
    }
}

module.exports = User;