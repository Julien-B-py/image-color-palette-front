import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function UserForm(props) {
  return (
    <div className="custom-form">
      <form>
        <div className="form-group  required">
          <input
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
            label="Number of colors (5-10)"
            type="number"
            name="nb_colors"
            value={props.params.nb_colors}
            onChange={props.onTextChange}
            variant="outlined"
          />

          <TextField
            label="Delta (1-255)"
            type="number"
            name="delta"
            value={props.params.delta}
            onChange={props.onTextChange}
            variant="outlined"
          />
        </div>

        {props.image && (
          <Button variant="contained" onClick={props.onUpload}>
            Submit image
          </Button>
        )}
      </form>
    </div>
  );
}

export default UserForm;
