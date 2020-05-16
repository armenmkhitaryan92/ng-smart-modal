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
     const modal: IModal<FirstTestModalComponent> = this.ngSmartModalService.attach(FirstTestModalComponent,
          {
             inputs: {},   // object;
             outputs: {}, // object;
             class: 'my-custom-class',        // string | string[];
             ignoreWhenRouterChanged: false, // boolean;
             ignoreBackdropClick: false,    // boolean;
             ignoreBackdrop: false,        //  boolean;
             ignoreAnimation: false,      // boolean;
             ignoreEsc: false,           // boolean;
           });
    }

**4) You can listen to component instance EventEmitter and  modalsWrapper closeWrapper$ EventEmitter.**

    modal.instance.event$.subscribe();
    modal.closeWrapper$.subscribe()

   
