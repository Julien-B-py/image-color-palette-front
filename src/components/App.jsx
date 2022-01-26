import { useState,  } from "react";
import axios from "axios";
import { gsap } from "gsap";

import CircularProgress from "@mui/material/CircularProgress";
import Heading from "./Heading";
import SampleImg from "./SampleImg";
import UserForm from "./UserForm";
import Result from "./Result";

function App() {

// Starting animation timeline
const [tlInit, setTlInit] = useState(() => gsap.timeline());
// After image submit animation timeline
const [tlAfterSubmit, setTlAfterSubmit] = useState(() => gsap.timeline());

const [submitImage, setSubmitImage] = useState(false);

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
    setSubmitImage(false);

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

      <Heading timeline={tlInit}  data={data}/>


        {!loading && !data && (
<SampleImg timeline={tlInit}           timelineHide={tlAfterSubmit}             submitImage={submitImage} onUpload={upload}/>
        )}

        {!loading && !data && (
          <UserForm timeline={tlInit}
          timelineHide={tlAfterSubmit}
            onTextChange={(e) => handleChange(e)}
            onImageChange={(e) => handleImage(e)}
            onUpload={upload}
            params={params}
            image={image}
            submitImage={submitImage}
            onImageSubmit={()=> setSubmitImage(true)}

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
