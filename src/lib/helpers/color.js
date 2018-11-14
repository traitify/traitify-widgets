import Color from "color";

export function rgba(_color, opacity) {
  const color = Color(_color);

  return `rgba(${color.red()},${color.green()},${color.blue()},${opacity / 100})`;
}

export default Color;
