import P5 from "p5";
import "p5/lib/addons/p5.dom";

// it's stupid that this is necessary
function mod(n, m) {
  return ((n % m) + m) % m;
}

export class SteppingStones {
  private place = 1;
  private dragged = false;

  private pieces: [number, number, number][] = [];

  constructor(
    public p5: P5,
    public size: number,
    public colors: [P5.Color, P5.Color],
    public offset: [number, number]
  ) {
    // drag the board around
    this.p5.mouseDragged = (e: any) => {
      this.offset[0] += e.movementX;
      this.offset[1] += e.movementY;
      this.redraw = true;
      this.dragged = true;
    };

    // zoom in and out
    this.p5.mouseWheel = (e: any) => {
      this.size *= Math.pow(1.002, -e.delta);
      this.redraw = true;
    };

    // add pieces
    this.p5.mouseClicked = (e: any) => {
      if (this.dragged) {
        this.dragged = false;
        return;
      }
      const col = Math.floor((e.x - offset[0]) / this.size);
      const row = Math.floor((e.y - offset[1]) / this.size);

      if (this.place !== 1) {
        let sum = 0;
        for (const piece of this.pieces) {
          if (piece[0] === col && piece[1] === row) return;
          if (Math.abs(piece[0] - col) <= 1 && Math.abs(piece[1] - row) <= 1)
            sum += piece[2];
        }
        if (sum === this.place) {
          this.pieces.push([col, row, this.place]);
          this.place++;
        }
      } else {
        this.pieces.push([col, row, this.place]);
      }

      this.redraw = true;
    };

    const butt = this.p5.createButton("Finish");
    butt.position(10, 40);
    butt.mousePressed(() => {
      this.place++;
      butt.remove();
      this.redraw = true;
    });
  }

  private redraw = true;
  public draw() {
    if (!this.redraw) return;
    this.redraw = false;

    this.p5.noStroke();
    const startX = mod(this.offset[0], this.size);
    const startY = mod(this.offset[1], this.size);

    const rows = window.innerHeight / this.size + 1;
    const row0 = Math.floor(this.offset[0] / this.size);
    const cols = window.innerWidth / this.size + 1;
    const col0 = Math.floor(this.offset[1] / this.size);

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const colorIndex = mod(row0 + row + col0 + col, 2);

        this.p5.fill(this.colors[colorIndex]);

        this.p5.square(
          startX + this.size * col,
          startY + this.size * row,
          this.size
        );
      }
    }

    for (const piece of this.pieces) {
      this.p5.fill(this.p5.color(piece[2] === 1 ? "brown" : "white"));
      this.p5.circle(
        startX + (row0 + piece[0] + 0.5) * this.size,
        startY + (col0 + piece[1] + 0.5) * this.size,
        this.size * 0.85
      );

      this.p5.textSize(this.size * 0.6);
      this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
      this.p5.fill(0);
      this.p5.text(
        piece[2],
        startX + (row0 + piece[0] + 0.5) * this.size,
        startY + (col0 + piece[1] + 0.5) * this.size
      );
    }

    this.p5.textSize(25);
    this.p5.fill(255);
    this.p5.textAlign(this.p5.LEFT, this.p5.TOP);
    this.p5.text(
      "Placing " + (this.place === 1 ? "1's..." : this.place),
      10,
      10
    );
  }
}
