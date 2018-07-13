import Color from "color";

Color.rgba = (color, opacity)=>{
  color = Color(color);
  return `rgba(${color.red()},${color.green()},${color.blue()},${opacity/100})`;
};

export default Color;
