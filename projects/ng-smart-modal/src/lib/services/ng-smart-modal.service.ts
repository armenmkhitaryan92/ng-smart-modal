import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  EventEmitter,
  Injectable,
  Injector,
  Optional,
  TemplateRef,
  Type
} from '@angular/core';
import {fromEvent, timer} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {delay, distinctUntilChanged, filter, tap, throttleTime} from 'rxjs/operators';
import {NgModalWrapperComponent} from '../ng-modal-wrapper/ng-modal-wrapper.component';

export interface IModal<T> {
  instance: T;
  closeWrapper$: EventEmitter<void>;
}

interface Configs {
  inputs?: object;
  outputs?: object;
  class?: string | string[];
  ignoreWhenRouterChanged?: boolean;
  ignoreBackdropClick?: boolean;
  ignoreBackdrop?: boolean;
  ignoreAnimation?: boolean;
  ignoreEsc?: boolean;
  topPosition?: string;
}

interface ModalData {
  modalWrapperRef: Wrapper;
  modalWrapperDomElement: HTMLElement;
  componentRef: ComponentRef<any> | null;
  componentDomElem: HTMLElement | null;
  configs?: Configs;
}

type Wrapper = ComponentRef<NgModalWrapperComponent>;

const delayTime = 400;

@Injectable({
  providedIn: 'root'
})
export class NgSmartModalService {

  private modals: ModalData[] = [];

  constructor(
    @Optional() private router: Router,
    private injector: Injector,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.deAttachPopupOnRouteChange();
    this.listenToESC();
  }

