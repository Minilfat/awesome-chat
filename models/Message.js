'use strict';

class Message {

    constructor(id, sender, text, time) {
      this.id = id;
      this.sender = sender;
      this.text = text;
      this.time = time;
    }
}

module.exports = Message;