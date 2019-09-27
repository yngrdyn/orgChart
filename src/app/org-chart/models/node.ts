import CONFIG from 'src/app/app.config';

export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  location: string;

  id: string;
  linkCount: number = 0;

  constructor(id, location) {
    this.id = id;
    this.location = location;
  }

  normal = () => {
    return Math.sqrt(this.linkCount / CONFIG.N);
  }

  get r() {
    return 30;
  }

  get fontSize() {
    return (30 * this.normal() + 10) + 'px';
  }

  get color() {
    if (this.location === 'Barcelona') {
      return CONFIG.SPECTRUM[4];
    }
    if (this.location === 'Linz') {
      return CONFIG.SPECTRUM[0];
    }
    let index = Math.floor(CONFIG.SPECTRUM.length * this.normal());
    return CONFIG.SPECTRUM[index];
  }
}
