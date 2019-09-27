import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { Node, ForceGraph } from '../models';
import { ForceGraphService } from '../services/force-graph.service';

@Directive({
    selector: '[draggableNode]'
})
export class DraggableDirective implements OnInit {
    @Input('draggableNode') draggableNode: Node;
    @Input('draggableInGraph') draggableInGraph: ForceGraph;

    constructor(private d3Service: ForceGraphService, private _element: ElementRef) { }

    ngOnInit() {
        this.d3Service.applyDraggableBehaviour(this._element.nativeElement, this.draggableNode, this.draggableInGraph);
    }
}
