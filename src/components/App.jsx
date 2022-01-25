import { useState, useRef, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { gsap } from "gsap";

import CircularProgress from "@mui/material/CircularProgress";
import UserForm from "./UserForm";
import Result from "./Result";

function App() {
  const headingsRef = useRef();
  const sampleImgRef = useRef();

  const q = gsap.utils.selector(headingsRef);

  const tl = useRef();

  const [animateFirst, setAnimateFirst] = useState();

  useLayoutEffect(() => {
    tl.current = gsap
      .timeline({ onComplete: () => setAnimateFirst(true) })
      .from(q("h1"), { autoAlpha: 0, yPercent: -100 })
      .from(q("h2"), { autoAlpha: 0, yPercent: -100 })
      .from(sampleImgRef.current, { scale: 0, ease: "Back.easeOut(1.2)" });
  }, []);

  function hideSampleImg() {
    gsap.to(sampleImgRef.current, {
      scale: 0,
      duration: 0.5,
      onComplete: () => upload()
    });
  }

  const [params, setParams] = useState({
    nb_colors: 10,
    delta: 24
  });

  const [image, setImage] = useState();

  const [data, setData] = useState();

  const [loading, setLoading] = useState();

  // Reset to upload another image
  function restart() {
    // Clear all states
    setData(null);
    setLoading(null);
    setParams({
      nb_colors: 10,
      delta: 24
    });
    setImage(null);

    // Allow form reappearance
    setTimeout(function () {
      setAnimateFirst(false);
      setAnimateFirst(true);
    }, 1000);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setParams((oldParams) => ({ ...params, [name]: Number(value) }));
  }

  function handleImage(event) {
    const formData = new FormData();
    formData.append("my-image-file", event.target.files[0]);
    setImage(formData);
  }

  async function sendUserParams() {
    return axios({
      method: "post",
      url: "https://color-palette-jb.herokuapp.com/api/settings",
      data: { nb_colors: params.nb_colors, delta: params.delta }
    }).then((res) => res.data.success);
  }

  async function uploadImage() {
    return axios
      .post("https://color-palette-jb.herokuapp.com/api/upload", image, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then((res) => res.data);
  }

  async function upload() {
    setLoading(true);
    setData(null);

    const sentParams = await sendUserParams();

    if (sentParams) {
      const datas = await uploadImage();
      setData(datas);
      setLoading(false);
    }
  }

  return (
    <div className="main-content">
      <div className="main">
        <div className="headings" ref={headingsRef}>
          <h1>Image Color Palette Extractor</h1>
          {!data ? (
            <h2>Select an image, adjust colors, delta and submit</h2>
          ) : (
            <h2>Here is your color palette</h2>
          )}
        </div>

        {!loading && !data && (
          <img
            ref={sampleImgRef}
            className="example-palette"
            src={process.env.PUBLIC_URL + "/example.png"}
          />
        )}

        {!loading && !data && (
          <UserForm
            onTextChange={(e) => handleChange(e)}
            onImageChange={(e) => handleImage(e)}
            onUpload={upload}
            params={params}
            image={image}
            animateFirst={animateFirst}
            hideSampleImg={hideSampleImg}
          />
        )}

        {loading && (
          <div className="progress-container">
            <CircularProgress />
          </div>
        )}

        {data && <Result data={data} onRestart={restart} />}
      </div>
    </div>
  );
}

export default App;
