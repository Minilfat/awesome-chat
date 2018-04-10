'use strict';

class User {

    constructor(id, login, password, alias) {
      this.id = id;
      this.login = login;
      this.password = password;
      this.alias = alias;
    }

    // display() {
    //   return this.login + " " + this.password + " " + this.alias;
    // }

    // getLogin() {
    //   return this.login;
    // }

    // getAlias() {
    //   return this.alias;
    // }

    // getPassword() {
    //   return this.password;
    // }
}

module.exports = User;