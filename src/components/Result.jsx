import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef, useLayoutEffect } from "react";

import Button from "@mui/material/Button";

function Result(props) {
  const tl = useRef();
  const el = useRef();

  useLayoutEffect(() => {
    const q = gsap.utils.selector(el);

    // Animates top 20 color boxes on scroll
    const animTop20 = () => {
      gsap.registerPlugin(ScrollTrigger);

      gsap.set(q(".color-box"), {
        autoAlpha: 0,
        y: 60
      });

      ScrollTrigger.batch(q(".color-box"), {
        onEnter: (elements) => {
          gsap.to(elements, {
            autoAlpha: 1,
            y: 0,
            stagger: 0.15
          });
        },
        start: "top 95%",
        // markers: true,
        once: true
      });
    };

    // Animates color palette, button and h1 appearance then start the scrolltrigger animation
    tl.current = gsap
      .timeline({ onComplete: () => animTop20() })
      .from(q(".img-palette"), { scale: 0 })
      .from(q(".color-place"), { scale: 0, stagger: 0.1 })
      // clear effect after to remove white line appearing sometimes
      .set(q(".color-place"), { clearProps: "transform" })
      .from(q(".s-button"), { autoAlpha: 0, yPercent: 100 }, ">0.25")
      .from(q("h1"), { autoAlpha: 0, yPercent: 100 });
  }, []);

  return (
    <div className="result" ref={el}>
      <div className="img-palette-container">
        <div className="img-palette">
          <img
            className="resized-img"
            src={`data:image/jpeg;base64,${props.data.img_data}`}
            alt="Submitted"
          />

          <div className="color-palette">
            {props.data.color_palette.map((color, index) => (
              <div
                key={index}
                className="color-place"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>

        <div className="s-button">
          <Button variant="contained" onClick={props.onRestart}>
            Use another image
          </Button>
        </div>
      </div>
      <h1>Top 20 colors occurrences</h1>

      <div className="all-colors container-fluid">
        <div className="row">
          {props.data.top_20_colors.map((color, index) => (
            <div key={index} className="col-lg-4 col-sm-6 color-box">
              <div
                className="color-header"
                style={{ backgroundColor: color.hex }}
              >
                <div className="color-rank">{index + 1}</div>
              </div>

              <div className="color-body">
                <div className="color-details">
                  <p>HEX: {color.hex}</p>
                  <p>Ratio: {color.ratio}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Result;
