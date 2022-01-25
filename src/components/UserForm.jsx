import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function UserForm(props) {
  const formRef = useRef();
  const submitRef = useRef();
  const q = gsap.utils.selector(formRef);

  const [buttonAnim, setButtonAnim] = useState(false);

  const tl = gsap
    .timeline({ paused: true })
    .to(q(".single-input"), { autoAlpha: 1, stagger: 0.3 });

  // Animate form after headings and example image animation is over
  useLayoutEffect(() => {
    if (props.animateFirst) {
      tl.play();
    }
  }, [props.animateFirst]);

  // Animate submit button
  useLayoutEffect(() => {
    if (props.image && !buttonAnim) {
      gsap.from(submitRef.current, { autoAlpha: 0, yPercent: 100 });
      setButtonAnim(true);
    }
  }, [props.image]);

  function hideFormThenUpload() {
    gsap
      .timeline({ onComplete: props.hideSampleImg })
      .to(submitRef.current, { autoAlpha: 0, duration: 0.1 })
      .to(q(".single-input"), { autoAlpha: 0, stagger: -0.1 });
    // props.onUpload()
  }

  return (
    <div className="custom-form">
      <form ref={formRef}>
        <div className="form-group  required">
          <input
            className="single-input"
            id="image_file"
            name="image_file"
            required
            type="file"
            onChange={props.onImageChange}
          />
        </div>

        {props.params.file && (
          <div className="preview-global">
            <img className="preview" />
            <i className="fas fa-trash-alt"></i>
          </div>
        )}

        <div className="user-settings">
          <TextField
            className="single-input"
            label="Number of colors (5-10)"
            type="number"
            name="nb_colors"
            value={props.params.nb_colors}
            onChange={props.onTextChange}
            variant="outlined"
          />

          <TextField
            className="single-input"
            label="Delta (1-255)"
            type="number"
            name="delta"
            value={props.params.delta}
            onChange={props.onTextChange}
            variant="outlined"
          />
        </div>

        {props.image && (
          <div className="submit-container" ref={submitRef}>
            <Button variant="contained" onClick={hideFormThenUpload}>
              Submit image
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

export default UserForm;
