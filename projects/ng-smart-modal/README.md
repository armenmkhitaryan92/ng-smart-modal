# ng-smart-modal library for creating dynamic nested modals.
Supported version Angular 9 and above

**1) Install Library**

**2) Inject service into component.**

    constructor(
         private ngSmartModalService: NgSmartModalService
    ) {}

**3) ngSmartModalService attach method will create instance from component and append template into document body.
     You can also pass ng-template with attachTemplate method with the same configs.**

    public openModal(): void { 
     const modal: IModal<Component> = this.ngSmartModalService.attach(Component,
          {
             inputs: {},   // object;
             outputs: {}, // object;
             class: 'my-custom-class',        // string | string[];
             ignoreWhenRouterChanged: false, // boolean; (modal will automatically close on route change if this is enabled)
             ignoreBackdropClick: false,    // boolean;
             ignoreBackdrop: false,        //  boolean;
             ignoreAnimation: false,      // boolean;
             ignoreEsc: false,           // boolean;
           });
           
           this.ngSmartModalService.attachTemplateRef(templateRef);
    }

**4) You can listen to component instance and  modalsWrapper closeWrapper$ EventEmitters.**

    modal.instance.event$.subscribe();
    modal.closeWrapper$.subscribe();

**5) 'detach()' - method will remove modal from document body. You also can pass index of a modal.**

    this.ngSmartModalService.detach();

**6) You can pass or remove classes to modals. You can also pass an index of a modal on which you want to add or remove class.**

    this.ngSmartModalService.setClass(['my-first-custom-class', 'my-second-custom-class']);
    this.ngSmartModalService.removeClass(['my-first-custom-class', 'my-second-custom-class'], 1);

[Check bundle size](https://bundlephobia.com/result?p=ng-smart-modal@0.0.3)
