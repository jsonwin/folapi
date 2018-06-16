import React from 'react';
import FileUploadApi from '../../api/FileUploadApi';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormErrors } from '../../common/FormErrors';
import SocialMediaApi from '../../api/SocialMediaCrudApi';
import IsValidUrl from '../../common/IsValidUrl';
import { SocialIcon } from 'react-social-icons';
import ScraperApi from '../../api/ScraperApi';
import ContactUsApi from '../../api/ContactUsApi';

const divStyle = {
    width: "68%"
}
const diStyle = {
    width: "62%"
}

const divCardStyle = {
    marginRight: "20px",
    minWidth: "1px"
}

const aStyle = {
    float: "left"
}

const imgStyle = {
    float: "right",
    width: "10%",
    borderRadius: "4px",
}

const loaderStyle = {
    position: "fixed",
    Zindex: "999",
    overflow: "show",
    top: "0",
    left: "0",
    bottom: "0",
    right: "0",
    margin: "auto",
    border: "16px solid #f3f3f3",
    borderTop: "16px solid #800000",
    borderRadius: "50%",
    width: "120px",
    height: "120px",
    animation: "spin .7s linear infinite"
}

const overlayStyle = {
    background: "black",
    opacity: ".5",
    position: "fixed",
    zIndex: "10",
    top: "0px",
    left: "0",
    width: "100%",
    height: "100%"
}

