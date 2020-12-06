import React, { useState } from "react";
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import withStyles from "@material-ui/core/styles/withStyles";

import SearchTasks from '../components/Task/SearchTasks'
import TaskList from '../components/Task/TaskList'
import CreateTask from '../components/Task/CreateTask'
import Loading from '../components/Shared/Loading';
import Error from '../components/Shared/Error';

const App = ({ classes }) => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div className={classes.container}>
      <SearchTasks setSearchResults={setSearchResults} />
      <CreateTask />
      <Query query={GET_TASKS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <Loading />
          if (error) return <Error error={error} />
          const tasks = searchResults.length > 0 ? searchResults : data.tasks;

          return <TaskList tasks={tasks} />
        }}
      </Query>
    </div>
  );
};

export const GET_TASKS_QUERY = gql`
  query getTasksQuery {
    tasks {
      id
      title
      description
      comments{
        id
        description
        createdDate
        parent {
          id
        }
        commentBy {
          username
        }
      }
      likes {
        id
      }
      postedBy {
        id
        username
      }
    }
  }
`;

const styles = theme => ({
  container: {
    margin: "0 auto",
    maxWidth: 960,
    padding: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(App);
