import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appGrowl]'
})
export class GrowlDirective {

  @Input() set appGrowl(condition: boolean) {
    if (condition) {
      this.position.createEmbeddedView(this.view);
      setInterval(() => {
          this.position.clear();
      }, 1000);
    } else {
      this.position.clear();
    }
  }

  constructor(private view: TemplateRef<any>,
              private position: ViewContainerRef) {}
}
