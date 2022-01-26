import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

function SampleImg(props) {
  const sampleImgRef = useRef();


  // Animate sample img appearance
  useLayoutEffect(() => {
    props.timeline.from(sampleImgRef.current, {
      scale: 0,
      ease: "Back.easeOut(1.2)"
    });
  }, []);


  // Animate sample img disappearance and trigger upload when done
  useLayoutEffect(() => {
    props.submitImage &&
      props.timelineHide.to(sampleImgRef.current, {
        autoAlpha: 0,
        onComplete: () => props.onUpload()
      });
  }, [props.submitImage]);

  return (
    <img
      ref={sampleImgRef}
      className="example-palette"
      src={process.env.PUBLIC_URL + "/example.png"}
    />
  );
}

export default SampleImg;
