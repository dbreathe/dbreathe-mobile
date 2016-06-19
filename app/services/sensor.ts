import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class SensorService {
  private listeners: any;
  private socket: WebSocket;

  constructor() {
    this.listeners = [];

    this.socket = new WebSocket('ws://192.168.88.251:81');
    this.socket.onopen = () => console.log('CONNECTED!!!');
    this.socket.onmessage = (msg) => this.onMessage(msg);
  }

  addListener(listener: any) {
    this.listeners.push(listener);
  }

  onMessage(msg: any) {
    for (let listener of this.listeners) {
      listener(msg.data);
    }
  }
}
