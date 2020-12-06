import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import {Link} from "react-router-dom";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";

const CommentTask = ({classes, taskComments}) => (

    <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography>
                Comentarios
            </Typography>
        </ExpansionPanelSummary>
        {taskComments.map(comment => (
            <ExpansionPanelDetails className={classes.details}>
                <List>
                    <ListItem className={classes.root} key={comment.id}>
                        <ListItemText
                            primaryTypographyProps={{
                                variant: "subheading",
                            }}
                            primary={comment.description}
                            secondary={
                                <Link
                                    className={classes.link}
                                    to={`/profile/${comment.commentBy.id}`}
                                >
                                    {comment.commentBy.username}
                                </Link>
                            }
                        />
                    </ListItem>
                </List>
            </ExpansionPanelDetails>
        ))}
    </ExpansionPanel>
);

const styles = theme => ({
    root: {
        display: "flex",
        flexWrap: "wrap"
    },
    iconButton: {
        color: "deeppink"
    },
    details: {
        display: "flex",
        alignItems: "center"
    },
    icon: {
        marginLeft: theme.spacing.unit / 2
    },
    link: {
        color: "#424242",
        textDecoration: "none",
        "&:hover": {
            color: "black"
        }
    }
});

export default withStyles(styles)(CommentTask);