class ProfileAddSocialMedia extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            url: "",
            modifiedBy: "",
            SocialMediaTypeId: "",
            title: "",
            description: "",
            formErrors: { url: "", modifiedBy: "", SocialMediaTypeId: "" },
            urlValid: false,
            modifiedByValid: false,
            SocialMediaTypeIdValid: false,
            formValid: false,
            buttonText: "submit",
            ishidden: false,
            isShowing: false,
            successPopUp: false,
            text: "Submit Successfully",
            profilePicture: "http://www.wellesleysocietyofartists.org/wp-content/uploads/2015/11/image-not-found.jpg",
            UserId: ""
        }
        this.handleUserInput = this.handleUserInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSubmitSuccess = this.onSubmitSuccess.bind(this);
        this.onScrape_Success = this.onScrape_Success.bind(this);
        this.onIdSuccess = this.onIdSuccess.bind(this);
        this.onUpdate_Success = this.onUpdate_Success.bind(this);
        this.onGetUserSuccess = this.onGetUserSuccess.bind(this);
        this.onGetUserSuccess = this.onGetUserSuccess.bind(this);
        this.fileGetById_Success = this.fileGetById_Success.bind(this);
    };

    componentDidMount = () => {
        if (this.props.match.params.id) {
            let id = this.props.match.params.id;
            SocialMediaApi.SelectById(id, this.onIdSuccess, this.onIdError);
        }
        ContactUsApi.GetCurrentUser(this.onGetUserSuccess, this.onGetUserError)
    };

    onGetUserSuccess(resp) {
        this.setState({
            UserId: resp.data.id
        })
        FileUploadApi.ProfileImage(resp.data.id, this.fileGetById_Success, this.onSubmit_Error);
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

    onIdSuccess(resp) {
        this.setState({
            id: resp.data.item.id,
            url: resp.data.item.url,
            SocialMediaTypeId: resp.data.item.SocialMediaTypeId,
            modifiedBy: resp.data.item.modifiedBy,
            buttonText: "update",
            ishidden: true
        });
    }

    onSubmit(evt) {
        evt.preventDefault();
        if (!this.props.match.params.id) {
            this.setState({
                UserId: this.state.UserId,
                url: this.state.url,
                modifiedBy: this.state.ModifiedBy,
                SocialMediaTypeId: this.state.SocialMediaTypeId
            });
            SocialMediaApi.Insert({ ...this.state }, this.onSubmitSuccess, this.onSubmitError);
            ScraperApi.Insert({ ...this.state }, this.onScrape_Success, this.onScrape_Error);
        } else {
            this.setState({
                url: this.state.url,
                modifiedBy: this.state.ModifiedBy,
                SocialMediaTypeId: this.state.SocialMediaTypeId,
                ishidden: true
            });
            SocialMediaApi.Update({ ...this.state }, this.onUpdate_Success, this.onUpdate_Error);
        }
    };

    onScrape_Success(resp) {
        console.log(resp)
        console.log(resp.data.item);
        var encodedStr = resp.data.item.image;
        var parser = new DOMParser();
        var dom = parser.parseFromString(
            '<!doctype html><body>' + encodedStr,
            'text/html');
        var decodedString = dom.body.textContent;
        this.setState({
            isShowing: true,
            url: resp.data.item.url,
            modifiedBy: resp.data.item.description,
            image: decodedString,
            webUrl: resp.data.item.url,
            webDescription: resp.data.item.description,
            webTitle: resp.data.item.title
        });
    }

    onScrape_Error(err) {
        console.log(err)
    };

    onSubmitSuccess(resp) {
        console.log(resp, "Created User Successfully")
        this.setState({
            successPopUp: true
        })
        this.refs.form.reset();
    };

    onSubmitError(err) {
        console.log(err)
    };

    onUpdate_Success(resp) {
        console.log("Update Successfully")
        this.setState({
            successPopUp: true,
            text: "Submit Successfully"
        })
    };

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value },
            () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let urlValid = this.state.urlValid;
        let modifiedByValid = this.state.modifiedByValid;
        let SocialMediaTypeIdValid = this.state.SocialMediaTypeIdValid;

        switch (fieldName) {
            case 'url':
                urlValid = value.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);
                fieldValidationErrors.url = urlValid ? '' : 'Invalid Url!!';
                break;
            case 'modifiedBy':
                modifiedByValid = value.length >= 2;
                fieldValidationErrors.modifiedBy = modifiedByValid ? '' : ' is too short';
                break;
            case 'SocialMediaTypeIdValid':
                SocialMediaTypeIdValid = value.value = 0;
                fieldValidationErrors.SocialMediaTypeIdValid = SocialMediaTypeIdValid ? '' : ' Please select one';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            urlValid: urlValid,
            modifiedByValid: modifiedByValid,
            SocialMediaTypeIdValid: SocialMediaTypeIdValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({ formValid: this.state.urlValid && this.state.modifiedByValid && this.state.SocialMediaTypeIdValid });
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'has-error');
    }

    render() {
        return (
            <div class="container">
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
                                    <figcaption class="u-block-hover__additional--fade g-bg-black-opacity-0_5 g-pa-30">
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
                                            <h6 className="g-mb-10">Web Design <span class="float-right g-ml-10">68%</span></h6>
                                            <div className="js-hr-progress-bar progress g-bg-black-opacity-0_1 rounded-0 g-mb-5">

                                                <div className="js-hr-progress-bar-indicator progress-bar g-bg-cyan u-progress-bar--xs" role="progressbar" style={divStyle} aria-valuenow="68" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <small className="g-font-size-12">11% more than last week</small>
                                        </div>
                                        <div className="g-mb-20">
                                            <h6 className="g-mb-10">Dribbble Shots <span class="float-right g-ml-10">62%</span></h6>
                                            <div className="js-hr-progress-bar progress g-bg-black-opacity-0_1 rounded-0 g-mb-5">
                                                <div className="js-hr-progress-bar-indicator progress-bar g-bg-pink u-progress-bar--xs" role="progressbar" style={diStyle} aria-valuenow="62" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                            <small className="g-font-size-12">20% less than last week</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Break */}
                            <div className="col-lg-9">
                                <div className="card border-0">
                                    <div className="container">

                                        {
                                            this.state.successPopUp ?
                                                <div className="alert alert-success" role="alert">
                                                    {this.state.text}
                                                </div>
                                                : null
                                        }
                                        <div className="panel panel-default">
                                            <FormErrors formErrors={this.state.formErrors} />
                                        </div>
                                        <form className="col-md-8 offset-md-2">
                                            <div className="form-group">
                                                <div className={`form-group ${this.errorClass(this.state.formErrors.url)}`}>
                                                    <label htmlFor="url" >Url</label>
                                                    <input type="url"
                                                        name="url"
                                                        className="form-control"
                                                        id="url"
                                                        value={this.state.url}
                                                        onChange={this.handleUserInput}
                                                        placeholder="http://facebook.com please enter in this format" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className={`form-group ${this.errorClass(this.state.formErrors.SocialMediaTypeId)}`}>
                                                    <label htmlFor="SocialMediaTypeId"> Select a Category:
          <select name="SocialMediaTypeId" selected="selected" value={this.state.SocialMediaTypeId}
                                                            onChange={this.handleUserInput}>
                                                            <option value="0"> Please select One </option>
                                                            <option value="1">Facebook</option>
                                                            <option value="2">InstaGram</option>
                                                            <option value="3"> Twitter</option>
                                                            <option value="4"> LinkedIn</option>
                                                            <option value="5"> Tumblr </option>
                                                            <option value="6"> Google </option>
                                                        </select>
                                                    </label>
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-primary"
                                                onClick={this.onSubmit}>{this.state.buttonText}</button>
                                        </form>

                                        {
                                            this.state.isShowing ?
                                                <div className="card" style={divCardStyle}>
                                                    <div className="card-body">
                                                        <a href={this.state.url} style={aStyle}>{this.state.url}</a>
                                                        <img className="card-img-right" style={imgStyle} src={this.state.image} alt="Scraped" />
                                                        <br></br>
                                                        <br></br>
                                                        <h5 className="card-title text-left">{this.state.webTitle}</h5>
                                                        <p className="card-text text-left">{this.state.webDescription}</p>
                                                    </div>
                                                </div>
                                                : null
                                        };
            </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        );
    }
};
const mapStateToProps = (state) => {
    return {
        Id: state.UserReducer
    };
};

export default connect(mapStateToProps)(ProfileAddSocialMedia);