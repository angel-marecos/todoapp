import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link } from 'react-router-dom'

import LikeTask from './LikeTask'
import DeleteTask from './DeleteTask'
import UpdateTask from './UpdateTask'

const TaskList = ({ classes, tasks }) => (
  <List>
    {tasks.map(task => (
      <ExpansionPanel key={task.id}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <ListItem className={classes.root}>
            <LikeTask taskId={task.id} likeCount={task.likes.length} />
            <ListItemText
              primaryTypographyProps={{
                variant: "subheading",
                color: 'primary'
              }}
              primary={task.title}
              secondary={
                <Link
                  className={classes.link}
                  to={`/profile/${task.postedBy.id}`}
                >
                  {task.postedBy.username}
                </Link>
              }
            />
          </ListItem>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <Typography variant="body1">
            {task.description}
          </Typography>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <UpdateTask task={task} />
          <DeleteTask task={task} />
        </ExpansionPanelActions>
      </ExpansionPanel>
    ))}
  </List>
);

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  details: {
    alignItems: "center"
  },
  link: {
    color: "#424242",
    textDecoration: "none",
    "&:hover": {
      color: "black"
    }
  }
};

export default withStyles(styles)(TaskList);
