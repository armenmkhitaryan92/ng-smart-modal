import {Configs} from './configs';
import {Wrapper} from '../types/wrapper';
import {ComponentRef} from '@angular/core';

export interface ModalData {
  modalWrapperRef: Wrapper;
  modalWrapperDomElement: HTMLElement;
  componentRef: ComponentRef<any> | null;
  componentDomElem: HTMLElement | null;
  configs?: Configs;
}
