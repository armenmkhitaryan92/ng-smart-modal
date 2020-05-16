import {ComponentRef} from "@angular/core";
import {Configs} from "./configs";
import {Wrapper} from "../types/wrapper";

export interface ModalData {
  modalWrapperRef: Wrapper;
  modalWrapperDomElement: HTMLElement;
  componentRef: ComponentRef<any>;
  componentDomElem: HTMLElement;
  configs: Configs;
}
