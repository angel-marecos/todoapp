import React, { useState, useContext } from "react";
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
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";

import Error from '../Shared/Error'
import { UserContext } from '../../Root'

const UpdateTask = ({ classes, task }) => {
  const currentUser = useContext(UserContext)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [submitting, setSubmitting] = useState(false)
  const isCurrentUser = currentUser.id === task.postedBy.id

  const handleSubmit = (event, updateTask) => {
    event.preventDefault()
    setSubmitting(true)
    updateTask({ variables: { taskId: task.id, title, description } })
  }

  return isCurrentUser && (
    <>
      {/* Update Task Button */}
      <IconButton onClick={() => setOpen(true)}>
        <EditIcon />
      </IconButton>


      {/* Update Task Dialog */}
      <Mutation
        mutation={UPDATE_TASK_MUTATION}
        onCompleted={data => {
          console.log({ data });
          setSubmitting(false);
          setOpen(false);
          setTitle("");
          setDescription("");
        }}
      //refetchQueries={() => [{ query: GET_TASKS_QUERY }]}
      >
        {(updateTask, { loading, error }) => {
          if (error) return <Error error={error} />;

          return (
            <Dialog open={open} className={classes.dialog}>
              <form onSubmit={event => handleSubmit(event, updateTask)}>
                <DialogTitle>Update Task</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Add a Title, Description
                  </DialogContentText>
                  <FormControl fullWidth>
                    <TextField
                      label="Title"
                      placeholder="Edit Title"
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
                      placeholder="Edit Description"
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
                        "Edit Task"
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

const UPDATE_TASK_MUTATION = gql`
  mutation($taskId: Int!, $title: String, $description: String) {
    updateTask(
      taskId: $taskId
      title: $title
      description: $description
    ) {
      task {
        id
        title
        description
        likes {
          id
        }
        postedBy {
          id
          username
        }
      }
    }
  }
`;

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
  }
});

export default withStyles(styles)(UpdateTask);
