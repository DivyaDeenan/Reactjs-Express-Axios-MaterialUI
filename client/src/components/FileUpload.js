import React, {  useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { orange, pink } from '@material-ui/core/colors';
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    secondary: orange,
    primary : pink
 
  },
});

const FileUpload = (props) => {
  //export class FileUpload extends Component {

    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);




 /*const onChange = e => {
   setFile(e.target.files[0]);
    console.log(file);
    setFilename(e.target.files[0].name);
    console.log(filename);
  };
*/
 
const onChange = e => {
  setFile(e.target.files[0]);
  setFilename(e.target.files[0].name);
};


  const getStyle = () => {
    return {
      background: 'black',
     
    }
  }
  const back = e => {
    e.preventDefault();
    props.prevStep();
  };

  const next = e => {
    e.preventDefault();
    props.nextStep();
  };


 const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    

    try {
      console.log(formData);
      const res = await axios.post('/upload', formData, {
        
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );

          // Clear percentage
          setTimeout(() => setUploadPercentage(0), 10000);
        }
      });

      const { fileName, filePath } = res.data;
     

      setUploadedFile({ fileName, filePath });

      setMessage('File Uploaded');
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };
  //render() {
   
  

  return (
    <MuiThemeProvider theme={theme}>
      <React.Fragment>
        <Dialog
          open={true}
          fullWidth={true}
          maxWidth='sm'
          style={getStyle}
        >
   <AppBar position="static" color="secondary"><h1>Upload File</h1></AppBar>
          {message ? <Message msg={message} /> : null}
          <form onSubmit={onSubmit}>
            <div className='custom-file mb-4'>
              <input
                type='file'
                className='custom-file-input'
                id='customFile'
                onChange={onChange}
              
              />
              <label className='custom-file-label' htmlFor='customFile'>
                {filename}
              </label>
            </div>

            <Progress percentage={uploadPercentage} />

            <input
              type='submit'
              value='Upload'
              className='btn btn-primary btn-block mt-4'
            />
          </form>
          {uploadedFile ? (
            <div className='row mt-5'>
              <div className='col-md-6 m-auto'>
                <h3 className='text-center'>{uploadedFile.fileName}</h3>
                <img style={{ width: '100%' }} src={uploadedFile.filePath} alt='' />
              </div>
            </div>
          ) : null}
          <br />

          <Button
            color="secondary"
            variant="contained"
            onClick={back}
          >Back</Button>

          <Button
            color="primary"
            variant="contained"
            onClick={next}
          >Submit</Button>
        </Dialog>
      </React.Fragment>
    </MuiThemeProvider>
  );
//}
}

export default FileUpload;
