import { Component } from 'react';
import { LuArrowLeft } from "react-icons/lu";
import { withRouter } from 'react-router-dom';
import './index.css';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchUserData();
  }

  fetchUserData = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users = await response.json();
      if (users && users.length > 0) {
        this.setState({
          user: users[0], // Used the first record from the users' dummy API as mentioned in Assignment Reference (Leanne Graham)
          loading: false,
        });
      } else {
        this.setState({
          error: 'No user data found.',
          loading: false,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      this.setState({
        error: `Failed to load user data: ${error.message}`,
        loading: false,
      });
    }
  };

  handleGoBack = () => {
    this.props.history.push('/'); 
  };

  render() {
    const { user, loading, error } = this.state;

    if (loading) {
      return (
        <div className="profile-screen">
          <p>Loading profile...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="profile-screen error">
          <p>{error}</p>
          <button onClick={this.handleGoBack} className="back-button">Go Back to Dashboard</button>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="profile-screen no-data">
          <p>No user data available.</p>
          <button onClick={this.handleGoBack} className="back-button">Go Back to Dashboard</button>
        </div>
      );
    }

    return (
     <div>
       <div className="profile-header">
          <button onClick={this.handleGoBack} className="back-button">
            <LuArrowLeft />  Welcome, {user.name}
          </button>
        </div>
       <div className="profile-screen">
        <div className="profile-details-container">
          <div className='profile-pic-container'>
            <div className="profile-avatar-large">{user.name.split(' ').map(n => n[0]).join('')}</div>
            <div>
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-email">{user.email}</p>
            </div>
          </div>
          <div className="profile-fields">
            <div>
              <label>User ID</label>
              <div className="profile-field">
                <p>{user.id}</p>
              </div>
            </div>
            <div>
              <label>Name</label>
              <div className="profile-field">
                <p>{user.name}</p>
              </div>
            </div>
            <div>
              <label>Email ID</label>
              <div className="profile-field">
                <p>{user.email}</p>
              </div>
            </div>
            <div>
              <label>Address</label>
              <div className="profile-field">
                <p>{`${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`}</p>
              </div>
            </div>
            <div>
              <label>Phone</label>
              <div className="profile-field">
                <p>{user.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
     </div>
    );
  }
}

export default withRouter(ProfileScreen);