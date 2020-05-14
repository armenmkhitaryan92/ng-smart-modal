import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef, EventEmitter,
  Injectable,
  Injector, TemplateRef, Type
} from '@angular/core';
import {NavigationEnd, Router, RouterEvent} from "@angular/router";
import {fromEvent, timer} from "rxjs";
import {delay, distinctUntilChanged, filter, tap, throttleTime} from "rxjs/operators";
import {IModal} from "../interfaces/i-modal";
import {NgModalWrapperComponent} from "../ng-modal-wrapper/ng-modal-wrapper.component";

interface Configs {
  inputs?: object;
  outputs?: object;
  class?: string | string[];
  ignoreWhenRouterChanged?: boolean;
  ignoreBackdropClick?: boolean;
  ignoreBackdrop?: boolean;
  ignoreAnimation?: boolean;
  ignoreEsc?: boolean;
}

interface ModalData {
  modalWrapperRef: ComponentRef<NgModalWrapperComponent>;
  modalWrapperDomElement: HTMLElement;
  componentRef: ComponentRef<any>;
  componentDomElem: HTMLElement;
  configs: Configs;
}

@Injectable({
  providedIn: 'root'
})
export class NgSmartModalService {

  private modals: ModalData[] = [];

  constructor(
    private router: Router,
    private injector: Injector,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.deAttachPopupOnRouteChange();
    this.listenToESC();
  }

  private deAttachPopupOnRouteChange(): void {
    this.router.events
      .pipe(
        filter((e: RouterEvent) => e instanceof NavigationEnd),
        filter(() => !!this.modals.length)
      )
      .subscribe(() => {
        this.modals.forEach((m: ModalData) => {
          if (!m.configs?.ignoreWhenRouterChanged) {
            timer(0)
              .pipe(
                tap(() => m.modalWrapperDomElement.querySelector('.slide').classList.remove('show')),
                delay(500),
                tap(() => this.destroyWrapperComponent(m.modalWrapperRef))
              )
              .subscribe(() => this.modals = this.modals.filter((modal) => modal !== m));
          }
        });
      });
  }

  private listenToESC(): void {
    fromEvent(document, 'keydown')
      .pipe(
        filter(() => !!this.modals.length),
        filter((event: KeyboardEvent) => event.code === 'Escape'),
        filter(() => !this.getModal()?.configs?.ignoreEsc),
        throttleTime(400)
      )
      .subscribe(() => this.deAttach());
  }

  public attach<T>(component: Type<T>, configs?: Configs): IModal<T> {

    const {modalWrapperRef, modalWrapperDomElement} = this.createModalWrapper();

    // 1. Create a component reference from the component
    const componentRef = this.componentFactoryResolver.resolveComponentFactory(component).create(this.injector);

    // 2. Attach the config to the child (inputs and outputs)
    this.attachConfig(configs, componentRef);

    // 3. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(componentRef.hostView);

    // 4. Get DOM element from component
    const componentDomElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0];

    // 5. Append DOM element into wrapper component DOM element
    modalWrapperDomElement.querySelector('.slide_popup').appendChild(componentDomElem);

    this.modals.push({modalWrapperRef, modalWrapperDomElement, componentRef, componentDomElem, configs});

    this.closeModalWrapperComponent(modalWrapperRef);

    document.body.appendChild(this.getModal().modalWrapperDomElement);

    this.setClass(configs?.class);

    this.showPopup(modalWrapperDomElement, configs);

