import { useState, useRef, useLayoutEffect } from "react";
import axios from "axios";
import { gsap } from "gsap";

import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import Heading from "./Heading";
import SampleImg from "./SampleImg";
import UserForm from "./UserForm";
import Result from "./Result";
import Footer from "./Footer";

function App() {
  const errorRef = useRef();

  const [error, setError] = useState();

  // Starting animation timeline
  const [tlInit, setTlInit] = useState(() => gsap.timeline());
  // After image submit animation timeline
  const [tlAfterSubmit, setTlAfterSubmit] = useState(() => gsap.timeline());
  // State that will be switched to true when user click on submit button
  const [submitImage, setSubmitImage] = useState(false);
  // Store user preferences
  const [params, setParams] = useState({
    nb_colors: 10,
    delta: 24
  });
  // Store image data before upload
  const [image, setImage] = useState();
  // Store server response after image upload
  const [data, setData] = useState();
  // Allow loading animation display during image processing by the server
  const [loading, setLoading] = useState();

  // Reset everything to upload another image
  function restart() {
    // Clear all states
    setData(null);
    setLoading(null);
    setParams({
      nb_colors: 10,
      delta: 24
    });
    setImage(null);
    setSubmitImage(false);
  }

  // Saves user inputs changes
  function handleChange(event) {
    HideErrorMsg();
    const { name, value } = event.target;

    setParams((oldParams) => ({ ...params, [name]: Number(value) }));
  }

  // Saves selected image data on change
  function handleImage(event) {
    HideErrorMsg();
    const formData = new FormData();
    formData.append("my-image-file", event.target.files[0]);
    setImage(formData);
  }

  // Since I didn't find a clean way to send image and user params at the same time I splitted in two POST requests
  // First we send user params
  async function sendUserParams() {
    return axios({
      method: "post",
      url: "https://color-palette-jb.herokuapp.com/api/settings",
      data: { nb_colors: params.nb_colors, delta: params.delta }
    }).then((res) => res.data.success);
  }
  // Then we upload the image
  async function uploadImage() {
    return axios
      .post("https://color-palette-jb.herokuapp.com/api/upload", image, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((res) => res.data)
      .catch((err) => {
        setSubmitImage(false);
        setImage();
        setLoading();

        setError(err.response);
      });
  }

  // Upload function
  // During operation we allow loading animation to show and we hide it at the end
  async function upload() {
    setLoading(true);
    setData(null);

    const sentParams = await sendUserParams();

    // If sentParams response is true it means success so we can go on
    if (sentParams) {
      const datas = await uploadImage();
      setData(datas);
      setLoading(false);
    }
  }

  // Error msg animation on render
  useLayoutEffect(() => {
    error &&
      gsap.from(errorRef.current, {
        autoAlpha: 0,
        yPercent: -100
      });
  }, [error]);

  // Hide error message
  function HideErrorMsg() {
    gsap.to(errorRef.current, {
      autoAlpha: 0,
      onComplete: () => setError()
    });
  }

  return (
    <div className="main">
      <div className="content">
        <Heading timeline={tlInit} data={data} />

        {!loading && !data && (
          <SampleImg
            timeline={tlInit}
            timelineHide={tlAfterSubmit}
            submitImage={submitImage}
            onUpload={upload}
          />
        )}

        {error && (
          <div className="snackbar" ref={errorRef}>
            <Alert variant="filled" severity="error">
              {`Error ${error.status} - ${
                error.data.includes("<p>")
                  ? error.data.split("<p>")[1].split("</p>")[0]
                  : error.data
              }`}
            </Alert>
          </div>
        )}

        {!loading && !data && (
          <UserForm
            timeline={tlInit}
            timelineHide={tlAfterSubmit}
            onTextChange={(e) => handleChange(e)}
            onImageChange={(e) => handleImage(e)}
            params={params}
            image={image}
            submitImage={submitImage}
            onImageSubmit={() => setSubmitImage(true)}
          />
        )}

        {loading && (
          <div className="progress-container">
            <CircularProgress />
          </div>
        )}

        {data && <Result data={data} onRestart={restart} />}
      </div>

      <Footer />
    </div>
  );
}

export default App;
