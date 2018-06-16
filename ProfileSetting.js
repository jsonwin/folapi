import React from 'react';
import { Link } from 'react-router-dom';
import UserApi from '../../api/UserApi';
import FileUploadApi from '../../api/FileUploadApi';
import { connect } from 'react-redux';
import ContactUsApi from '../../api/ContactUsApi';
import InlineEditable from "react-inline-editable-field";

const divStyle = {
    width: "68%"
}
const diStyle = {
    width: "62%"
}



class ProfileSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: "",
            Password: "",
            newPassword: "",
            cPassword: "",
            formErrors: { newPassword: "", cPassword: "" },
            newPasswordError: false,
            cPasswordError: false,
            buttonClicked: false,
            ishidden1: false,
            ishidden2: true,
            buttonText: "Confirm Password",
            Id: "",
            profilePicture: "http://www.wellesleysocietyofartists.org/wp-content/uploads/2015/11/image-not-found.jpg",
            Name: "",
            PhoneNumber: "",
            Address: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onUpdate_Success = this.onUpdate_Success.bind(this);
        this.onValidateSuccess = this.onValidateSuccess.bind(this);
        this.fileGetById_Success = this.fileGetById_Success.bind(this);
        this.onGetUserSuccess = this.onGetUserSuccess.bind(this);
        this.onDisplay_Success = this.onDisplay_Success.bind(this);
    };

    componentDidMount() {
        ContactUsApi.GetCurrentUser(this.onGetUserSuccess, this.onGetUserError)
    }

    onGetUserSuccess(resp) {
        FileUploadApi.ProfileImage(resp.data.id, this.fileGetById_Success, this.onSubmit_Error);
        FileUploadApi.DisplayInfo(resp.data.id, this.onDisplay_Success, this.onDisplay_Error);
    }

    onDisplay_Success(resp) {
        console.log("got it!")
        this.setState({
            Name: resp.data.item.name,
            PhoneNumber: resp.data.item.phoneNumber,
            Address: resp.data.item.address
        })
    }

    fileGetById_Success(resp) {
        console.log(resp);
        if (resp.data.item == null) {
            this.setState({
                profilePicture: "http://www.wellesleysocietyofartists.org/wp-content/uploads/2015/11/image-not-found.jpg"
            })
        } else {
            this.setState({
                ...this.state,
                profilePicture: resp.data.item.location
            })
        }
    };

    onSubmit(evt) {
        evt.preventDefault();
        if (this.state.newPassword === "" && this.state.cPassword === "") {
            UserApi.validate({ ...this.state }, this.onValidateSuccess, this.onValidateError);
        } else {
            this.validate(this.state.newPassword, this.state.cPassword);
        }
    };

    onValidateSuccess(resp) {
        if (resp.data.isSuccessful === true) {
            console.log("ValidateSuccess")
            this.setState({
                buttonClicked: false,
                ishidden1: true,
                ishidden2: false,
                buttonText: "Save Changes"
            })
        } else {
            this.onValidateError(resp.errors)
        }
    };

    onValidateError(err) {
        console.log(err, "Update Failed");
        alert("Incorrect Email or Password");
    };

    validate(newPassword, cPassword) {
        debugger;
        this.setState({
            ...this.state,
            newPasswordError: !/(?=.{8,})(?=.*[0-9])/.test(newPassword),
            cPasswordError: !(newPassword === cPassword),
            buttonClicked: true
        }, () => { this.callApi(); });
    }

    callApi() {
        if (this.state.newPasswordError === false && this.state.cPasswordError === false) {
            console.log(this.state)
            let model = {
                password: this.state.newPassword
            }
            UserApi.UpdatePassword(model, this.onUpdate_Success, this.onUpdate_Error);
        } else {
            this.setState({
                buttonClicked: false
            })
            alert("confirm password does not match")
        }
    }

    onUpdate_Success(resp) {
        console.log(resp, "Update Password Success");
        alert("Update Password Successfully");
        window.location.reload();
    };

    onUpdate_Error(err) {
        console.log(err, "Update Failed");
    };

    handleChange(evt) {
        const key = evt.target.name;
        const val = evt.target.value;
        this.setState({
            ...this.state,
            [key]: val
        });
    }

    updateName(isChanged, val) {
        this.setState({
            Name: val,
        })
    }

    updatePhoneNumber(isChanged, val) {
        this.setState({
            PhoneNumber: val,
        })
    }

    updateAddress(isChanged, val) {
        this.setState({

            Address: val,
        })
    }



    render() {
        return (
            <div className="container">
                <section className="g-mb-100">
                    <div className="container">
                        <div className="row">
                            {/* Profile Slidebar */}
                            <div className="col-lg-3 g-mb-50 g-mb-0--lg">
                                {/* <!-- User Image -->   */}
                                <div className="u-block-hover g-pos-rel">
                                    <figure>
                                        <img className="img-fluid w-100 u-block-hover__main--zoom-v1" src={this.state.profilePicture} alt="Image Description" />
                                    </figure>
                                    {/* Figure Caption */}
                                    <figcaption className="u-block-hover__additional--fade g-bg-black-opacity-0_5 g-pa-30">
                                        <div className="u-block-hover__additional--fade u-block-hover__additional--fade-up g-flex-middle">
                                            <ul className="list-inline text-center g-flex-middle-item--bottom g-mb-20">
                                                <li className="list-inline-item align-middle g-mx-7">
                                                    <a className="u-icon-v1 u-icon-size--md g-color-white" href="#!">
                                                        <i className="icon-note u-line-icon-pro"></i>
                                                    </a>
                                                </li>
                                                <li className="list-inline-item align-middle g-mx-7">
                                                    <a className="u-icon-v1 u-icon-size--md g-color-white" href="#!">
                                                        <i className="icon-notebook u-line-icon-pro"></i>
                                                    </a>
                                                </li>
                                                <li className="list-inline-item align-middle g-mx-7">
                                                    <a className="u-icon-v1 u-icon-size--md g-color-white" href="#!">
                                                        <i className="icon-settings u-line-icon-pro"></i>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </figcaption>
                                    {/* User Info */}
                                </div>
                                <div className="list-group list-group-border-0 g-mb-40">
                                    <Link to="/profile" className="list-group-item list-group-item-action justify-content-between">
                                        <span><i className="icon-cursor g-pos-rel g-top-1 g-mr-8"></i> Profile</span>
                                    </Link>
                                    <Link to="/profilesetting" className="list-group-item list-group-item-action justify-content-between">
                                        <span><i className="icon-cursor g-pos-rel g-top-1 g-mr-8"></i> Settings</span>
                                    </Link>
                                </div>
                                <div className="card border-0 rounded-0 g-mb-50">
                                    <div className="card-header d-flex align-items-center justify-content-between g-bg-gray-light-v5 border-0 g-mb-15">
                                        <h3 className="h6 mb-0">
                                            <i className="icon-layers g-pos-rel g-top-1 g-mr-5"></i> Project Progress
            </h3>
                                        <div className="dropdown g-mb-10 g-mb-0--md">
                                            <span className="d-block g-color-primary--hover g-cursor-pointer g-mr-minus-5 g-pa-5" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="icon-options-vertical g-pos-rel g-top-1"></i>
                                            </span>
                                            <div className="dropdown-menu dropdown-menu-right rounded-0 g-mt-10">
                                                <a className="dropdown-item g-px-10" href="#!">
                                                    <i className="icon-layers g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> Projects
              </a>
                                                <a className="dropdown-item g-px-10" href="#!">
                                                    <i className="icon-wallet g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> Wallets
              </a>
                                                <a className="dropdown-item g-px-10" href="#!">
                                                    <i className="icon-fire g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> Reports
              </a>
                                                <a className="dropdown-item g-px-10" href="#!">
                                                    <i className="icon-settings g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> Users Setting
              </a>
                                                <div className="dropdown-divider"></div>
                                                <a className="dropdown-item g-px-10" href="#!">
                                                    <i className="icon-plus g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> View More
              </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="js-scrollbar card-block u-info-v1-1 g-bg-white-gradient-v1--after g-height-300 g-pa-0">
                                        <div className="g-mb-20">
                                            <h6 className="g-mb-10">Web Design <span className="float-right g-ml-10">68%</span></h6>
                                            <div className="js-hr-progress-bar progress g-bg-black-opacity-0_1 rounded-0 g-mb-5">

                                                <div className="js-hr-progress-bar-indicator progress-bar g-bg-cyan u-progress-bar--xs" role="progressbar" style={divStyle} aria-valuenow="68" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <small className="g-font-size-12">11% more than last week</small>
                                        </div>
                                        <div className="g-mb-20">
                                            <h6 className="g-mb-10">Dribbble Shots <span className="float-right g-ml-10">62%</span></h6>
                                            <div className="js-hr-progress-bar progress g-bg-black-opacity-0_1 rounded-0 g-mb-5">
                                                <div className="js-hr-progress-bar-indicator progress-bar g-bg-pink u-progress-bar--xs" role="progressbar" style={diStyle} aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <small className="g-font-size-12">20% less than last week</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* //   Profle Content */}
                            <div className="col-lg-9">
                                {/* Nav tabs  */}
                                <ul className="nav nav-justified u-nav-v1-1 u-nav-primary g-brd-bottom--md g-brd-bottom-2 g-brd-primary g-mb-20" role="tablist" data-target="nav-1-1-default-hor-left-underline" data-tabs-mobile-type="slide-up-down" data-btn-classes="btn btn-md btn-block rounded-0 u-btn-outline-primary g-mb-20">
                                    <li className="nav-item">
                                        <a className="nav-link g-py-10 active" data-toggle="tab" href="#nav-1-1-default-hor-left-underline--1" role="tab">Edit Profile</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link g-py-10" data-toggle="tab" href="#nav-1-1-default-hor-left-underline--2" role="tab">Security Settings</a>
                                    </li>
                                </ul>
                                {/* End Nav Bar */}
                                <div id="nav-1-1-default-hor-left-underline" className="tab-content">
                                    {/* Edit Profile */}
                                    <div className="tab-pane fade show active" id="nav-1-1-default-hor-left-underline--1" role="tabpanel" data-parent="#nav-1-1-default-hor-left-underline">
                                        <h2 className="h4 g-font-weight-300">Manage your Name, ID and Email Addresses</h2>
                                        <p>Below are name, email addresse, contacts and more on file for your account.</p>
                                        <ul className="list-unstyled g-mb-30">
                                            <li className="d-flex align-items-center justify-content-between g-brd-bottom g-brd-gray-light-v4 g-py-15">
                                                <div className="g-pr-10">

                                                    <strong className="d-block d-md-inline-block g-color-gray-dark-v2 g-width-200 g-pr-10" >Name</strong>
                                                    <span className='pull-right' > <InlineEditable content={this.state.Name}
                                                        type='textarea'
                                                        onBlur={(val, isChanged) => { this.updateName(isChanged, val) }}
                                                        inputStyle={{ width: '500px' }}
                                                        className="customClassName"
                                                    />
                                                    </span>
                                                </div>
                                                <span>
                                                    <i className="icon-pencil g-color-gray-dark-v5 g-color-primary--hover g-cursor-pointer g-pos-rel g-top-1"></i>
                                                </span>
                                            </li>
                                            <li className="d-flex align-items-center justify-content-between g-brd-bottom g-brd-gray-light-v4 g-py-15">
                                                <div className="g-pr-10">
                                                    <strong className="d-block d-md-inline-block g-color-gray-dark-v2 g-width-200 g-pr-10">Linked account</strong>
                                                    <span className="align-top">Facebook</span>
                                                </div>
                                                <span>
                                                    <i className="icon-pencil g-color-gray-dark-v5 g-color-primary--hover g-cursor-pointer g-pos-rel g-top-1"></i>
                                                </span>
                                            </li>
                                            <li className="d-flex align-items-center justify-content-between g-brd-bottom g-brd-gray-light-v4 g-py-15">
                                                <div className="g-pr-10">
                                                    <strong className="d-block d-md-inline-block g-color-gray-dark-v2 g-width-200 g-pr-10">Phone number</strong>
                                                    <span className='pull-right' > <InlineEditable content={this.state.PhoneNumber}
                                                        type='textarea'
                                                        onBlur={(val, isChanged) => { this.updatePhoneNumber(isChanged, val) }}
                                                        inputStyle={{ width: '500px' }}
                                                        className="customClassName"
                                                    />
                                                    </span>
                                                </div>
                                                <span>
                                                    <i className="icon-pencil g-color-gray-dark-v5 g-color-primary--hover g-cursor-pointer g-pos-rel g-top-1"></i>
                                                </span>
                                            </li>
                                            <li className="d-flex align-items-center justify-content-between g-brd-bottom g-brd-gray-light-v4 g-py-15">
                                                <div className="g-pr-10">
                                                    <strong className="d-block d-md-inline-block g-color-gray-dark-v2 g-width-200 g-pr-10">Address</strong>
                                                    <span className='pull-right' > <InlineEditable content={this.state.Address}
                                                        type='textarea'
                                                        onBlur={(val, isChanged) => { this.updateAddress(isChanged, val) }}
                                                        inputStyle={{ width: '500px' }}
                                                        className="customClassName"
                                                    /></span>
                                                </div>
                                                <span>
                                                    <i className="icon-pencil g-color-gray-dark-v5 g-color-primary--hover g-cursor-pointer g-pos-rel g-top-1"></i>
                                                </span>
                                            </li>
                                        </ul>
                                        <div className="text-sm-right">
                                            <a className="btn u-btn-darkgray rounded-0 g-py-12 g-px-25 g-mr-10" href="#!">Cancel</a>
                                            <a className="btn u-btn-primary rounded-0 g-py-12 g-px-25" href="#!">Save Changes</a>
                                        </div>
                                    </div>
                                    {/* Security Settings */}
                                    <div className="tab-pane fade" id="nav-1-1-default-hor-left-underline--2" role="tabpanel" data-parent="#nav-1-1-default-hor-left-underline">
                                        <h2 className="h4 g-font-weight-300">Security Settings</h2>
                                        <p className="g-mb-25">Reset your password, change verifications and so on.</p>
                                        <form>
                                            <div hidden={this.state.ishidden1} className="form-group row g-mb-25">
                                                <label className="col-sm-3 col-form-label g-color-gray-dark-v2 g-font-weight-700 text-sm-right g-mb-10">Verify Email</label>
                                                <div className="col-sm-9">
                                                    <div className="input-group g-brd-primary--focus">
                                                        <input className="form-control form-control-md border-right-0 rounded-0 g-py-13 pr-0" name="Email" value={this.state.Email} onChange={this.handleChange}
                                                            type="email" placeholder="Insert your Email here" />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text g-bg-white g-color-gray-light-v1 rounded-0"><i className="icon-lock"></i></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div hidden={this.state.ishidden1} className="form-group row g-mb-25">
                                                <label className="col-sm-3 col-form-label g-color-gray-dark-v2 g-font-weight-700 text-sm-right g-mb-10"> Password</label>
                                                <div className="col-sm-9">
                                                    <div className="input-group g-brd-primary--focus">
                                                        <input className="form-control form-control-md border-right-0 rounded-0 g-py-13 pr-0" name="Password" value={this.state.Password}

                                                            onChange={this.handleChange} type="password" placeholder="Verify your password" />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text g-bg-white g-color-gray-light-v1 rounded-0"><i className="icon-lock"></i></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div hidden={this.state.ishidden2} className="form-group row g-mb-25">
                                                <label className="col-sm-3 col-form-label g-color-gray-dark-v2 g-font-weight-700 text-sm-right g-mb-10">New Password</label>
                                                <div className="col-sm-9">
                                                    <div className="input-group g-brd-primary--focus">
                                                        <input className="form-control form-control-md border-right-0 rounded-0 g-py-13 pr-0" name="newPassword"
                                                            value={this.state.newPassword} onChange={this.handleChange} type="password"

                                                            placeholder="Insert your new password" />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text g-bg-white g-color-gray-light-v1 rounded-0"><i className="icon-lock"></i></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div hidden={this.state.ishidden2} className="form-group row g-mb-25">
                                                <label className="col-sm-3 col-form-label g-color-gray-dark-v2 g-font-weight-700 text-sm-right g-mb-10">Confirm Your Password</label>
                                                <div className="col-sm-9">
                                                    <div className="input-group g-brd-primary--focus">
                                                        <input className="form-control form-control-md border-right-0 rounded-0 g-py-13 pr-0" name="cPassword"
                                                            value={this.state.cPassword}

                                                            onChange={this.handleChange} type="password" placeholder="Please confirm your password" />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text g-bg-white g-color-gray-light-v1 rounded-0"><i className="icon-lock"></i></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row g-mb-25">
                                                <label className="col-sm-3 col-form-label g-color-gray-dark-v2 g-font-weight-700 text-sm-right g-mb-10">Save password</label>
                                                <div className="col-sm-9">
                                                    <label className="form-check-inline u-check mx-0">
                                                        <input className="g-hidden-xs-up g-pos-abs g-top-0 g-right-0" name="savePassword" type="checkbox" />
                                                        <div className="u-check-icon-radio-v7">
                                                            <i className="d-inline-block"></i>
                                                        </div>
                                                    </label>
                                                    <small className="d-block text-muted">When you check this box, you will be saved automatically login to your profile account. Also, you will be always logged in all our services.</small>
                                                </div>
                                            </div>
                                            <hr className="g-brd-gray-light-v4 g-my-25" />
                                            <div className="text-sm-right">
                                                <a className="btn u-btn-darkgray rounded-0 g-py-12 g-px-25 g-mr-10" href="#!">Cancel</a>

                                                <button type="submit" className="btn u-btn-primary rounded-0 g-py-12 g-px-25" onClick={this.onSubmit} >{this.state.buttonText}</button>

                                            </div>
                                        </form>

                                    </div>
                                    <div className="tab-pane fade" id="nav-1-1-default-hor-left-underline--4" role="tabpanel" data-parent="#nav-1-1-default-hor-left-underline">
                                        <h2 className="h4 g-font-weight-300">Manage your Notifications</h2>
                                        <p className="g-mb-25">Below are the notifications you may manage.</p>
                                        <form>
                                            <div className="form-group">
                                                <label className="d-flex align-items-center justify-content-between">
                                                    <span>Email notification</span>
                                                    <div className="u-check">
                                                        <input className="g-hidden-xs-up g-pos-abs g-top-0 g-right-0" name="emailNotification" type="checkbox" />
                                                        <div className="u-check-icon-radio-v7">
                                                            <i className="d-inline-block"></i>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                            <hr className="g-brd-gray-light-v4 g-my-20" />
                                            <div className="form-group">
                                                <label className="d-flex align-items-center justify-content-between">
                                                    <span>Send me email notification when a user comments on my blog</span>
                                                    <div className="u-check">
                                                        <input className="g-hidden-xs-up g-pos-abs g-top-0 g-right-0" name="commentNotification" type="checkbox" />
                                                        <div className="u-check-icon-radio-v7">
                                                            <i className="d-inline-block"></i>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                            <hr className="g-brd-gray-light-v4 g-my-20" />
                                            <div className="form-group">
                                                <label className="d-flex align-items-center justify-content-between">
                                                    <span>Send me email notification for the latest update</span>
                                                    <div className="u-check">
                                                        <input className="g-hidden-xs-up g-pos-abs g-top-0 g-right-0" name="updateNotification" type="checkbox" />
                                                        <div className="u-check-icon-radio-v7">
                                                            <i className="d-inline-block"></i>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                            <hr className="g-brd-gray-light-v4 g-my-25" />
                                            <div className="form-group">
                                                <label className="d-flex align-items-center justify-content-between">
                                                    <span>Receive our monthly newsletter</span>
                                                    <div className="u-check">
                                                        <input className="g-hidden-xs-up g-pos-abs g-top-0 g-right-0" name="newsletterNotification" type="checkbox" />
                                                        <div className="u-check-icon-radio-v7">
                                                            <i className="d-inline-block"></i>
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                            <hr className="g-brd-gray-light-v4 g-my-25" />
                                            <div className="text-sm-right">
                                                <a className="btn u-btn-darkgray rounded-0 g-py-12 g-px-25 g-mr-10" href="#!">Cancel</a>
                                                <a className="btn u-btn-primary rounded-0 g-py-12 g-px-25" href="#!">Save Changes</a>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div>
                </div>
            </div>
        );
    }
};
const mapStateToProps = (state) => {
    return {
        Id: state.UserReducer
    };
};

export default connect(mapStateToProps)(ProfileSetting);

