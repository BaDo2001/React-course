import React, {Component, Fragment} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import axios from 'axios';

import './App.css';

import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert';
import Users from './components/users/Users';
import User from './components/users/User';
import Search from './components/users/Search';
import About from './components/pages/About';

class App extends Component {
  state = {
    users: [],
    currentUser: {},
    repos: [],
    loading: false,
    alert: null
  }

  searchUsers = async text => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    this.setState({ users: res.data.items, loading: false });
  };

  getUser = async (userName) => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/users/${userName}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    this.setState({ currentUser: res.data, loading: false });
  };

  getUserRepos = async (userName) => {
    this.setState({ loading: true });
    const res = await axios.get(
      `https://api.github.com/users/${userName}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    this.setState({ repos: res.data, loading: false });
  };

  clearUsers = () => {
    this.setState({ users: [], loading: false })
  };

  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });
    setTimeout(() => this.setState({ alert: null }), 2000);
  };

  render() {
    const { users, loading, currentUser, repos } = this.state;
    return (
      <Router>
        <div className="App">
          <Navbar></Navbar>
          <div className="container">
            <Alert alert={ this.state.alert } />
            <Switch>
              <Route exact path='/' render={ props=> (
                <Fragment>
                  <Search
                    searchUsers={this.searchUsers}
                    clearUsers={this.clearUsers}
                    showClear={users.length > 0}
                    setAlert={this.setAlert}
                  />
                  <Users loading={loading} users={users} />
                </Fragment>
              ) } />
              <Route exact path='/about' component = { About } />
              <Route exact path='/user/:login' render={props => (
                <User
                  {...props}
                  getUser={ this.getUser }
                  user={ currentUser }
                  getUserRepos={ this.getUserRepos }
                  repos={ repos }
                  loading={ loading }
                />
              )} />
            </Switch>
            
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
