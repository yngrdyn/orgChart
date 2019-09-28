import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Node } from '../../models';

@Component({
  selector: '[node]',
  template: `
    <svg:g (click)="onClick()" [attr.visibility]="node.visible ? 'visible' : 'hidden'" [attr.transform]="'translate(' + node.x + ',' + node.y + ')'">
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
          [attr.r]="node.r+4">
      </svg:circle>
      <image class="node-img" clip-path="url(#circle-mask)" [attr.x]="-node.r" [attr.y]="-node.r" [attr.xlink:href]="'https://nam.delve.office.com/mt/v3/people/profileimage?userId=' + node.id + '%40dynatrace.com'" [attr.height]="node.r*2" [attr.width]="node.r*2"/>
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
