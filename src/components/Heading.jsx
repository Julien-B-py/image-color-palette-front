import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

function Heading(props) {
  const headingsRef = useRef();
  const q = gsap.utils.selector(headingsRef);

  // Animate headings appearance
  useLayoutEffect(() => {
    props.timeline
      .from(q("h1"), { autoAlpha: 0, yPercent: -100 })
      .from(q("h2"), { autoAlpha: 0, yPercent: -100 });
  }, []);

  return (
    <div className="headings" ref={headingsRef}>
      <h1>Image Color Palette Extractor</h1>
      {!props.data ? (
        <h2>Select an image, adjust colors, delta and submit</h2>
      ) : (
        <h2>Here is your color palette</h2>
      )}
    </div>
  );
}

export default Heading;