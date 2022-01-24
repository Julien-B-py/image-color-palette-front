import { useState } from "react";
import axios from "axios";

function App() {
  const [params, setParams] = useState({
    nb_colors: 10,
    delta: 24
  });

  const [image, setImage] = useState();

  function handleChange(event) {
    const { name, value } = event.target;

    setParams((oldParams) => ({ ...params, [name]: Number(value) }));
  }

  function handleImage(event) {
    const formData = new FormData();
    formData.append("my-image-file", event.target.files[0]);
    setImage(formData);
  }

  function upload() {
    axios
      .post("https://color-palette-jb.herokuapp.com/api/settings", {
        nb_colors: params.nb_colors,
        delta: params.delta
      })
      .then((res) => {
        console.log("Response: ", res);
        if (res.data.success === true) {
          axios
            .post("https://color-palette-jb.herokuapp.com/api/upload", image, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            })
            .then((res) => {
              console.log(res);
            });
        }
      });
  }

  return (
    <div className="inner-body">
      <h1> Welcome to my color palette website </h1>

      <img className="example-palette" src="/static/img/example.png" />
      <div className="custom-form">
        <form
          action=""
          method="post"
          className="form"
          encType="multipart/form-data"
          role="form"
        >
          <div className="form-group  required">
            <label className="control-label" htmlFor="image_file">
              Select an image to get his corresponding color palette
            </label>

            <input
              id="image_file"
              name="image_file"
              required
              type="file"
              onChange={(e) => handleImage(e)}
            />
          </div>

          {params.file && (
            <div className="preview-global">
              <img className="preview" />
              <i className="fas fa-trash-alt"></i>
            </div>
          )}

          <div className="form-group  required">
            <label className="control-label" htmlFor="nb_colors">
              Number of colors(5 - 10):
            </label>
            <input
              className="form-control"
              id="nb_colors"
              name="nb_colors"
              required
              type="number"
              value={params.nb_colors}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="form-group  required">
            <label className="control-label" htmlFor="delta">
              Delta(1 - 255):
            </label>

            <input
              className="form-control"
              id="delta"
              name="delta"
              required
              type="number"
              value={params.delta}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <input
            className="btn btn-default"
            id="submit"
            name="submit"
            type="button"
            value="Submit image"
            onClick={upload}
          />
        </form>
      </div>
    </div>
  );
}

export default App;
