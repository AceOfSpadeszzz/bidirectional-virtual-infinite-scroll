import { Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';
import { Observable, range, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private renderer: Renderer2) { }

  @ViewChild('myDiv', { static: false }) div: ElementRef | undefined;

  title = 'testProject';
  isScrolled$: Subject<number[]> = new Subject<number[]>();
  topEdge: number = 0;
  bottomEdge: number = 0;
  scrolledUp: number = 1;
  lastTop: number = 0;
  counter: number = 2;
  previousScrollHeightMinusTop: number = 0;
  testItems = ['1', '1', '1', '1', '1', '1', '1', '1', '1'];
  scrolledDown: number = 1;
  // itemObservable: Observable<number> | undefined = null;

  handleScroll() {
    this.topEdge = this.div!.nativeElement.firstChild.offsetTop;
    this.scrolledUp = this.div!.nativeElement.scrollTop;
    this.bottomEdge = this.div!.nativeElement.scrollHeight;
    this.scrolledDown = this.scrolledUp + this.div!.nativeElement.offsetHeight;
    if (this.topEdge >= this.scrolledUp && this.scrolledUp <= 0) {
      this.previousScrollHeightMinusTop = this.div!.nativeElement.scrollHeight - this.div!.nativeElement.scrollTop;
      this.loadTop();
    } else if (this.bottomEdge <= this.scrolledDown + 1) {
      this.loadBottom();
    }
  }
  loadBottom() {
    this.testItems.push('2', '2', '2', '2', '2', '2');
  }

  loadTop() {
    let i = 0;
    while (i < 6) {
      this.testItems.unshift('' + this.counter);
      i++;
    }
    this.counter += 1;
    setTimeout(() => {
      console.log(this.div!.nativeElement.scrollHeight - this.previousScrollHeightMinusTop);
      this.renderer.setProperty(this.div!.nativeElement, 'scrollTop', this.div!.nativeElement.scrollHeight - this.previousScrollHeightMinusTop);
    });
    console.log(this.div!.nativeElement.scrollHeight);
  }
}

