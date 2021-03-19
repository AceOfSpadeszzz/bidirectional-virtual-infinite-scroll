import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  // providers: [MutationObserver]
})
export class ItemComponent implements AfterViewInit {

  @ViewChild('myItem', { static: false }) item: ElementRef | undefined;
  @Output() outsideView = new EventEmitter();

  @Input() content: string = "";
  cachedWidth: number = 0;
  cachedHeight: number = 0;
  shown = true;

  constructor(private renderer: Renderer2) {
  }
  ngAfterViewInit(): void {
    /* setTimeout(() => {
      console.log(this.item!.nativeElement.parentElement.parentElement);
      this.cachedHeight = this.item!.nativeElement.parentElement.parentElement.offsetHeight;
      this.cachedWidth = this.item!.nativeElement.parentElement.parentElement.offsetWidth;
      this.renderer.setStyle(this.item!.nativeElement.parentElement.parentElement, 'minWidth', this.cachedWidth + 'px');
      this.renderer.setStyle(this.item!.nativeElement.parentElement.parentElement, 'minHeight', this.cachedHeight + 'px');
    }); */
  }


  detectChanges() {
    const observer = new MutationObserver(() => {
      this.checkInsideView();
    });
    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(this.item!.nativeElement, config);
  }


  checkInsideView() {
    const viewPortHeight = window.innerHeight;
    const top = this.item!.nativeElement.parentElement.getBoundingClientRect() && this.item!.nativeElement.parentElement.getBoundingClientRect().top;
    console.log('top', top)
    console.log(viewPortHeight);
    if (top <= viewPortHeight + 100) {
      console.log("out");
      this.cachedWidth = this.item!.nativeElement.parentElement.width;
      this.cachedHeight = this.item!.nativeElement.parentElement.height;
      this.shown = false;
      setTimeout(this.setSpace, 0);
    } else {
      console.log("Inside");
      this.shown = true;
    }

  }

  setSpace() {
    this.item!.nativeElement.parentElement.width = this.cachedWidth;
    this.item!.nativeElement.parentElement.height = this.cachedHeight;
  }

}
