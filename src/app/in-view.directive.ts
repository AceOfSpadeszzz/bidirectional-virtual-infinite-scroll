import { Directive, ViewContainerRef, TemplateRef, AfterViewInit, Renderer2, ComponentFactoryResolver, ElementRef } from '@angular/core';
import { ItemComponent } from './item/item.component';

@Directive({ selector: '[inView]' })
export class InViewDirective implements AfterViewInit {

    rendered: boolean = false;
    emptied: boolean = false;
    minHeightSet: boolean = false;
    cachedHeight: number = 0;
    cachedWidth: number = 0;

    constructor(
        private vcRef: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        private renderer: Renderer2
    ) { }

    ngAfterViewInit() {
        const commentEl = this.vcRef.element.nativeElement; // template
        const elToObserve = commentEl.parentElement;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                console.log(entry.time);
                console.log(entry.target);
                console.log(entry.rootBounds);
                console.log(entry.intersectionRect);
                console.log(entry.isIntersecting);
                console.log(entry.intersectionRatio);
                this.renderContents((entry.isIntersecting));
            }, { root: this.vcRef.element.nativeElement.parentElement.parentElement, threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });
            /* entries.forEach(entry => {
                const element = entry.target;

                // Get root elemenet (document) coords
                const rootTop = entry.rootBounds!.top;
                console.log(entry.rootBounds!);
                const rootBottom = entry.rootBounds!.height;

                // Get div coords
                console.log(entry.boundingClientRect);
                const topBound = entry.boundingClientRect.top - 50; // -50 to count for the margine in config
                const bottomBound = entry.boundingClientRect.bottom;


                // Do calculations to get class names
                if (topBound < rootTop && bottomBound < rootTop) {
                    this.renderContents(false);
                } else if (topBound > rootBottom) {
                    this.renderContents(false);
                } else if (topBound < rootBottom && bottomBound > rootBottom) {
                    this.renderContents(true);
                } else if (topBound < rootTop && bottomBound > rootTop) {
                    this.renderContents(true);
                }
            }); */
        });
        observer.observe(elToObserve);
    }

    createView() {
        this.vcRef.clear();
        this.vcRef.createEmbeddedView(this.templateRef);
    }

    renderContents(isInView: boolean) {
        //let factory = this.componentFactoryResolver.resolveComponentFactory(ItemComponent);
        if (!this.rendered && (!this.emptied || isInView)) {
            console.log("creating!");
            this.createView();
            console.log("created!");
        }
        if (this.vcRef.element.nativeElement.parentElement.offsetHeight != 0) {
            this.cachedHeight = this.vcRef.element.nativeElement.parentElement.offsetHeight;
            this.cachedWidth = this.vcRef.element.nativeElement.parentElement.offsetWidth;
            this.renderer.setStyle(this.vcRef.element.nativeElement.parentElement, 'minWidth', this.cachedWidth + 'px');
            this.renderer.setStyle(this.vcRef.element.nativeElement.parentElement, 'minHeight', this.cachedHeight + 'px');
        }
        if (isInView) {
            console.log(this.vcRef.element.nativeElement.parentElement);
            this.rendered = true;
            this.emptied = false;
        } else if (!this.emptied) {
            this.emptied = true;
            this.rendered = false;
            console.log("empty ing");
            /* setTimeout(() => {
                while (this.vcRef.element.nativeElement.parentElement && this.vcRef.element.nativeElement.parentElement.firstChild) {
                    this.renderer.removeChild(this.vcRef.element.nativeElement.parentElement, this.vcRef.element.nativeElement.parentElement.firstChild);
                }
            }); */
            this.vcRef.clear();
        }
        /* if (isInView) {
            
            this.vcRef.createEmbeddedView(this.templateRef);
        } */
    }
}