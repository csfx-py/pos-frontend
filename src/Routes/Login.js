import {
  Button,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { UtilityContext } from "../Contexts/UtilityContext";
import { AuthContext } from "../Contexts/AuthContext";
import { BsFillShieldLockFill } from "react-icons/bs";
import ReDash from "../Components/ReDash";
import LoginImg from "../Images/login.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh",
    backgroundImage: `url(${LoginImg})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  },
  paper: {
    padding: theme.spacing(8, 2),
    maxWidth: "100%",
    [theme.breakpoints.up("md")]: {
      minWidth: "400px",
    },
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    margin: theme.spacing(2),
  },
}));

function Login() {
  const classes = useStyles();

  const history = useHistory();

  const { setIsLoading } = useContext(UtilityContext);
  const { login } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    name: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { name, password } = credentials;
    if (name && password) {
      try {
        const res = await login(name, password);
        setCredentials({ name: "", password: "" });
        console.log(res.roles_id);
        if (res.success) {
          switch (res.roles_id) {
            case 1:
              setIsLoading(false);
              history.push("/admin");
              break;
            case 2:
              setIsLoading(false);
              history.push("/shop");
              break;
            default:
              setIsLoading(false);
              break;
          }
        }
      } catch (err) {
        setIsLoading(false);
        console.error(err);
      }
    }
    setIsLoading(false);
  };

  return (
    <Grid
      container
      className={classes.root}
      justifyContent="center"
      alignItems="center"
    >
      <ReDash />
      <Grid item>
        <Paper className={classes.paper} elevation={8}>
          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            className={classes.form}
          >
            <BsFillShieldLockFill fontSize="2rem" color="#10b981" />
            <Typography variant="h5" component="h2" align="center">
              Sign In
            </Typography>
            <TextField
              label="Username"
              name="name"
              value={credentials.name}
              fullWidth
              required
              onChange={handleChange}
            />
            <TextField
              label="Password"
              name="password"
              value={credentials.password}
              type="password"
              fullWidth
              required
              onChange={handleChange}
            />
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              className={classes.btn}
              fullWidth
            >
              Sign in
            </Button>
            <Typography variant="h6" component="h2" align="left">
              If you do not have an account, contact Admin
            </Typography>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Login;
