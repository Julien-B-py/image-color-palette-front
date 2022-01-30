import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useRef, useLayoutEffect, useState } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

function Result(props) {
  const tl = useRef();
  const el = useRef();

  const successRef = useRef();
  // Used to handle successful copy message visibility and animation
  const [copiedColor, setCopiedColor] = useState();

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

  // Successful clipboard copy msg animation on render
  useLayoutEffect(() => {
    copiedColor &&
      gsap.from(successRef.current, {
        autoAlpha: 0,
        yPercent: -100
      });
  }, [copiedColor]);

  // Copy the clicked color from the palette to the clipboard
  function copyColor(color) {
    navigator.clipboard.writeText(color.toUpperCase());
    setCopiedColor(color.toUpperCase());
    HideAlertMsg();
  }

  // Hide success message after 3 seconds
  function HideAlertMsg() {
    setTimeout(function () {
      gsap.to(successRef.current, {
        autoAlpha: 0,
        onComplete: () => setCopiedColor()
      });
    }, 3000);
  }

  return (
    <div className="result" ref={el}>
      <div className="img-palette-container">
        <div
          className="img-palette"
          style={{ borderColor: props.theme && "rgba(255,255,255,.87)" }}
        >
          <img
            className="resized-img"
            style={{ borderColor: props.theme && "rgba(255,255,255,.87)" }}
            src={`data:image/jpeg;base64,${props.data.img_data}`}
            alt="Submitted"
          />

          <div className="color-palette">
            {props.data.color_palette.map((color, index) => (
              <div
                key={index}
                className="color-place"
                style={{ backgroundColor: color }}
                onClick={() => copyColor(color)}
              ></div>
            ))}
          </div>
        </div>

        {copiedColor && (
          <div className="snackbar fixed" ref={successRef}>
            <Alert variant="filled" severity="success">
              {`Successfully copied ${copiedColor} to the clipboard.`}
            </Alert>
          </div>
        )}

        <div className="s-button">
          <Button variant="contained" onClick={props.onRestart}>
            Use another image
          </Button>
        </div>
      </div>
      <h1
        style={
          props.theme && { color: "rgba(255,255,255,.87)", fontWeight: 500 }
        }
      >
        Top 20 colors occurrences
      </h1>

      <div className="all-colors container-fluid">
        <div className="row">
          {props.data.top_20_colors.map((color, index) => (
            <div
              key={index}
              className="col-lg-4 col-sm-6 color-box"
              style={props.theme && { borderColor: "rgba(255,255,255,.87)" }}
            >
              <div
                className="color-header"
                style={{
                  backgroundColor: color.hex,
                  borderColor: props.theme && "rgba(255,255,255,.87)"
                }}
              >
                <div
                  className="color-rank"
                  style={
                    props.theme && {
                      color: "rgba(255,255,255,.87)",
                      backgroundColor: "#121212"
                    }
                  }
                >
                  {index + 1}
                </div>
              </div>

              <div className="color-body">
                <div
                  className="color-details"
                  style={props.theme && { color: "rgba(255,255,255,.87)" }}
                >
                  <p
                    style={
                      props.theme ? { fontWeight: 500 } : { fontWeight: 600 }
                    }
                  >
                    HEX: {color.hex}
                  </p>
                  <p
                    style={
                      props.theme ? { fontWeight: 500 } : { fontWeight: 600 }
                    }
                  >
                    Ratio: {color.ratio}%
                  </p>
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
