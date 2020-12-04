import React, { useContext } from "react";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import IconButton from "@material-ui/core/IconButton";
import TrashIcon from "@material-ui/icons/DeleteForeverOutlined";

import { UserContext } from '../../Root'
import { GET_TASKS_QUERY } from "../../pages/App";

const DeleteTask = ({ task }) => {
  const currentUser = useContext(UserContext);
  const isCurrentUser = currentUser.id === task.postedBy.id;

  return (
    isCurrentUser && (
      <Mutation
        mutation={DELETE_TASK_MUTATION}
        variables={{ taskId: task.id }}
        onCompleted={data => {
          console.log({ data });
        }}
        refetchQueries={() => [{ query: GET_TASKS_QUERY }]}
      >
        {deleteTask => (
          <IconButton onClick={deleteTask}>
            <TrashIcon />
          </IconButton>
        )}
      </Mutation>
    )
  );
};

const DELETE_TASK_MUTATION = gql`
  mutation($taskId: Int!) {
    deleteTask(taskId: $taskId) {
      taskId
    }
  }
`;

export default DeleteTask;
