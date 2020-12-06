import React, { useState } from "react";
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";

import { GET_TASKS_QUERY } from '../../pages/App'
import Error from '../Shared/Error'

const CreateTask = ({ classes }) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (event, createTask) => {
    event.preventDefault()
    setSubmitting(true)
    createTask({ variables: { title, description } })
  }

  return (
    <>
      {/* Create Task Button */}
      <Button onClick={() => setOpen(true)} variant="fab" className={classes.fab} color="secondary">
        {open ? <ClearIcon /> : <AddIcon />}
      </Button>


      {/* Create Task Dialog */}
      <Mutation
        mutation={CREATE_TASK_MUTATION}
        onCompleted={data => {
          console.log({ data });
          setSubmitting(false);
          setOpen(false);
          setTitle("");
          setDescription("");
        }}
        refetchQueries={() => [{ query: GET_TASKS_QUERY }]}
      >
        {(createTask, { loading, error }) => {
          if (error) return <Error error={error} />;

          return (
            <Dialog open={open} className={classes.dialog}>
              <form onSubmit={event => handleSubmit(event, createTask)}>
                <DialogTitle>Create Task</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Add a Title, Description
                  </DialogContentText>
                  <FormControl fullWidth>
                    <TextField
                      label="Title"
                      placeholder="Add Title"
                      onChange={event => setTitle(event.target.value)}
                      value={title}
                      className={classes.textField}
                    />
                  </FormControl>
                  <FormControl fullWidth>
                    <TextField
                      multiline
                      rows="3"
                      label="Description"
                      placeholder="Add Description"
                      onChange={event => setDescription(event.target.value)}
                      value={description}
                      className={classes.textField}
                    />
                  </FormControl>

                </DialogContent>
                <DialogActions>
                  <Button
                    disabled={submitting}
                    onClick={() => setOpen(false)}
                    className={classes.cancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      submitting ||
                      !title.trim() ||
                      !description.trim()
                    }
                    type="submit"
                    className={classes.save}
                  >
                    {submitting ? (
                      <CircularProgress
                        className={classes.save}
                        size={24}
                      />
                    ) : (
                        "Add Task"
                      )}
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          )
        }}
      </Mutation>
    </>
  );
};


const CREATE_TASK_MUTATION = gql`
  mutation ($title: String!, $description: String!) {
    createTask(title: $title, description: $description) {
      task {
        id
        title
        description
      }
    }
  }

`

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  dialog: {
    margin: "0 auto",
    maxWidth: 550
  },
  textField: {
    margin: theme.spacing.unit
  },
  cancel: {
    color: "red"
  },
  save: {
    color: "green"
  },
  button: {
    margin: theme.spacing.unit * 2
  },
  icon: {
    marginLeft: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: "200"
  }
});

export default withStyles(styles)(CreateTask);
