import { Injectable, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import { ForceGraph, Node, Link } from '../models';

@Injectable()
export class ForceGraphService {

  constructor() { }

  applyZoomableBehaviour(svgElement, containerElement) {
    let svg, container, zoomed, zoom;

    svg = d3.select(svgElement);
    container = d3.select(containerElement);

    zoomed = () => {
      const transform = d3.event.transform;
      container.attr('transform', 'translate(' + transform.x + ',' + transform.y + ') scale(' + transform.k + ')');
    }

    zoom = d3.zoom().on('zoom', zoomed);
    svg.call(zoom);
  }

  applyDraggableBehaviour(element, node: Node, graph: ForceGraph) {
    const d3element = d3.select(element);

    function started() {
      d3.event.sourceEvent.stopPropagation();

      if (!d3.event.active) {
        graph.simulation.alphaTarget(0.3).restart();
      }

      d3.event.on('drag', dragged).on('end', ended);

      function dragged() {
        node.fx = d3.event.x;
        node.fy = d3.event.y;
      }

      function ended() {
        if (!d3.event.active) {
          graph.simulation.alphaTarget(0);
        }

        node.fx = null;
        node.fy = null;
      }
    }

    d3element.call(d3.drag()
      .on('start', started));
  }

  getForceGraph(nodes: Node[], links: Link[], options: { width, height }) {
    const sg = new ForceGraph(nodes, links, options);
    return sg;
  }
}
