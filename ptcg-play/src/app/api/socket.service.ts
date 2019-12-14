import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';
import {ApiError, ApiErrorEnum} from './api.error';
import {timeout, catchError} from 'rxjs/operators';

interface SocketResponse<T> {
  message: string;
  data?: T;
}

@Injectable()
export class SocketService {

  public socket: SocketIOClient.Socket;
  private callbacks: {event: string, fn: any}[] = [];
  private enabled = false;
  private connectionSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.socket = io.connect(environment.apiUrl, {
      autoConnect: false,
      query: {}
    });

    this.socket.on('connect', () => this.connectionSubject.next(true));
    this.socket.on('disconnect', () => this.connectionSubject.next(false));
  }

  public enable(authToken: string) {
    if (this.enabled) {
      this.socket.disconnect();
    }

    (this.socket.io.opts.query as any).token = authToken;
    this.socket.connect();
    this.enabled = true;
  }

  public disable() {
    this.off();
    this.socket.disconnect();
    this.enabled = false;
  }

  public emit<T, R>(message: string, data?: T): Observable<R> {
    return new Observable<R>(observer => {

      this.socket.emit(message, data, (response: SocketResponse<R>) => {
        if (response && response.message !== 'ok') {
          observer.error(new ApiError(ApiErrorEnum.ERROR_SOCKET, String(response.data)));
          observer.complete();
          return;
        }

        observer.next(response.data);
        observer.complete();
      });

    }).pipe(
      timeout(environment.timeout),
      catchError(response => {
        const apiError = ApiError.fromError(response);
        return throwError(apiError);
      })
    );
  }

  public on<T>(event: string, fn: (data: T) => void): void {
    const callback = {event, fn: fn.bind(this)};
    this.callbacks.push(callback);
    this.socket.on(event, callback.fn);
  }

  public off(message?: string): void {
    this.callbacks = this.callbacks.filter(callback => {
      if (message === undefined || message === callback.event) {
        this.socket.off(callback.event, callback.fn);
        return false;
      }
      return true;
    });
  }

  get connection(): Observable<boolean> {
    return this.connectionSubject.asObservable();
  }

  get isEnabled(): boolean {
    return this.enabled;
  }

  get isConnected(): boolean {
    return this.socket.connected;
  }

}