  private deAttachPopupOnRouteChange(): void {
    this.router?.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        filter(() => !!this.modals.length)
      )
      .subscribe(() => {
        this.modals.forEach((m: ModalData) => {
          if (!m.configs?.ignoreWhenRouterChanged) {
            timer(0)
              .pipe(
                tap(() => m.modalWrapperDomElement.querySelector('.slide')?.classList.remove('show')),
                delay(delayTime),
                tap(() => this.destroyWrapperComponent(m.modalWrapperRef))
              )
              .subscribe(() => {
                this.modals = this.modals.filter((modal) => modal !== m);
                this.removeDocumentBodyStyle();
              });
          }
        });
      });
  }

  private listenToESC(): void {

    fromEvent(document, 'keydown')
      .pipe(
        // @ts-ignore
        filter(() => !!this.modals.length),
        filter((event: KeyboardEvent) => event.code === 'Escape'),
        filter(() => !this.getModal()?.configs?.ignoreEsc),
        throttleTime(delayTime)
      )
      .subscribe(() => this.detach());
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
    modalWrapperDomElement.querySelector('.slide_popup')?.appendChild(componentDomElem);

    this.modals.push({modalWrapperRef, modalWrapperDomElement, componentRef, componentDomElem, configs});

    this.closeModalWrapperComponent(modalWrapperRef);

    document.body.appendChild(this.getModal().modalWrapperDomElement);

    this.setClass(configs?.class);

    this.showPopup(modalWrapperDomElement, configs);

    return {instance: componentRef.instance, closeWrapper$: modalWrapperRef.instance.close$};
  }

  private createModalWrapper(): { modalWrapperRef: Wrapper, modalWrapperDomElement: HTMLElement } {

    // 1. Create a wrapper component reference from the component
    const modalWrapperRef = this.componentFactoryResolver.resolveComponentFactory(NgModalWrapperComponent).create(this.injector);

    // 2. Attach wrapper component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(modalWrapperRef.hostView);

    // 3. Get wrapper DOM element from component
    const modalWrapperDomElement = (modalWrapperRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

    return {modalWrapperRef, modalWrapperDomElement};
  }

  public setClass(classname: string | string[] | undefined, index: number = this.lasModalIndex): void {
    classname = classname || 'slide_popup';
    const className: string[] = Array.isArray(classname) ? classname : [classname];
    this.getModal(index)?.modalWrapperDomElement.querySelector('.slide_popup')?.classList.add(...className);
  }

  public removeClass(classname: string | string[], index = this.lasModalIndex): void {
    const className: string[] = Array.isArray(classname) ? classname : [classname];
    this.getModal(index)?.modalWrapperDomElement.querySelector('.slide_popup')?.classList.remove(...className);
  }

  private closeModalWrapperComponent(modalWrapperRef: Wrapper): void {
    const modal: ModalData | undefined = this.modals.find((m: ModalData) => m.modalWrapperRef === modalWrapperRef);
    if (!modal?.configs?.ignoreBackdropClick) {
      modalWrapperRef
        .instance
        .close$
        .pipe(distinctUntilChanged())
        .subscribe(() => this.detach());
    }
  }

  private attachConfig(configs: Configs | undefined, componentRef: any): void {
    const inputs = configs?.inputs || {};
    const outputs = configs?.outputs || {};
    // @ts-ignore
    Object.keys(inputs).forEach((key: string) => componentRef.instance[key] = inputs[key]);
    // @ts-ignore
    Object.keys(outputs).forEach((key: string) => componentRef.instance[key] = outputs[key]);
  }

  public attachTemplateRef(templateRef: TemplateRef<any>, configs?: Configs): { close$: EventEmitter<void> } {

    const {modalWrapperRef, modalWrapperDomElement} = this.createModalWrapper();

    // Get DOM element from templateRef
    const templateRefDom: HTMLElement = templateRef.createEmbeddedView(null).rootNodes[0];

    modalWrapperDomElement.querySelector('.slide_popup')?.appendChild(templateRefDom);

    this.modals.push({modalWrapperRef, modalWrapperDomElement, componentRef: null, componentDomElem: null, configs});

    this.closeModalWrapperComponent(modalWrapperRef);

    document.body.appendChild(modalWrapperDomElement);

    this.setClass(configs?.class);

    this.showPopup(modalWrapperDomElement, configs);

    return {close$: modalWrapperRef.instance.close$};
  }

  public detach(index: number = this.lasModalIndex): void {
    timer(0)
      .pipe(
        tap(() => this.hidePopup(index)),
        delay(delayTime)
      )
      .subscribe(() => this.destroyComponents(index));
  }

  private destroyComponents(index: number): void {
    if (this.modals.length) {
      const modal = this.getModal(index)?.modalWrapperRef;
      if (modal) {
        this.modals.splice(index, 1);
        this.destroyWrapperComponent(modal);
      }
    }
    this.removeDocumentBodyStyle();
  }

  private removeDocumentBodyStyle(): void {
    if (!this.modals.length) {
      document.body.style.cssText = '';
      document.body.removeAttribute('style');
    }
  }

  private destroyWrapperComponent(modalWrapperRef: Wrapper): void {
    this.appRef.detachView(modalWrapperRef.hostView);
    modalWrapperRef.destroy();
  }

  private showPopup(modalWrapperDomElement: HTMLElement, configs?: Configs): void {

    const element: HTMLElement | null = modalWrapperDomElement.querySelector('.slide');
    const slidePopup: HTMLElement | null | undefined = element?.querySelector('.slide_popup');

    if (slidePopup?.parentElement) {
      if (configs?.topPosition === 'center') {
        // @ts-ignore
        setTimeout(() => slidePopup.parentElement.style.top = `calc(50% - ${Math.round(slidePopup.parentElement.offsetHeight / 2)}px)`);
      }

      if (configs?.topPosition && configs?.topPosition !== 'center') {
        slidePopup.parentElement.style.top = configs.topPosition;
      }
    }

    const slideModal = element?.children[0] as HTMLElement;

    if (configs?.ignoreBackdrop) {
      slideModal.style.backgroundColor = 'initial';
    }

    if (configs?.ignoreAnimation) {
      element?.classList.add('disable-animation');
    }

    timer(100)
      .pipe(
        tap(() => element?.classList.add('show')),
        tap(() => document.body.style.overflow = 'hidden'),
        tap(() => this.addDocumentBodyPaddingRight()),
      )
      .subscribe(() => {
        if (slidePopup && slidePopup.clientHeight > window.innerHeight) {
          if (element) {
            element.style.overflow = 'auto';
          }
          if (!this.onMobileState) {
            slideModal.style.marginRight = (window.innerWidth - document.body.clientWidth) + 'px';
          }
        }
      });
  }

  private addDocumentBodyPaddingRight(): void {
    if ((document.body.clientHeight > window.innerHeight) && !this.onMobileState) {
      document.body.style.paddingRight = '17px';
    }
  }

  private hidePopup(index = this.lasModalIndex): void {
    this.getModal(index)?.modalWrapperDomElement.querySelector('.slide')?.classList.remove('show');
  }

  private getModal(index = this.lasModalIndex): ModalData {
    return this.modals[index];
  }

  private get lasModalIndex(): number {
    return this.modals.length - 1;
  }

  private get onMobileState(): boolean {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];

    return toMatch.some((toMatchItem: RegExp) => {
      return navigator.userAgent.match(toMatchItem);
    });
  }

}
