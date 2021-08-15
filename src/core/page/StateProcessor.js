import {debounce} from "@core/utils";

export class StateProcessor {
  constructor(client, delay = 300) {
    this.client = client;
    // client DIP реализация
    this.listen = debounce(this.listen.bind(this), delay);
  }

  listen(state) {
    this.client.save(state);
  }

  get() {
    return this.client.get();
  }
}
