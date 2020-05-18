import {
  ApplicationRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  EventEmitter,
  Injectable,
  Injector,
  TemplateRef,
  Type,
  Optional
} from '@angular/core';
import {fromEvent, timer} from 'rxjs';
import {Wrapper} from '../types/wrapper';
import {IModal} from '../interfaces/i-modal';
import {Configs} from '../interfaces/configs';
import {ModalData} from '../interfaces/modal-data';
import {NavigationEnd, Router} from '@angular/router';
import {delay, distinctUntilChanged, filter, tap, throttleTime} from 'rxjs/operators';
import {NgModalWrapperComponent} from '../ng-modal-wrapper/ng-modal-wrapper.component';

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
                tap(() => m.modalWrapperDomElement.querySelector('.slide').classList.remove('show')),
                delay(delayTime),
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
    modalWrapperDomElement.querySelector('.slide_popup').appendChild(componentDomElem);

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

  public setClass(classname: string | string[], index = this.lasModalIndex): void {
    classname = classname || 'slide_popup';
    const className: string[] = Array.isArray(classname) ? classname : [classname];
    this.getModal(index).modalWrapperDomElement.querySelector('.slide_popup').classList.add(...className);
  }

  public removeClass(classname: string | string[], index = this.lasModalIndex): void {
    const className: string[] = Array.isArray(classname) ? classname : [classname];
    this.getModal(index).modalWrapperDomElement.querySelector('.slide_popup').classList.remove(...className);
  }

  private closeModalWrapperComponent(modalWrapperRef: Wrapper): void {
    const modal: ModalData = this.modals.find((m: ModalData) => m.modalWrapperRef === modalWrapperRef);
    if (!modal?.configs?.ignoreBackdropClick) {
      modalWrapperRef
        .instance
        .close$
        .pipe(distinctUntilChanged())
        .subscribe(() => this.detach());
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
    const templateRefDom: HTMLElement = templateRef.createEmbeddedView(null).rootNodes[0];

    modalWrapperDomElement.querySelector('.slide_popup').appendChild(templateRefDom);

    this.modals.push({modalWrapperRef, modalWrapperDomElement, componentRef: null, componentDomElem: null, configs});

    this.closeModalWrapperComponent(modalWrapperRef);

    document.body.appendChild(modalWrapperDomElement);

    this.setClass(configs?.class);

    this.showPopup(modalWrapperDomElement, configs);

    return {close$: modalWrapperRef.instance.close$};
  }

  public detach(index = this.lasModalIndex): void {
    timer(0)
      .pipe(
        tap(() => this.hidePopup(index)),
        delay(delayTime)
      )
      .subscribe(() => this.destroyComponents(index));
  }

  private destroyComponents(index = this.lasModalIndex): void {
    if (this.modals.length) {
      this.destroyWrapperComponent(this.getModal(index).modalWrapperRef);
      this.modals.splice(index, 1);
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

  private showPopup(modalWrapperDomElement: HTMLElement, configs: Configs): void {

    const element: HTMLElement = modalWrapperDomElement.querySelector('.slide');
    const slidePopup: HTMLElement = element.querySelector('.slide_popup');
    const slideModal = element.children[0] as HTMLElement;

    if (configs?.ignoreBackdrop) {
      slideModal.style.backgroundColor = 'initial';
    }

    if (configs?.ignoreAnimation) {
      element.classList.add('disable-animation');
    }

    timer(100)
      .pipe(
        tap(() => element.classList.add('show')),
        tap(() => document.body.style.overflow = 'hidden'),
        tap(() => this.addDocumentBodyRightPaddingStyle()),
      )
      .subscribe(() => {
        if (slidePopup.clientHeight > window.innerHeight) {
          element.style.overflow = 'auto';
          slideModal.style.marginRight = '17px';
        }
      });
  }

  private addDocumentBodyRightPaddingStyle(): void {
    if ((document.body.clientHeight > window.innerHeight) && !this.onMobileState) {
      document.body.style.paddingRight = '17px';
    }
  }

  private hidePopup(index = this.lasModalIndex): void {
    this.getModal(index)?.modalWrapperDomElement.querySelector('.slide').classList.remove('show');
  }

  private getModal(index = this.lasModalIndex): ModalData {
    return this.modals[index];
  }

  private get lasModalIndex(): number {
    return this.modals.length - 1;
  }

  private get onMobileState(): boolean {
    return (() => {
      let check = false;
      ((a) => {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
          check = true;
        }
      })(navigator.userAgent || navigator.vendor);
      return check;
    })();
  }

}
