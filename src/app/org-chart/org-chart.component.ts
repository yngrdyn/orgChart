import { Component, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

const diagonal = (s, d) => {
  const path = `M ${s.y} ${s.x}
          C ${(s.y + d.y) / 2} ${s.x},
            ${(s.y + d.y) / 2} ${d.x},
            ${d.y} ${d.x}`;

  return path;
};

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss']
})
export class OrgChartComponent implements OnChanges {

  @Input() data: any;

  treemap: any;
  root: any;

  svg: any;

  viewerWidth: number;
  viewerHeight: number;

  i = 0;

  duration = 750;

  maxLabelLength = 0;
  totalNodes = 0;

  constructor() { }

  ngOnChanges() {
    if (this.data) {
      console.log(this.data);
    // Set the dimensions and margins of the diagram
          const width = window.screen.width,
                height = window.screen.height;

      // append the svg object to the body of the page
      // appends a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      this.svg = d3.select('body').append('svg')
          .attr('width', width)
          .attr('height', height)
          .call(d3.zoom().on('zoom', () => {
            this.svg.attr('transform', d3.event.transform);
          }))
        .append('g')
          .attr('transform', 'translate('
                + 50 + ')');

      // declares a tree layout and assigns the size
      this.treemap = d3.tree().nodeSize([30, 30])
      .separation(function(a, b) {
        return a.parent === b.parent ? 1 : 1.25;
    });

      // Assigns parent, children, height, depth
      this.root = d3.hierarchy(this.data, function(d) { return d.children; });
      this.root.x0 = height / 2;
      this.root.y0 = 0;

      this.update(this.root);
      this.centerNode(this.root);

    }
  }

  private update(source) {
    const treeData = this.treemap(this.root);

    const levelWidth = [1];
        const childCount = function(level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, this.root);
        const newHeight = d3.max(levelWidth) * 40; // 25 pixels per line
        /* this.treemap = this.treemap
        .size([newHeight, window.screen.width]);
        .nodeSize([40, 40])
        .separation(function(a, b) {
            return a.parent === b.parent ? 1 : 1.25;
        }); */

    // Compute the new tree layout.
    const nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    this.visit(this.data, (d) => {
        this.totalNodes++;
        this.maxLabelLength = Math.max(d.person.fullName.length, this.maxLabelLength);
    }, (d) => d.children && d.children.length > 0 ? d.children : null);

    // Normalize for fixed-depth.
    nodes.forEach((n) => { n.y = n.depth * (this.maxLabelLength * 10); });


    // ****************** Nodes section ***************************

    // Update the nodes...
    const node = this.svg.selectAll('g.node')
        .data(nodes, function(n) {return n.id || (n.id = ++this.i); });

    const click = (d) => {
      console.log(d);
      if (d.children) {
        d._children = d.children;
        d.children = null;
        this.update(d);
        this.centerNode(d);
      } else if (d._children) {
        d.children = d._children;
        d._children = null;
        this.update(d);
        this.centerNode(d);
      }
    };

    // Enter any new modes at the parent's previous position.
    const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', function(d) {
          return 'translate(' + source.y0 + ',' + source.x0 + ')';
        })
        .on('click', click);

    // Add Circle for the nodes
    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style('fill', (d) => d._children ? 'lightsteelblue' : '#fff');

    // Add labels for the nodes
    nodeEnter.append('text')
        .attr('dy', '.35em')
        .attr('x', function(d) {
            return d.children || d._children ? -13 : 13;
        })
        .attr('text-anchor', function(d) {
            return d.children || d._children ? 'end' : 'start';
        })
        .text(function(d) { return d.data.person.fullName; });

    // UPDATE
    const nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate/* .transition()
      .duration(this.duration) */
      .attr('transform', function(d) {
          return 'translate(' + d.y + ',' + d.x + ')';
      });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
      .attr('r', 10)
      .style('fill', function(d) {
          return d._children ? 'lightsteelblue' : '#fff';
      })
      .attr('cursor', 'pointer');


    // Remove any exiting nodes
    const nodeExit = node.exit()/* .transition()
        .duration(this.duration)
        .attr('transform', function(d) {
            return 'translate(' + source.y + ',' + source.x + ')';
        }) */
        .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
      .attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
      .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    const link = this.svg.selectAll('path.link')
        .data(links, function(d) { return d.id; });


    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', function(d) {
          const o = {x: source.x0, y: source.y0};
          return diagonal(o, o);
        });

    // UPDATE
    const linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate/* .transition()
        .duration(this.duration) */
        .attr('d', function(l) { return diagonal(l, l.parent); });

    // Remove any exiting links
    const linkExit = link.exit()/* .transition()
        .duration(this.duration) */
        .attr('d', function(d) {
          const o = {x: source.x, y: source.y};
          return diagonal(o, o);
        })
        .remove();

    // Store the old positions for transition.
    nodes.forEach(function(n) {
      n.x0 = n.x;
      n.y0 = n.y;
    });

  }

  private visit(parent, visitFn, childrenFn) {
    if (!parent) {
      return;
    }

    visitFn(parent);

    const children = childrenFn(parent);
    if (children) {
        const count = children.length;
        for (let i = 0; i < count; i++) {
            this.visit(children[i], visitFn, childrenFn);
        }
    }
  }

  private centerNode(source) {
    // scale = zoomListener.scale();
    let x = -source.y0;
    let y = -source.x0;
    x = x /* * scale */ + window.screen.width / 2;
    y = y /* * scale */ + window.screen.height / 2;
    this.svg.transition()
        .duration(this.duration)
        .attr('transform', 'translate(' + x + ',' + y + ')');
        // .attr('transform', 'translate(' + x + ',' + y + ')scale(' + scale + ')');
    // zoomListener.scale(scale);
    // zoomListener.translate([x, y]);
  }


}
