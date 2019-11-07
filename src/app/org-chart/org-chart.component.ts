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
  svgGroup: any;
  shadow: any;

  viewerWidth: number;
  viewerHeight: number;

  i = 0;

  duration = 750;

  maxLabelLength = 0;
  totalNodes = 0;

  selectedNode: any;

  constructor() { }

  ngOnChanges() {
    if (this.data) {
      console.log(this.data);
    // Set the dimensions and margins of the diagram
          const width = window.innerWidth,
                height = window.innerHeight;

      const zoom = d3.zoom();
      const initial_transform = d3.zoomIdentity.translate(width/3, height/2);

      // append the svg object to the body of the page
      // appends a 'group' element to 'svg'
      // moves the 'group' element to the top left margin
      this.svg = d3.select('body').append('svg')
          .attr('width', width)
          .attr('height', height)
          .attr('id', 'testing')
          .call(zoom.transform, initial_transform);

      this.svgGroup = this.svg.append('g')
          .attr("transform", initial_transform.toString());

      this.shadow = this.svgGroup
          .append('defs')
          .append('filter')
            .attr("id", "dropshadow");
      this.shadow
          .append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', '3')
            .attr('result', 'DROP');
      this.shadow
          .append('feFlood')
            .attr('id', 'shadow-color')
            .attr('flood-color', '#bbb')
            .attr('result', 'COLOR');
      this.shadow
          .append('feComposite')
            .attr('in', 'COLOR')
            .attr('in2', 'DROP')
            .attr('operator', 'in')
            .attr('result', 'SHADOW');

      /* this.shadow = this.svgGroup
        .append('defs')
        .append('filter')
          .attr("id", "dropshadow")
          .attr("x", "-40%")
          .attr("y", "-40%")
          .attr("width", "180%")
          .attr("height", "180%")
          .attr("filterUnits", "userSpaceOnUse");

      const a = this.shadow
          .append('feGaussianBlur')
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", "3");

      a.append("feOffset")
            .attr("dx","5")
            .attr("dy","5")
            .attr("result", "offsetblur");
      a.append("feOffset")
        .attr("dx","-5")
        .attr("dy","-5")
        .attr("result", "offsetblur");
      this.shadow.append("feColorMatrix")
        .attr("id", "shadow-color")
        .attr("result", "matrixOut")
        .attr("in", "offOut")
        .attr("type", "matrix")
        .attr("values", "0.2 0 0 0 0 0 0.2 0 0 1 0 0 0.2 0 0 0 0 0 1 0");

      const b = a.append("feMerge");
      b.append('feMergeNode');
      b.append('feMergeNode')
        .attr("in", "SourceGraphic");
      b.append('feMergeNode')
        .attr("in", "SourceGraphic"); */


      // declares a tree layout and assigns the size
      this.treemap = d3.tree().nodeSize([40, 40])
        .separation(function(a, b) {
          return a.parent === b.parent ? 1.5 : 1.75;
      });

      // Assigns parent, children, height, depth
      this.root = d3.hierarchy(this.data, function(d) { return d.children; });
      this.root.x0 = height / 2;
      this.root.y0 = 0;

      // this.collapse(this.root);
      this.update(this.root);
      this.onClick('Yngrid Coello');

     this.svg.call(zoom.on("zoom", () => {this.svgGroup.attr("transform", d3.event.transform)}));

    }
  }

  onKeyUp(event) {
    console.log(event);
  }

  onClick(fullName) {
    this.collapse(this.root);
    // this.selectedNode = this.fnf(fullName);

    this.find (this.root, fullName);
    this.click(this.selectedNode);

    this.centerNode(this.selectedNode);
    this.updateNode(this.selectedNode);
  }

  private collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach((d1) => {
        d1.parent = d; this.collapse(d1);
      });
      d.children = null;
  }}

  private updateNode(node) {
    console.log(node);
    const t = d3.select(`#${node.data.person.accountName.replace('.', '_')}`)
      .select('text')
      .style('font-weight', 'bold');
    d3.select(`#${node.data.person.accountName.replace('.', '_')}`)
      .select('#test')
      .attr('r', 20 + 5)
      .style("filter", "url(#dropshadow)");

    d3.select('#shadow-color')
      .attr('flood-color', this.getNodeColor(node));
  }

  private fnf(fullName) {
    const treeData = this.treemap(this.root);
    const nodes = treeData.descendants();
    const a = nodes.filter((node) => node.data.person.fullName === fullName);
    return a[0];
  }

  private find(d, name) {
    if (d.data.person.fullName.toLowerCase() === name.toLowerCase() || d.data.person.accountName.toLowerCase() === name.toLowerCase()) {
      this.selectedNode = d;
      while (d.parent) {
          d = d.parent;
          this.click(d);
      }
      return;
    }
    if (d.children) {
      d.children.forEach((d) => {this.find(d, name); });
    } else if(d._children){
      d._children.forEach((d) => {this.find(d, name); });
    }
  }

  private click(d) {
    if (d.children) {
    d._children = d.children;
    d.children = null;
    } else {
    d.children = d._children;
    d._children = null;
    }
    this.update(d);
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
    const node = this.svgGroup.selectAll('g.node')
        .data(nodes, function(n) {return n.id || (n.id = ++this.i); });

    const click = (d) => {
      if (d.children) {
        d._children = d.children;
        d.children = null;
        this.update(d);
        // this.centerNode(d);
      } else if (d._children) {
        d.children = d._children;
        d._children = null;
        this.update(d);
        // this.centerNode(d);
      }
    };

    // Enter any new modes at the parent's previous position.
    const nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('id', (d) => d.data.person.accountName.replace('.', '_'))
        .attr('transform', (d) => 'translate(' + source.y0 + ',' + source.x0 + ')')
        .on('click', click);

    nodeEnter.append('clipPath')
      .attr('id', 'circle-mask')
        .append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 20);

    // Add Circle for the nodes
    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 20)
        .style('fill', (d) => this.getNodeColor(d));

    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 20 + 4)
        .style('fill', (d) => this.getNodeColor(d));

    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('id', 'test')
        .attr('r', 20 + 4)
        .style('fill', (d) => this.getNodeColor(d));

    nodeEnter.append('image')
      .attr('x', -20)
      .attr('y', -20)
      .attr('xlink:href', (n) => 'https://nam.delve.office.com/mt/v3/people/profileimage?userId=' + n.data.person.accountName + '%40dynatrace.com')
      .attr('height', 20 * 2)
      .attr('widht', 20 * 2)
      .attr('clip-path', 'url(#circle-mask)');

    // Add labels for the nodes
    nodeEnter.append('text')
        .attr('dy', '.35em')
        .attr('x', (d) => d.children || d._children ? -30 : 30)
        .attr('text-anchor', (d) => d.children || d._children ? 'end' : 'start')
        .text((d) => d.data.person.fullName);

    // UPDATE
    const nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate/* .transition()
      .duration(this.duration) */
      .attr('transform', (d) => 'translate(' + d.y + ',' + d.x + ')');

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
      .attr('r', 10)
      .style('fill', (d) => this.getNodeColor(d))
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
    const link = this.svgGroup.selectAll('path.link')
        .data(links, (d) => d.id);


    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', (d) => {
          const o = {x: source.x0, y: source.y0};
          return diagonal(o, o);
        });

    // UPDATE
    const linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate/* .transition()
        .duration(this.duration) */
        .attr('d', (l) => diagonal(l, l.parent));

    // Remove any exiting links
    link.exit()/* .transition()
        .duration(this.duration) */
        .attr('d', (d) => {
          const o = {x: source.x, y: source.y};
          return diagonal(o, o);
        })
        .remove();

    // Store the old positions for transition.
    nodes.forEach((n) => {
      n.x0 = n.x;
      n.y0 = n.y;
    });

  }

  private getNodeColor(node) {
    switch (node.data.person.location) {
      case 'Waltham': {
         return '#3f962a';
      }
      case 'Linz' : {
        return '#00848e';
      }
      case 'Zurich' : {
        return '#ef651f';
      }
      case 'Gdansk' : {
        return '#31339c';
      }
      case 'Barcelona' : {
        return '#7c38a1';
      }
      default: {
         return 'lightsteelblue';
      }
   }
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
    x = x /* * scale */ + window.innerWidth / 2;
    y = y /* * scale */ + window.innerHeight / 2;
    if ( x !== undefined && y !== undefined) {
      const initial_transform = d3.zoomIdentity.translate(x, y);
      this.svg
          .call(d3.zoom().transform, initial_transform);
      this.svgGroup.transition()
        .duration(this.duration)
        .attr('transform', initial_transform.toString());
    }
    /* this.svg.transition()
        .duration(this.duration)
        .attr('transform', 'translate(' + x + ',' + y + ')'); */
        // .attr('transform', 'translate(' + x + ',' + y + ')scale(' + scale + ')');
    // zoomListener.scale(scale);
    // zoomListener.translate([x, y]);
  }


}
