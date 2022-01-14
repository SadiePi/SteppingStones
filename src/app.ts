import P5 from "p5";
import "p5/lib/addons/p5.dom";
import { SteppingStones } from "./lib";

interface Config {
  grid: {
    size: number;
    offset: [number, number];
    colors: [string, string];
  };
  pieces: {
    circleSize: number;
    labelSize: number;
    colors: [string, string];
  };
}

// doesn't actually do much yet
const config: Config = {
  grid: {
    size: 80,
    offset: [10, 10],
    colors: ["black", "grey"]
  },
  pieces: {
    circleSize: 0.85,
    labelSize: 0.6,
    colors: ["brown", "white"]
  }
};

const sketch = (p5: P5) => {
  let cb: SteppingStones;

  p5.setup = (): void => {
    cb = new SteppingStones(
      p5,
      config.grid.size,
      config.grid.colors.map((c) => p5.color(c)) as [P5.Color, P5.Color],
      config.grid.offset
    );

    const canvas = p5.createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent("app");
  };

  p5.draw = (): void => {
    cb.draw();
  };
};

new P5(sketch);
