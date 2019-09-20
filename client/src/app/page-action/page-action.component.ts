import { Component,
    AfterViewInit,
    ViewChild,
    ComponentFactoryResolver,
    Injector,
    ApplicationRef,
    ViewContainerRef,
    OnDestroy } from '@angular/core';
import { DomPortalOutlet,
    PortalOutlet,
    TemplatePortal,
    CdkPortal } from '@angular/cdk/portal';


@Component({
    selector: 'app-page-actions',
    template: `
        <ng-template #pageActions>
            <ng-content></ng-content>
        </ng-template>
        `,
    styles: []
})
export class PageActionsComponent implements AfterViewInit, OnDestroy {
    private portalOutlet: PortalOutlet;
    @ViewChild(CdkPortal, null) portal;

    @ViewChild('pageActions', null) pageActionsTmplRef;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private appRef: ApplicationRef,
        private viewContainerRef: ViewContainerRef
    ) {

    }

    ngAfterViewInit(): void {
        this.portalOutlet = new DomPortalOutlet(
            document.querySelector('#page-actions-container'),
            this.componentFactoryResolver,
            this.appRef,
            this.injector
        );

        this.portal = new TemplatePortal(
            this.pageActionsTmplRef,
            this.viewContainerRef
        );

        this.portalOutlet.attach(this.portal);
    }

    ngOnDestroy(): void {
        this.portalOutlet.detach();
    }

}
