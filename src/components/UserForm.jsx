import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function UserForm(props) {
  // Inputs props
  const deltaInputProps = {
    label: "Delta (1-255)",
    name: "delta",
    value: props.params.delta,
    inputProps: { min: 1, max: 255 }
  };

  const nbColorsInputProps = {
    label: "Colors (5-10)",
    name: "nb_colors",
    value: props.params.nb_colors,
    inputProps: { min: 5, max: 10 }
  };

  const commonInputProps = {
    className: "single-input",
    type: "number",
    onChange: props.onTextChange,
    variant: "outlined"
  };

  // Custom Textfield component for dark mode
  const CssTextField = styled(TextField)({
    "& label.Mui-focused": {
      color: "rgba(255, 255, 255, 0.60)"
    },
    "& label.MuiFormLabel-filled": {
      color: "rgba(255, 255, 255, 0.60)"
    },

    "& .MuiInputBase-root": {
      color: "rgba(255, 255, 255, 0.60)"
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "rgba(255, 255, 255, 0.87)"
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.87)"
      },
      "&:hover fieldset": {
        borderColor: "#2f75bc"
      },
      "&.Mui-focused fieldset": {
        borderColor: "#3b75b0"
      }
    }
  });

  // Create elements ref for animation
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
            style={props.theme ? { color: "rgba(255,255,255,.60)" } : {}}
            className="single-input"
            id="image_file"
            name="image_file"
            required
            type="file"
            onChange={props.onImageChange}
          />
        </div>

        <div className="user-settings">
          {props.theme ? (
            <CssTextField {...nbColorsInputProps} {...commonInputProps} />
          ) : (
            <TextField {...nbColorsInputProps} {...commonInputProps} />
          )}

          {props.theme ? (
            <CssTextField {...deltaInputProps} {...commonInputProps} />
          ) : (
            <TextField {...deltaInputProps} {...commonInputProps} />
          )}
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
