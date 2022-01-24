import { useState } from "react";
import axios from "axios";

function App() {
  const [params, setParams] = useState({
    nb_colors: 10,
    delta: 24
  });

  const [image, setImage] = useState();

  const [data, setData] = useState();

  const [loading, setLoading] = useState();

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
    <div className="inner-body">
      <h1> Welcome to my color palette website </h1>

      <img className="example-palette" src={process.env.PUBLIC_URL + 'example.png'} />
      <div className="custom-form">
        <form  >
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

      {loading && <h1>Loading ...</h1>}

      {data && (
        <div>
          <div class="img-palette">
            <div className="color-palette">
              {data.color_palette.map((color) => (
                <div
                  class="color-place"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>

          <h1>Top 20 colors occurrences</h1>

          <div class="all-colors container-fluid">
            <div class="row">
              {data.top_20_colors.map((color, index) => (
                <div class="col-lg-4 col-sm-6 color-box">
                  <div
                    class="color-header"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div class="color-rank">{index + 1}</div>
                  </div>

                  <div class="color-body">
                    <div class="color-details">
                      <p>HEX: {color.hex}</p>
                      <p>Ratio: {color.ratio}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
