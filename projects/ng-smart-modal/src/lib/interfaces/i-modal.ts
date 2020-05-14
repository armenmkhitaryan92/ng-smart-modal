import {EventEmitter} from '@angular/core';

export interface IModal<T> {
  instance: T;
  closeWrapper$: EventEmitter<void>;
}
