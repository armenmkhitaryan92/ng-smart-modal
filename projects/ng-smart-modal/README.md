# ng-smart-modal library for creating dynamic nested modals.
Supported version Angular 9 and above

**1) Install Library - 'npm i ng-smart-modal'**

**2) Inject service into component.**
```ts
    constructor(
         private ngSmartModalService: NgSmartModalService
    ) {}
```
**3) ngSmartModalService attach method will create instance from component and append template into document body.
     You can also pass ng-template with attachTemplate method with the same configs.**
     
```ts
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
```    

Input key names should be the same as attached component property names.

```ts
    export class TestModalComponent {
      public title: string;
      public user: {name: string, age: number};
    }
    
    public openModal(): void { 
         this.ngSmartModalService.attach(TestModalComponent, {
             inputs: {title: 'my-title', user: {age: 27, name: 'David'}}
         });
    }
```

To use output bindings assign them to component properties or local variables.
```ts
     export class AppComponent implements OnInit {
    
       private testModalClose$ = new EventEmitter<void>();
     
       constructor(
         private ngSmartModalService: NgSmartModalService
       ) {
       }
     
       ngOnInit(): void {
         this.testModalClose$.subscribe();
       }
     
       public openModal(): void {
         this.ngSmartModalService.attach(TestModalComponent, {
             outputs: {close$: this.testModalClose$}
         });
    }

    export class TestModalComponent {
      public close$ = new EventEmitter<void>();
    }
```

**4) You can listen to component instance and  modalsWrapper closeWrapper$ EventEmitters.**

```ts
    modal.instance.event$.subscribe();
    modal.closeWrapper$.subscribe();
```

**5) 'detach()' - method will remove last modal from document body. You can also pass index of a modal which you want to remove.**

```ts
    this.ngSmartModalService.detach();
    this.ngSmartModalService.detach(modalIndex);
```

**6) You can pass or remove classes to modals. You can also pass an index of a modal on which you want to add or remove class.**

```ts
    this.ngSmartModalService.setClass(['my-first-custom-class', 'my-second-custom-class']);
    this.ngSmartModalService.removeClass(['my-first-custom-class', 'my-second-custom-class'], modalIndex);
```

[Check bundle size](https://bundlephobia.com/result?p=ng-smart-modal@0.1.0)

