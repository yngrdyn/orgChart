import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Node } from '../../models';

@Component({
  selector: '[node]',
  template: `
    <svg:g (click)="onClick()" [attr.transform]="'translate(' + node.x + ',' + node.y + ')'">
      <clipPath id="circle-mask">
        <svg:circle cx="0" cy="0" [attr.r]="node.r" fill="red" />
      </clipPath>
      <svg:circle
          class="node"
          [attr.fill]="node.color"
          cx="0"
          cy="0"
          [attr.r]="node.r">
      </svg:circle>
      <svg:circle
          class="node"
          [attr.fill]="node.color"
          cx="0"
          cy="0"
          [attr.r]="node.r+3">
      </svg:circle>
      <image class="node-img" clip-path="url(#circle-mask)" [attr.x]="-node.r" [attr.y]="-node.r" [attr.xlink:href]="'https://dev-wiki.dynatrace.org/download/attachments/' + node.id + '/user-avatar'" [attr.height]="node.r*2" [attr.width]="node.r*2"/>
    </svg:g>
  `,
  styleUrls: ['./node.component.css']
})
export class NodeComponent {
  @Input() node: Node;
  @Output() nodeClicked = new EventEmitter<string>();

  onClick() {
    this.nodeClicked.emit(this.node.id);
  }
}
