import { EventEmitter } from '@angular/core';
import { Link } from './link';
import { Node } from './node';
import * as d3 from 'd3';

const FORCES = {
  LINKS: 1/2,
  COLLISION: 1,
  CHARGE: -50,
  DISTANCE: 15,
};

export class ForceGraph {
  public ticker: EventEmitter<d3.Simulation<Node, Link>> = new EventEmitter();
  public simulation: d3.Simulation<any, any>;

  public nodes: Node[] = [];
  public links: Link[] = [];

  constructor(nodes, links, options: { width, height }) {
    this.nodes = nodes;
    this.links = links;

    this.initSimulation(options);
  }

  connectNodes(source, target) {
    let link;

    if (!this.nodes[source] || !this.nodes[target]) {
      throw new Error('One of the nodes does not exist');
    }

    link = new Link(source, target);
    this.simulation.stop();
    this.links.push(link);
    this.simulation.alphaTarget(0.3).restart();

    this.initLinks();
  }

  initNodes() {
    if (!this.simulation) {
      throw new Error('simulation was not initialized yet');
    }

    this.simulation.nodes(this.nodes);
  }

  initLinks() {
    if (!this.simulation) {
      throw new Error('simulation was not initialized yet');
    }

    this.simulation.force('links',
      d3.forceLink(this.links)
        .id(d => d['id'])
        .strength(FORCES.LINKS)
    );
  }

  initSimulation(options) {
    if (!options || !options.width || !options.height) {
      throw new Error('missing options when initializing simulation');
    }

    /** Creating the simulation */
    if (!this.simulation) {
      const ticker = this.ticker;

      this.simulation = d3.forceSimulation()
        .force('charge',
          d3.forceManyBody()
            .strength(-100)
        )
        .force('collide',
          d3.forceCollide()
            .strength(FORCES.COLLISION)
            .radius(d => d['r'] + FORCES.DISTANCE)
        )
        .force('centers', d3.forceCenter(options.width / 2, options.height / 2))
        .force('y', d3.forceY());

      // Connecting the d3 ticker to an angular event emitter
      const that = this;
      this.simulation.on('tick', function() {
        ticker.emit(this);

        const k = 6 * that.simulation.alpha();

        for (const link of that.links) {
          link.source.y -= k;
          link.target.y += k;
        }

        for (const node of that.nodes) {
          if (node.supervisor) {
            node.y = that.nodes[that.getNodeIndex(node.supervisor, that.nodes)].y + 90;
          } else {
            node.y = 50;
          }
        }
      });

      this.initNodes();
      this.initLinks();
    }

    /** Restarting the simulation internal timer */
    this.simulation.restart();
  }

  getNodeIndex(id, nodes: any[]) {
    return nodes.findIndex(node => node.id === id);
  }
}
