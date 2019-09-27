import { Component, Input } from '@angular/core';
import { Link } from '../../models';

@Component({
  // tslint:disable-next-line: component-selector
  selector: '[link]',
  template: `
    <svg:line [attr.visibility]="link.visible ? 'visible' : 'hidden'"
        class="link"
        [attr.x1]="link.source.x"
        [attr.y1]="link.source.y"
        [attr.x2]="link.target.x"
        [attr.y2]="link.target.y"
    ></svg:line>
  `,
  styleUrls: ['./link.component.css']
})
export class LinkComponent  {
  @Input() link: Link;
}
