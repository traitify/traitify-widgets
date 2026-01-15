import PropTypes from "prop-types";
import {useEffect, useLayoutEffect, useRef} from "react";

function Canvas({options, setup, ...props}) {
  const canvas = useRef(null);
  const element = useRef(null);

  useEffect(() => {
    if(!element.current) { return; }
    if(canvas.current) {
      canvas.current.update(options);
      return;
    }

    canvas.current = setup(element.current, options);
    canvas.current.render();
  }, [options, setup]);

  useEffect(() => (
    () => {
      if(!canvas.current) { return; }

      canvas.current.destroy();
      canvas.current = null;
    }
  ), [setup]);

  useLayoutEffect(() => {
    const resize = () => {
      if(!element.current) { return; }
      if(canvas.current) { return canvas.current.resize(); }

      canvas.current = setup(element.current, options);
      canvas.current.render();
    };

    window.addEventListener("resize", resize);

    resize();

    return () => window.removeEventListener("resize", resize);
  }, [setup]);

  return <canvas ref={element} {...props} />;
}

Canvas.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.object.isRequired,
  setup: PropTypes.func.isRequired
};

export default Canvas;
