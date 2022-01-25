import Button from "@mui/material/Button";

function Result(props) {
  return (
    <div className="result">
      <div className="img-palette-container">
        <div className="img-palette">
          <img
            className="resized-img"
            src={`data:image/jpeg;base64,${props.data.img_data}`}
          />

          <div className="color-palette">
            {props.data.color_palette.map((color, index) => (
              <div
                key={index}
                className="color-place"
                style={{ backgroundColor: color }}
              ></div>
            ))}
          </div>
        </div>

        <Button variant="contained" onClick={props.onRestart}>
          Use another image
        </Button>
      </div>
      <h1>Top 20 colors occurrences</h1>

      <div className="all-colors container-fluid">
        <div className="row">
          {props.data.top_20_colors.map((color, index) => (
            <div key={index} className="col-lg-4 col-sm-6 color-box">
              <div
                className="color-header"
                style={{ backgroundColor: color.hex }}
              >
                <div className="color-rank">{index + 1}</div>
              </div>

              <div className="color-body">
                <div className="color-details">
                  <p>HEX: {color.hex}</p>
                  <p>Ratio: {color.ratio}%</p>
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
