import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { ForceGraphComponent } from './org-chart/components/force-graph/force-graph.component';
import { NodeComponent } from './org-chart/components/node/node.component';
import { LinkComponent } from './org-chart/components/link/link.component';
import { DraggableDirective } from './org-chart/directives/draggable.directive';
import { ZoomableDirective } from './org-chart/directives/zoomable.directive';
import { OrgChartComponent } from './org-chart/org-chart.component';
import { ForceGraphService } from './org-chart/services/force-graph.service';

@NgModule({
  declarations: [
    AppComponent,
    ForceGraphComponent,
    NodeComponent,
    LinkComponent,
    DraggableDirective,
    ZoomableDirective,
    OrgChartComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [ForceGraphService],
  bootstrap: [AppComponent]
})
export class AppModule { }
