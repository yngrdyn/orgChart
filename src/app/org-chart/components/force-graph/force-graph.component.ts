import { Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ForceGraph } from '../../models';
import { ForceGraphService } from '../../services/force-graph.service';

@Component({
  selector: 'force-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg #svg [attr.width]="options.width" [attr.height]="options.height">
      <g [zoomableOf]="svg">
        <g [link]="link" *ngFor="let link of links"></g>
        <g [node]="node" (nodeClicked)="onNodeClick($event)" *ngFor="let node of nodes"
            [draggableNode]="node" [draggableInGraph]="graph"></g>
      </g>
    </svg>
  `,
  styleUrls: ['./force-graph.component.css']
})
export class ForceGraphComponent implements OnInit, OnChanges {

  @Input() nodes;
  @Input() links;

  @Output() nodeClicked = new EventEmitter<string>();

  graph: ForceGraph;

  private _options: { width, height };

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.initSimulation(this.options);
  }

  constructor(private d3Service: ForceGraphService, private ref: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.nodes && this.graph) {
      this.graph.nodes = this.nodes;
      this.graph.links = this.links;
    }
  }

  ngOnInit() {
    this.graph = this.d3Service.getForceGraph(this.nodes, this.links, this.options);

    this.graph.ticker.subscribe((d) => {
      this.ref.markForCheck();
    });
  }

  get options() {
    return this._options = {
      width: window.innerWidth - 10,
      height: window.innerHeight - 20
    };
  }

  onNodeClick(event) {
    this.nodeClicked.emit(event);
  }
}
