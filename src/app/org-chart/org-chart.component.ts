import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Node, Link } from './models';

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss']
})
export class OrgChartComponent implements OnChanges {

  @Input() data: any[];

  nodes: Node[] = [];
  links: Link[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.data) {
      for (const person of this.data) {
        this.nodes.push(new Node(person.id, person.location));
        if (person.supervisor) {
          this.nodes[this.getNodeIndex(person.id)].linkCount++;
          this.nodes[this.getNodeIndex(person.supervisor)].linkCount++;
          this.links.push(new Link(person.supervisor, person.id));
        }
      }
    }
  }

  private getNodeIndex(id) {
    return this.nodes.findIndex(node => node.id === id);
  }

}
