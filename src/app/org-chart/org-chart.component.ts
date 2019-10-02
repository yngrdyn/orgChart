import { Component, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Node, Link } from './models';

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.scss']
})
export class OrgChartComponent implements OnChanges {

  @Input() data: any;
  @Output() nodeClicked = new EventEmitter<string>();

  nodes: Node[] = [];
  links: Link[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.data && this.data.root) {
      this.createNode(this.data.root, undefined);
    }
  }

  onNodeClick(supervisorId) {
    this.toggleNodes(supervisorId);
    this.toggleLinks(supervisorId);
  }

  private createChildrenNodes(parentId, children) {
    for (const child of children) {
      this.createNode(child, parentId);
      this.links.push(new Link(parentId, child.person.accountName));
    }
  }

  private createNode(node, supervisorId) {
    const newNode = new Node(node.person.accountName, 'Linz', supervisorId);
    newNode.linkCount = supervisorId ? node.children.length + 1 : node.children.length;
    this.nodes.push(newNode);
    this.createChildrenNodes(node.person.accountName, node.children);
  }

  private toggleNodes(supervisorId) {
    this.nodes = this.nodes.map(
      (node) => {
        if (node.supervisor === supervisorId) {
          node.visible = !node.visible;
          this.toggleChildNodes(node.id, node.visible);
          this.toggleChildLinks(node.id, node.visible);
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

  private toggleChildNodes(supervisorId, visible) {
    this.nodes = this.nodes.map(
      (node) => {
        if (node.supervisor === supervisorId) {
          node.visible = visible;
          this.toggleChildNodes(node.id, visible);
          this.toggleChildLinks(node.id, visible);
        }
        return node;
      }
    );
  }

  private toggleChildLinks(supervisorId, visible) {
    this.links = this.links.map(
      (link) => {
        if (link.target.supervisor === supervisorId) {
          link.visible = visible;
        }
        return link;
      }
    );
  }

}
