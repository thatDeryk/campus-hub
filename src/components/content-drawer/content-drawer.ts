import { Component, Input, ElementRef, Renderer } from "@angular/core";
import { DomController, Platform } from "ionic-angular";

/**
 *
 * ContentDrawer as coined frm joshmorony
 *
 * https://www.joshmorony.com/how-to-create-a-sliding-drawer-component-for-ionic-2/
 */

@Component({
  selector: "content-drawer",
  templateUrl: "content-drawer.html"
})

export class ContentDrawer {
  @Input("options") options: any;

  drawerOptions: any;
  handleHeight: number = 50;
  bounceBack: boolean = false;
  thresholdTop: number = 200;
  thresholdBottom: number = 200;
  title;
  showTitle = "Custom Title Here";
  hideTitle = "Custom Title Here";

  constructor(
    public element: ElementRef,
    public renderer: Renderer,
    public domCtrl: DomController,
    public platform: Platform
  ) {
   
  }

  ngAfterViewInit() {
    console.log(this.options);
    if (this.options.handleHeight) {
      this.handleHeight = this.options.handleHeight;
    }

    if (this.options.bounceBack) {
      this.bounceBack = this.options.bounceBack;
    }

    if (this.options.thresholdFromBottom) {
      this.thresholdBottom = this.options.thresholdFromBottom;
    }

    if (this.options.thresholdFromTop) {
      this.thresholdTop = this.options.thresholdFromTop;
    }

    this.renderer.setElementStyle(
      this.element.nativeElement,
      "top",
      this.platform.height() - 450 + "px"
    );
    this.renderer.setElementStyle(
      this.element.nativeElement,
      "padding-top",
      this.handleHeight + "px"
    );

    let hammer = new window["Hammer"](this.element.nativeElement);
    hammer.get("pan").set({ direction: window["Hammer"].DIRECTION_VERTICAL });

    hammer.on("pan", ev => {
      this.handlePan(ev);
    });
  }

  handlePan(ev) {
   
    let newTop = ev.center.y;
    this.title = newTop > this.thresholdTop;

    let bounceToBottom = false;
    let bounceToTop = false;

    if (this.bounceBack && ev.isFinal) {
      let topDiff = newTop - this.thresholdTop;
      let bottomDiff = this.platform.height() - this.thresholdBottom - newTop;

      topDiff >= bottomDiff ? (bounceToBottom = true) : (bounceToTop = true);
    }

    if (
      (newTop > this.thresholdTop && ev.additionalEvent === "panup") ||
      bounceToBottom
    ) {
      this.domCtrl.write(() => {
        this.renderer.setElementStyle(
          this.element.nativeElement,
          "transition",
          "top 0.5s"
        );
        this.renderer.setElementStyle(this.element.nativeElement, "top", "190px");
      });
    } else if (
      (this.platform.height() - newTop < this.thresholdBottom &&
        ev.additionalEvent === "pandown") ||
      bounceToTop
    ) {
      this.domCtrl.write(() => {
        this.renderer.setElementStyle(
          this.element.nativeElement,
          "transition",
          "top 0.5s"
        );
        this.renderer.setElementStyle(
          this.element.nativeElement,
          "top",
          this.platform.height() - this.handleHeight + "px"
        );
      });
    } else {
      this.renderer.setElementStyle(
        this.element.nativeElement,
        "transition",
        "none"
      );

      if (newTop > 0 && newTop < this.platform.height() - this.handleHeight) {
        if (
          ev.additionalEvent === "panup" ||
          ev.additionalEvent === "pandown"
        ) {
          this.domCtrl.write(() => {
            this.renderer.setElementStyle(
              this.element.nativeElement,
              "top",
              newTop + "px"
            );
          });
        }
      }
    }
  }
}
