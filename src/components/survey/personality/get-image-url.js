import toQueryString from "lib/common/object/to-query-string";

const roundTo = 50;
const round = (larger, smaller) => {
  const ratio = (1.0 * larger) / smaller;
  const newLarger = Math.ceil(larger / roundTo) * roundTo;
  const newSmaller = Math.round(newLarger / ratio);

  return [newLarger, newSmaller];
};
const roundDimensions = ({height: originalHeight, width: originalWidth}) => {
  let height;
  let width;

  if(originalWidth >= originalHeight) {
    [width, height] = round(originalWidth, originalHeight);
  } else {
    [height, width] = round(originalHeight, originalWidth);
  }

  return {height, width};
};

export default function getImageURL({likert, size, slide}) {
  const [width, height] = size;
  const slideImage = slide.images
    .reduce((max, current) => (max.height > current.height ? max : current));
  if(width <= 0 || height <= 0) { return slideImage.url; }

  const {height: h, width: w} = roundDimensions({
    height: (likert && window.innerWidth <= 768) ? height - 74 : height,
    width
  });
  const params = {h, w};

  if(slideImage.url.includes("imagekit")) {
    params.tr = [
      "w-{{width}}_mul_1",
      "ar-{{width}}-{{height}}",
      "c-at_least:w-{{width}}_mul_2",
      "ar-{{width}}-{{height}}",
      "cm-extract",
      "xc-cw_mul_0.{{focusX}}",
      "yc-ch_mul_0.{{focusY}}:w-{{width}}",
      "h-{{height}}",
      "f-auto"
    ].join(",")
      .replace(/{{height}}/g, h)
      .replace(/{{width}}/g, w)
      .replace(/{{focusX}}/g, slideImage.focusX)
      .replace(/{{focusY}}/g, slideImage.focusY);

    delete params.h;
    delete params.w;
  }

  if(slideImage.url.includes("?")) {
    return `${slideImage.url}&${toQueryString(params)}`;
  }

  return `${slideImage.url}?${toQueryString(params)}`;
}
