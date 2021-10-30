import {
  Button,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import { MdDeleteForever } from "react-icons/md";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 200,
    maxHeight: 200,
    [theme.breakpoints.up("md")]: {
      minHeight: 350,
      maxHeight: 350,
    },
  },
}));

function CustomCell({ row, column, value, handleChange, handleDelete }) {
  if (column.type) {
    if (column.type === "input")
      return (
        <TextField
          type="number"
          value={value}
          name={column.id}
          onChange={(e) => {
            handleChange(row, e.target.name, e.target.value);
          }}
        />
      );
    if (column.type === "button")
      return (
        <Button
          variant="contained"
          color="secondary"
          onClick={(e) => {
            handleDelete(row);
          }}
        >
          <MdDeleteForever />
        </Button>
      );
  }
  return column.format && typeof value === "number"
    ? column.format(value)
    : value || "";
}

function EditTable({ columns, rows, handleChange, handleDelete }) {
  const classes = useStyles();

  return (
    <Paper elevation={2}>
      <TableContainer className={classes.root}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row, index) => {
              return (
                <TableRow hover tabIndex={-1} key={index}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {console.log(row)}
                        <CustomCell
                          row={row}
                          column={column}
                          value={value}
                          handleChange={handleChange}
                          handleDelete={handleDelete}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default EditTable;
