import React, { useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

import { UserContext, ME_QUERY } from "../../Root";

const LikeTask = ({ classes, taskId, likeCount }) => {
  const currentUser = useContext(UserContext);

  const handleDisableLikedTask = () => {
    const userLikes = currentUser.likeSet;
    const isTaskLiked =
      userLikes.findIndex(({ task }) => task.id === taskId) > -1;
    return isTaskLiked;
  };

  return (
    <Mutation
      mutation={CREATE_LIKE_MUTATION}
      variables={{ taskId }}
      onCompleted={data => {
        console.log({ data });
      }}
      refetchQueries={() => [{ query: ME_QUERY }]}
    >
      {createLike => (
        <IconButton
          onClick={event => {
            event.stopPropagation();
            createLike();
          }}
          className={classes.iconButton}
          disabled={handleDisableLikedTask()}
        >
          {likeCount}
          <ThumbUpIcon className={classes.icon} />
        </IconButton>
      )}
    </Mutation>
  );
};

const CREATE_LIKE_MUTATION = gql`
  mutation($taskId: Int!) {
    createLike(taskId: $taskId) {
      task {
        id
        likes {
          id
        }
      }
    }
  }
`;

const styles = theme => ({
  iconButton: {
    color: "deeppink"
  },
  icon: {
    marginLeft: theme.spacing.unit / 2
  }
});

export default withStyles(styles)(LikeTask);
