import React from 'react';
import SocialMediaApi from '../../api/SocialMediaCrudApi';
import FileUploadApi from '../../api/FileUploadApi';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { SocialIcon } from 'react-social-icons';
import ConnectionApi from '../../api/ConnectionApi';
import FollowerObj from './FollowerObj';
import Sidebar from './Sidebar';

class ProfileUserContact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            readData: [],
            followers: [],
            following: [],
            Id: 2,
            profilePicture: "http://www.wellesleysocietyofartists.org/wp-content/uploads/2015/11/image-not-found.jpg"
        }
        this.success = this.success.bind(this);
        this.GetSuccess = this.GetSuccess.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.FollowUser = this.FollowUser.bind(this);
        this.followSuccess = this.followSuccess.bind(this);
    };

    componentDidMount() {
        if (this.props.user.PersonID !== undefined) {
            ConnectionApi.GetFollowing(this.props.user.PersonID[0], this.success, this.error)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user.PersonID !== this.props.user.PersonID) {
            ConnectionApi.GetFollowing(this.props.user.PersonID[0], this.success, this.error)
        }
    }

    FollowUser(flr, fle) {
        ConnectionApi.Follow({ Follower: flr, Followee: fle }, this.followSuccess, this.followError);
    }

    followSuccess() {
        console.log("Success")
    }

    followError(error) {
        console.log(error)
    }

    success(response) {
        this.setState({
            ...this.state,
            followers: response.data.items,
        }, () => { ConnectionApi.GetFollowing(this.state.Id, this.GetSuccess, this.error) });
    }

    GetSuccess(response) {
        this.setState({
            ...this.state,
            following: response.data.items,
        }, () => { console.log(this.state) });
    }

    error() {
        console.log("error");
    }

    onSubmit(evt) {
        evt.preventDefault();
        console.log(this.state)
    }

    render() {
        return (
            <div className="container">
                <section className="g-mb-100">
                    <div className="container">
                        <div className="row">
                            {/* Profile Slidebar */}
                            <Sidebar profilePicture={this.state.profilePicture} />
                            <div className="col-lg-9">
                                <div className="row g-mb-40">
                                    {this.state.followers.map((FollowerItem, i) => (
                                        <FollowerObj
                                            key={i}
                                            personId={FollowerItem.id}
                                            name={FollowerItem.firstName + ' ' + FollowerItem.middleInitial + ' ' + FollowerItem.lastName}
                                            profilePicture={FollowerItem.location}
                                            bio={FollowerItem.bio}
                                            follower={this.state.Id}
                                            followee={FollowerItem.id}
                                            roleId={FollowerItem.roleId}
                                            roleName={FollowerItem.roleName}
                                            userList={this.state.following}
                                            FollowUser={this.FollowUser}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={this.onSubmit} > </button>
                    </div>
                </section >
            </div >
        );
    }
};

const mapStateToProps = (state) => {
    return {
        user: state.UserReducer
    };
};

export default connect(mapStateToProps)(ProfileUserContact);