import { Component, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Node, Link } from './models';

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss']
})
export class OrgChartComponent implements OnChanges {

  @Input() data: any[];
  @Output() nodeClicked = new EventEmitter<string>();

  nodes: Node[] = [];
  links: Link[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.data) {
      for (const person of this.data) {
        this.nodes.push(new Node(person.id, person.location, person.supervisor));
        if (person.supervisor) {
          this.nodes[this.getNodeIndex(person.id)].linkCount++;
          this.nodes[this.getNodeIndex(person.supervisor)].linkCount++;
          this.links.push(new Link(person.supervisor, person.id));
        }
      }
    }
  }

  onNodeClick(supervisorId) {
    this.toggleNodes(supervisorId);
    this.toggleLinks(supervisorId);
  }

  private getNodeIndex(id) {
    return this.nodes.findIndex(node => node.id === id);
  }

  private toggleNodes(supervisorId) {
    this.nodes = this.nodes.map(
      (node) => {
        if (node.supervisor === supervisorId) {
          node.visible = !node.visible;
          this.toggleNodes(node.id);
          this.toggleLinks(node.id);
        }
        return node;
      }
    );
  }

  private toggleLinks(supervisorId) {
    this.links = this.links.map(
      (link) => {
        if (link.target.supervisor === supervisorId) {
          link.visible = !link.visible;
        }
        return link;
      }
    );
  }

}
