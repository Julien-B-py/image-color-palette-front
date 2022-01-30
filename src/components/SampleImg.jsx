import { useRef, useLayoutEffect } from "react";

import Tooltip from "@mui/material/Tooltip";

function SampleImg(props) {
  const sampleImgRef = useRef();

  const colors = [
    "#1EA549",
    "#CA2128",
    "#4165AF",
    "#AF499C",
    "#F8981D",
    "#DDA043",
    "#EFBE1B",
    "#F8C75E",
    "#D4D4D4",
    "#FFFFFF"
  ];

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
    <div className="img-palette" ref={sampleImgRef}>
      <img
        className="resized-img"
        src={process.env.PUBLIC_URL + "/example.jpg"}
        alt="Submitted"
      />

      <div className="color-palette">
        {colors.map((color, index) => (
          <Tooltip title={color} placement="top">
            <div
              key={index}
              className="color-place"
              style={{ backgroundColor: color }}
            ></div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

export default SampleImg;
