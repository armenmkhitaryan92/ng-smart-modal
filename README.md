# AngularLibraries

**1) Import NgSmartModalModule**

    @NgModule({
      imports: [
        BrowserModule,
        NgSmartModalModule
      ],
      bootstrap: [AppComponent]
    })
    export class AppModule { }

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

**4) You can listen to component instance EventEmitter and  modalsWrapper closeWrapper$ EventEmitter.**

    modal.instance.event$.subscribe();
    modal.closeWrapper$.subscribe();

**5) 'deAttach()' - method will remove modal from document body. You also can pass index of a modal.**

    this.ngSmartModalService.deAttach();

**6) You can pass or remove classes to modals. You can also pass an index of a modal on which you want to add class.**

    this.ngSmartModalService.setClass(['my-first-custom-class', 'my-second-custom-class']);
    this.ngSmartModalService.removeClass(['my-first-custom-class', 'my-second-custom-class'], 1);
