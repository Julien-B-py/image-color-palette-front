import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function UserForm(props) {
  const formRef = useRef();
  const submitRef = useRef();
  const q = gsap.utils.selector(formRef);

  // Memorize that submit button disappearance already have been animated
  const [buttonAnim, setButtonAnim] = useState(false);

  // Animate form inputs appearance
  useLayoutEffect(() => {
    props.timeline.from(q(".single-input"), { autoAlpha: 0, stagger: 0.3 });
  }, []);

  // Animate submit button appearance
  useLayoutEffect(() => {
    if (props.image && !buttonAnim) {
      gsap.from(submitRef.current, { autoAlpha: 0, yPercent: 100 });
      setButtonAnim(true);
    }
  }, [props.image]);

  // Animate submit button and user inputs disappearance after click on submit
  useLayoutEffect(() => {
    props.submitImage &&
      props.timelineHide
        .to(q(".single-input"), { autoAlpha: 0 }, "<")
        .to(submitRef.current, { autoAlpha: 0 }, "<");
  }, [props.submitImage]);

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

        <div className="user-settings">
          <TextField
            className="single-input"
            label="Colors (5-10)"
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
            <Button variant="contained" onClick={() => props.onImageSubmit()}>
              Submit image
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}

export default UserForm;