    return {instance: componentRef.instance, closeWrapper$: modalWrapperRef.instance.close$};
  }

  private createModalWrapper() {

    // 1. Create a wrapper component reference from the component
    const modalWrapperRef = this.componentFactoryResolver.resolveComponentFactory(NgModalWrapperComponent).create(this.injector);

    // 2. Attach wrapper component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(modalWrapperRef.hostView);

    // 3. Get wrapper DOM element from component
    const modalWrapperDomElement = (modalWrapperRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    return {modalWrapperRef, modalWrapperDomElement};
  }

  public setClass(classname: string | string[], index = this.lasModalIndex): void {
    classname = classname || 'slide_popup';
    const className: string[] = Array.isArray(classname) ? classname : [classname];
    this.getModal(index).modalWrapperDomElement.querySelector('.slide_popup').classList.add(...className);
  }

  public removeClass(classname: string | string[], index = this.lasModalIndex): void {
    const className: string[] = Array.isArray(classname) ? classname : [classname];
    this.getModal(index).modalWrapperDomElement.querySelector('.slide_popup').classList.remove(...className);
  }

  private closeModalWrapperComponent(modalWrapperRef: ComponentRef<NgModalWrapperComponent>): void {
    const modal: ModalData = this.modals.find((m: ModalData) => m.modalWrapperRef === modalWrapperRef);
    if (!modal?.configs?.ignoreBackdropClick) {
      modalWrapperRef
        .instance
        .close$
        .pipe(distinctUntilChanged())
        .subscribe(() => this.deAttach());
    }
  }

  private attachConfig(configs: Configs, componentRef: any): void {
    const inputs = configs?.inputs || {};
    const outputs = configs?.outputs || {};
    Object.keys(inputs).forEach((key: string) => componentRef.instance[key] = inputs[key]);
    Object.keys(outputs).forEach((key: string) => componentRef.instance[key] = outputs[key]);
  }

  public attachTemplateRef(templateRef: TemplateRef<any>, configs?: Configs): { close$: EventEmitter<void> } {

    const {modalWrapperRef, modalWrapperDomElement} = this.createModalWrapper();

    // Get DOM element from templateRef
    const templateRefDom = templateRef.createEmbeddedView(null).rootNodes[0] as HTMLElement;

    modalWrapperDomElement.querySelector('.slide_popup').appendChild(templateRefDom);

    this.modals.push({modalWrapperRef, modalWrapperDomElement, componentRef: null, componentDomElem: null, configs});

    this.closeModalWrapperComponent(modalWrapperRef);

    document.body.appendChild(modalWrapperDomElement);

    this.setClass(configs?.class);

    this.showPopup(modalWrapperDomElement, configs);

    return {close$: modalWrapperRef.instance.close$};

  }

  public deAttach(index = this.lasModalIndex): void {
    timer(0)
      .pipe(
        tap(() => this.hidePopup(index)),
        delay(400)
      )
      .subscribe(() => this.destroyComponents(index));
  }

  private destroyComponents(index = this.lasModalIndex): void {
    if (this.modals.length) {
      this.destroyWrapperComponent(this.getModal(index).modalWrapperRef);
      this.modals.splice(index, 1);
    }
  }

  private destroyWrapperComponent(modalWrapperRef: ComponentRef<NgModalWrapperComponent>): void {
    this.appRef.detachView(modalWrapperRef.hostView);
    modalWrapperRef.destroy();
  }

  private showPopup(modalWrapperDomElement: HTMLElement, configs: Configs): void {

    const element = modalWrapperDomElement.querySelector('.slide');

    if (configs?.ignoreBackdrop) {
      (element.children[0] as HTMLDivElement).style.backgroundColor = 'initial';
    }

    if (configs?.ignoreAnimation) {
      element.classList.add('disable-animation');
    }

    timer(100)
      .subscribe(() => {
        element.classList.add('show');
        document.body.style.overflow = 'hidden';
      });

  }

  private hidePopup(index = this.lasModalIndex): void {
    if (this.modals.length === 1) {
      document.body.style.cssText = '';
      document.body.removeAttribute('style');
    }
    this.getModal(index)?.modalWrapperDomElement.querySelector('.slide').classList.remove('show');
  }

  private getModal(index = this.lasModalIndex): ModalData {
    return this.modals[index];
  }

  private get lasModalIndex(): number {
    return this.modals.length - 1;
  }
}
