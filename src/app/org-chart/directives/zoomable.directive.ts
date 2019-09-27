import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { ForceGraphService } from '../services/force-graph.service';

@Directive({
    selector: '[zoomableOf]'
})
export class ZoomableDirective implements OnInit {
    @Input('zoomableOf') zoomableOf: ElementRef;

    constructor(private d3Service: ForceGraphService, private _element: ElementRef) {}

    ngOnInit() {
        this.d3Service.applyZoomableBehaviour(this.zoomableOf, this._element.nativeElement);
    }
}
