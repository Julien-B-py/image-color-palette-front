import { useState } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import UserForm from "./UserForm";
import Result from "./Result";

function App() {
  const [params, setParams] = useState({
    nb_colors: 10,
    delta: 24
  });

  const [image, setImage] = useState();

  const [data, setData] = useState();

  const [loading, setLoading] = useState();



  function restart() {
    setParams({
      nb_colors: 10,
      delta: 24
    });
    setImage(null);
    setData(null);
    setLoading(null);
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
        <h1>Image Color Palette Extractor</h1>
      {!data ?   <h2>Select an image, adjust colors, delta and submit</h2>:<h2>Here is your color palette</h2>}


      {!loading && !data && (
        <img
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
        />
      )}


        {loading && (
          <div className="progress-container">
            <CircularProgress />
          </div>
        )}

        {data && <Result data={data} onRestart={restart}/>}
      </div>
    </div>
  );
}

export default App;
