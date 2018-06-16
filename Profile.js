import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import FileUploadApi from '../../api/FileUploadApi';
import { connect } from 'react-redux';
import InlineEditable from "react-inline-editable-field";
import PersonApi from '../../api/PersonApi';
import ConnectionApi from '../../api/ConnectionApi'
import ContactUsApi from '../../api/ContactUsApi';
import SocialMediaApi from '../../api/SocialMediaCrudApi';
import { SocialIcon } from 'react-social-icons';

const divStyle = {
    width: "68%"
}
const diStyle = {
    width: "62%"
}

const icon1 = {
    marginLeft: "40px",
    fontSize: "32px"
}

const icon2 = {
    marginLeft: "60px",
    fontSize: "25px"
}

const table = {
    width: '100%',
    height: '400px'
}

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            items: [],
            id: "",
            profilePicture: "http://www.wellesleysocietyofartists.org/wp-content/uploads/2015/11/image-not-found.jpg",
            title: "",
            firstName: "",
            middleInitial: "",
            lastName: "",
            bio: "",
            text: "",
            ishidden: true,
            userId: "",
            modifiedBy: "",
            readData: []
        }
        this.onFireModal = this.onFireModal.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.fileUploadSuccess = this.fileUploadSuccess.bind(this);
        this.onChange = this.onChange.bind(this);
        this.fileUploadSuccess = this.fileUploadSuccess.bind(this);
        this.fileGetById_Success = this.fileGetById_Success.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onUpdateSuccess = this.onUpdateSuccess.bind(this);
        this.pop = this.pop.bind(this);
        this.onGetUser_Success = this.onGetUser_Success.bind(this);
        this.onGetAll_Success = this.onGetAll_Success.bind(this);
    }

    onSubmit(e) {
        this.setState({
            id: this.state.id,
            title: this.state.title,
            firstName: this.state.firstName,
            middleInitial: this.state.middleInitial,
            lastName: this.state.lastName,
            bio: this.state.bio,
            modifiedBy: this.state.modifiedBy,
            userId: this.state.userId
        });
        PersonApi.Update({ ...this.state }, this.onUpdateSuccess, this.OnUpdateError)
    }

    onGetAll_Success(resp) {
        debugger;
        console.log(resp.data.items);
        this.setState({
            ...this.state,
            readData: resp.data.items
        });
    };
    onUpdateSuccess(resp) {
        alert("update successfully");
        window.location.reload();
    }

    OnUpdateError(err) {
        console.log(err, "Could not Update")
    }

    handleClick(e) {
        e.preventDefault();
        this.setState({
            ishidden: false,
        })
    }

    updateListing(isChanged, val) {
        this.setState({ bio: val })
    }

    componentDidMount() {
        ContactUsApi.GetCurrentUser(this.onGetUser_Success, this.onGetUserError);
    }

    onGetUser_Success(resp) {
        FileUploadApi.ProfileImage(resp.data.id, this.fileGetById_Success, this.onSubmit_Error);
        SocialMediaApi.SelectById(resp.data.id, this.onGetAll_Success, this.onGetAll_Error)
    }

    socialMediaApi(id) {
        SocialMediaApi.SelectById(id, this.onGetAll_Success, this.onGetAll_Error)
    }

    onFireModal() {
    };

    onChange(e) {
        this.setState({ file: e.target.files[0] })
    }

    onFormSubmit(e) {
        e.preventDefault();
        this.fileUpload(this.state.file);
        document.getElementById("form").reset();
    }

    fileUpload(file) {
        const formData = new FormData();
        formData.append('UploadedFile', file, file.name);
        FileUploadApi.UploadImage(formData, this.fileUploadSuccess, this.onSubmit_Error);
    };

    fileUploadSuccess(resp) {
        console.log(resp);
        this.setState({ file: null })
        FileUploadApi.ProfileImage(resp.data.item, this.fileGetById_Success, this.onSubmit_Error);
        window.location.reload();
    }

    fileGetById_Success(resp) {
        console.log(resp)
        if (resp.data.item == null) {
            this.setState({
                profilePicture: "http://www.wellesleysocietyofartists.org/wp-content/uploads/2015/11/image-not-found.jpg"
            })
        } else {
            this.setState({
                ...this.state,
                profilePicture: resp.data.item.location,
                title: resp.data.item.title,
                firstName: resp.data.item.firstName,
                middleInitial: resp.data.item.middleInitial,
                lastName: resp.data.item.lastName,
                bio: resp.data.item.bio,
                id: resp.data.item.personId,
                modifiedBy: resp.data.item.modifiedBy,
                userId: resp.data.item.userId
            })
        }
    };

    onSubmitEditMode = (id) => {
        this.props.history.push('/profileaddsocialmedia/' + id);
    };

    onSubmitDeleteMode = (id) => {
        console.log(this.state.readData);
        SocialMediaApi.Delete(this.state.id, this.onDelete_Success, this.Delete_Error);
    };

    onDelete_Success(resp) {
        console.log("Delete User Successfully")
        alert("Update Successfully");
        window.location.reload();
    };

    onDelete_Error(err) {
        console.log(err)
    };

    pop() {
        console.log('yay')
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
                                                    <button className="btn u-btn-default" data-toggle="modal" data-target="#modal1" onClick={this.onFireModal}>
                                                        <i className="icon-camera u-line-icon-pro" ></i>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </figcaption>
                                    {/* User Info */}
                                </div>
                                {/* <!----------- FORM EDIT MODAL -------------> */}
                                {/* <!-- The Modal --> */}
                                <div className="modal fade col-md-3 offset-md-5 col-sm-6 offset-sm-3" data-backdrop='false' id="modal1">
                                    <div className="modal-dialog modal-dialog-centered modal-md">
                                        <div className="modal-content">

                                            {/* <!-- Modal Header --> */}
                                            <div className="modal-header bg-dark text-white">
                                                <h4 className="modal-title"><i>Upload Your Profile</i></h4>
                                                <button type="button" className="close text-white" data-dismiss="modal">&times;</button>
                                            </div>

                                            {/* <!-- Modal body --> */}
                                            <div className="modal-body">
                                                <form id="form" onSubmit={this.onFormSubmit}>
                                                    <input type="file" onChange={this.onChange} />
                                                    <button type="submit" >Upload</button>
                                                </form>
                                            </div>

                                            {/* <!-- Modal footer --> */}
                                            <div className="modal-footer">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="list-group list-group-border-0 g-mb-40">
                                    <Link to="/profile" className="list-group-item list-group-item-action justify-content-between">
                                        <span><i className="icon-cursor g-pos-rel g-top-1 g-mr-8"></i> Profile</span>
                                    </Link>
                                    <Link to="/profilesetting" className="list-group-item list-group-item-action justify-content-between">
                                        <span><i className="icon-cursor g-pos-rel g-top-1 g-mr-8"></i> Settings</span>
                                    </Link>
                                    <Link to="/profileaddsocialmedia" className="list-group-item list-group-item-action justify-content-between">
                                        <span><i className="material-icons">person_add</i>  Add Social Media </span>
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
                                                <a className="dropdown-item g-px-10" to='/'>
                                                    <i className="icon-layers g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> Projects
              </a>
                                                <a className="dropdown-item g-px-10" to='/'>
                                                    <i className="icon-wallet g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> Wallets
              </a>
                                                <a className="dropdown-item g-px-10" to='/'>
                                                    <i className="icon-fire g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> Reports
              </a>
                                                <a className="dropdown-item g-px-10" to='/'>
                                                    <i className="icon-settings g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> Users Setting
              </a>
                                                <div className="dropdown-divider"></div>
                                                <a className="dropdown-item g-px-10" to='/'>
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
                                        {/* End Progress  */}
                                    </div>
                                </div>
                            </div>
                            {/* //Profile Content */}
                            <div className="col-lg-9">
                                <div className="g-brd-around g-brd-gray-light-v4 g-pa-20 g-mb-40">
                                    <div className="row">
                                        <div className="col-lg-4 g-mb-40 g-mb-0--lg">
                                            {/* User Image */}
                                            <div className="g-mb-20">
                                                <img className="img-fluid w-100" src="https://static1.squarespace.com/static/5a01faedcf81e0da6feb08c8/t/5aaaa3740e2e72fbebfc23da/1526308837647/?format=1500w" alt="Image Description" />
                                            </div>
                                            {/* User Contact Button */}
                                            <a className="btn btn-block u-btn-outline-primary g-rounded-50 g-py-12 g-mb-10" onClick={this.follow}>
                                                <i className="icon-user-follow g-pos-rel g-top-1 g-mr-5"></i> Follow Me
                                            </a>
                                            <a className="btn btn-block u-btn-darkgray g-rounded-50 g-py-12 g-mb-10" to='/'>
                                                <i onClick={this.pop} className="icon-call-in g-pos-rel g-top-1 g-mr-5"
                                                    data-toggle='modal'
                                                    data-target='#contactMe'>Contact Me</i>
                                            </a>

                                        </div>
                                        <div className="col-lg-8">
                                            <div className="d-flex align-items-center justify-content-sm-between g-mb-5">
                                                <h2 className="g-font-weight-300 g-mr-10">{this.state.firstName} {this.state.lastName} </h2>
                                                <ul className="list-inline mb-0">
                                                    <li className="list-inline-item g-mx-2">
                                                        <a className="u-icon-v1 u-icon-size--sm u-icon-slide-up--hover g-color-gray-light-v1 g-bg-gray-light-v5 g-color-gray-light-v1--hover rounded-circle" to='/'>
                                                            <i className="g-font-size-default g-line-height-1 u-icon__elem-regular fa fa-facebook"></i>
                                                            <i className="g-font-size-default g-line-height-0_8 u-icon__elem-hover fa fa-facebook"></i>
                                                        </a>
                                                    </li>
                                                    <li className="list-inline-item g-mx-2">
                                                        <a className="u-icon-v1 u-icon-size--sm u-icon-slide-up--hover g-color-gray-light-v1 g-bg-gray-light-v5 g-color-gray-light-v1--hover rounded-circle" to='/'>
                                                            <i className="g-font-size-default g-line-height-1 u-icon__elem-regular fa fa-twitter"></i>
                                                            <i className="g-font-size-default g-line-height-0_8 u-icon__elem-hover fa fa-twitter"></i>
                                                        </a>
                                                    </li>
                                                    <li className="list-inline-item g-mx-2">
                                                        <a className="u-icon-v1 u-icon-size--sm u-icon-slide-up--hover g-color-gray-light-v1 g-bg-gray-light-v5 g-color-gray-light-v1--hover rounded-circle" to='/'>
                                                            <i className="g-font-size-default g-line-height-1 u-icon__elem-regular fa fa-dribbble"></i>
                                                            <i className="g-font-size-default g-line-height-0_8 u-icon__elem-hover fa fa-dribbble"></i>
                                                        </a>
                                                    </li>
                                                    <li className="list-inline-item g-mx-2">
                                                        <a className="u-icon-v1 u-icon-size--sm u-icon-slide-up--hover g-color-gray-light-v1 g-bg-gray-light-v5 g-color-gray-light-v1--hover rounded-circle" to='/'>
                                                            <i className="g-font-size-default g-line-height-1 u-icon__elem-regular fa fa-linkedin"></i>
                                                            <i className="g-font-size-default g-line-height-0_8 u-icon__elem-hover fa fa-linkedin"></i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* User Position */}
                                            <h4 className="h6 g-font-weight-300 g-mb-10">
                                                <i className="icon-badge g-pos-rel g-top-1 g-mr-5 g-color-gray-dark-v5"></i>
                                                Project Manager LTK
                                            </h4>
                                            {/* User Info */}
                                            <ul className="list-inline g-font-weight-300">
                                                <li className="list-inline-item g-mr-20">
                                                    <i className="icon-location-pin g-pos-rel g-top-1 g-color-gray-dark-v5 g-mr-5"></i> London, UK
                    </li>
                                                <li className="list-inline-item g-mr-20">
                                                    <i className="icon-check g-pos-rel g-top-1 g-color-gray-dark-v5 g-mr-5"></i> Admin
                    </li>
                                                <li className="list-inline-item g-mr-20">
                                                    <i className="icon-link g-pos-rel g-top-1 g-color-gray-dark-v5 g-mr-5"></i>  <a className="g-color-main g-color-primary--hover" to='/'>hs.c/hsu20</a>
                                                </li>
                                            </ul>
                                            {/* End User Info */}
                                            <hr className="g-brd-gray-light-v4 g-my-20" />
                                            <p className="lead g-line-height-1_8">
                                                <table onClick={this.handleClick}>
                                                    <thead>
                                                        <button hidden={this.state.ishidden} onClick={this.onSubmit} className="icon-note u-line-icon-pro"></button>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <InlineEditable
                                                                    content={this.state.bio}
                                                                    inputType="textarea"
                                                                    displayPlaceholder="Enter text here.."
                                                                    onBlur={(val, isChanged) => { this.updateListing(isChanged, val) }}
                                                                    style={{ width: '200px' }}
                                                                    inputStyle={{ width: '500px' }}
                                                                    className="customClassName"
                                                                    onClick={this.handleClick}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </p>
                                            <hr className="g-brd-gray-light-v4 g-my-20" />
                                            {/* UserSkill */}
                                            <div className="d-flex flex-wrap text-center">
                                                {/* Coutner Piechart  */}
                                                <div className="g-mr-40 g-mb-20 g-mb-0--xl">
                                                    <div className="js-pie g-color-purple g-mb-5" data-circles-value="54" data-circles-max-value="100" data-circles-bg-color="#d3b6c6" data-circles-fg-color="#9b6bcc" data-circles-radius="30" data-circles-stroke-width="3" data-circles-additional-text="%" data-circles-duration="2000"
                                                        data-circles-scroll-animate="true" data-circles-font-size="14">
                                                    </div>
                                                    <h4 className="h6 g-font-weight-300">Consulting</h4>
                                                </div>

                                                <div className="g-mr-40 g-mb-20 g-mb-0--xl">
                                                    <div className="js-pie g-color-lightred g-mb-5" data-circles-value="81" data-circles-max-value="100" data-circles-bg-color="#ffc2bb" data-circles-fg-color="#e74c3c" data-circles-radius="30" data-circles-stroke-width="3" data-circles-additional-text="%" data-circles-duration="2000"
                                                        data-circles-scroll-animate="true" data-circles-font-size="14">
                                                    </div>
                                                    <h4 className="h6 g-font-weight-300">Copywriting</h4>
                                                </div>

                                                <div className="g-mr-40 g-mb-20 g-mb-0--xl">
                                                    <div className="js-pie g-color-primary g-mb-5" data-circles-value="83" data-circles-max-value="100" data-circles-bg-color="#c9ff97" data-circles-fg-color="#72c02c" data-circles-radius="30" data-circles-stroke-width="3" data-circles-additional-text="%" data-circles-duration="2000"
                                                        data-circles-scroll-animate="true" data-circles-font-size="14">
                                                    </div>
                                                    <h4 className="h6 g-font-weight-300">Marketing</h4>
                                                </div>

                                                <div className="g-mb-20 g-mb-0--lg">
                                                    <div className="js-pie g-mb-5" data-circles-value="92" data-circles-max-value="100" data-circles-bg-color="#eeeeee" data-circles-fg-color="#111111" data-circles-radius="30" data-circles-stroke-width="3" data-circles-additional-text="%" data-circles-duration="2000"
                                                        data-circles-scroll-animate="true" data-circles-font-size="14">
                                                    </div>
                                                    <h4 className="h6 g-font-weight-300">Management</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-9">
                                        <div className="card border-0 rounded-0">
                                            {/* Panel Header     */}
                                            <div className="card-header d-flex align-items-center justify-content-between g-bg-gray-light-v5 border-0 g-mb-15">
                                                <div className="dropdown g-mb-10 g-mb-0--md">
                                                    <span className="d-block g-color-primary--hover g-cursor-pointer g-mr-minus-5 g-pa-5" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i className="icon-options-vertical g-pos-rel g-top-1"></i>
                                                    </span>
                                                    <div className="dropdown-menu dropdown-menu-right rounded-0 g-mt-10">
                                                        <a className="dropdown-item g-px-10" to='/'>
                                                            <i className="icon-layers g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> Projects
                        </a>
                                                        <a className="dropdown-item g-px-10" to='/'>
                                                            <i className="icon-wallet g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> Wallets
                        </a>
                                                        <a className="dropdown-item g-px-10" to='/'>
                                                            <i className="icon-fire g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> Reports
                        </a>
                                                        <a className="dropdown-item g-px-10" to='/'>
                                                            <i className="icon-settings g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> Users Setting
                        </a>
                                                        <div className="dropdown-divider"></div>

                                                        <a className="dropdown-item g-px-10" to='/'>
                                                            <i className="icon-plus g-font-size-12 g-color-gray-dark-v5 g-mr-5"></i> View More
                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                            <table id='phoneTypeInfo' className='table-responsive-sm text-center table table-hover table-striped table-bordered'>
                                                <thead>
                                                    <tr className='bg-dark text-white col-md-9'>
                                                        <th>Social Media Link </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.state.readData.map((item, index) =>
                                                        <tr key={index}>
                                                            <td className='socialmedia col-md-6'><SocialIcon className="pull-left" url={item.url} />{item.url}</td>
                                                            <div className='col-md-6'>
                                                                <span><i className="fa fa-trash" id='deleteBtn'
                                                                    onClick={() => this.setState({ id: item.id })}
                                                                    data-toggle='modal'
                                                                    data-target='#myModalDelConfirm'></i></span>
                                                                <span><i className="icon-note u-line-icon-pro" onClick={() => this.onSubmitEditMode(item.id)} value={item.id}></i></span>
                                                            </div>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="modal fade col-md-3 offset-md-5 col-sm-6 offset-sm-3" id="myModalDelConfirm" data-backdrop="false">
                    <div className="modal-dialog modal-dialog-centered modal-md">
                        <div className="modal-content">

                            {/* <!-- Modal Header --> */}
                            <div className="modal-header bg-dark text-white">
                                <h4 className="modal-title"><i>Delete Confirmation</i></h4>
                                <button type="button" className="close text-white" data-dismiss="modal">&times;</button>
                            </div>

                            {/* <!-- Modal body --> */}
                            <div className="modal-body">
                                Are you sure you want to delete?
                            </div>

                            {/* <!-- Modal footer --> */}
                            <div className="modal-footer">
                                <button type='button' id='editBtn' className='btn btn-sm u-btn-outline-darkgray u-btn-hover-v1-1 col-md-2 g-rounded-30' data-dismiss="modal" onClick={() => this.onSubmitDeleteMode()}>Yes</button>
                                <button type='button' id='editBtn' className='btn btn-sm u-btn-outline-darkgray u-btn-hover-v1-1 col-md-2 g-rounded-30' data-dismiss="modal" >No</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade col-md-3 offset-md-5 col-sm-6 offset-sm-3" id="contactMe" data-backdrop="false">
                    <div className="modal-dialog modal-dialog-centered modal-md">
                        <div className="modal-content">

                            {/* <!-- Modal Header --> */}
                            <div className="modal-header bg-dark text-white">
                                <h4 className="modal-title"><i>Contacts</i></h4>
                                <button type="button" className="close text-white" data-dismiss="modal">&times;</button>
                            </div>

                            {/* <!-- Modal body --> */}
                            <div className="modal-body">
                                <ul>
                                    <li>HtmlStream</li>
                                    <li>john.doe@htmlstream.com</li>
                                    <li> http://facebook.com</li>
                                    <li>(+123) 456 7891 </li>
                                    <li>795 Folsom Ave, Suite 600, San Francisco CA, US</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        User: state.UserReducer
    }
};

export default connect(mapStateToProps)(Profile);



