import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import ProfileScreen from './components/ProfileScreen';
import CommentsDashboard from './components/CommentsDashboard';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          <main className="app-content">
            <Switch>
              <Route path="/profile" component={ProfileScreen} />
              <Route exact path="/" component={CommentsDashboard} />
              <Route component={() => <h2>404 Not Found</h2>} />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;