import React from 'react';
import Axios from 'axios';

const divStyle = {
    width: "68%"
}
const diStyle = {
    width: "62%"
}

class Profile extends React.Component {
    constructor(props) {
        super(props);
    };
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
                                        <img className="img-fluid w-100 u-block-hover__main--zoom-v1" src="http://cdn2us.denofgeek.com/sites/denofgeekus/files/styles/main_wide/public/avengers-infinity-war-trailer-breakdown-analysis-thanos-infinity-gauntlet_106.png?itok=Xl1GaQ5L" alt="Image Description" />
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
                                    <Link to="/profileoverall" className="list-group-item list-group-item-action justify-content-between">
                                        <span><i className="icon-cursor g-pos-rel g-top-1 g-mr-8"></i> OverAll</span>
                                    </Link>
                                    <Link to="/profile" className="list-group-item list-group-item-action justify-content-between">
                                        <span><i className="icon-cursor g-pos-rel g-top-1 g-mr-8"></i> Profile</span>
                                    </Link>
                                    <Link to="/profileusercontact" className="list-group-item list-group-item-action justify-content-between">
                                        <span><i className="icon-cursor g-pos-rel g-top-1 g-mr-8"></i> Users Contact</span>
                                    </Link>
                                    <Link to="/profileproject" className="list-group-item list-group-item-action justify-content-between">
                                        <span><i className="icon-cursor g-pos-rel g-top-1 g-mr-8"></i> My Projects</span>
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
                        </div>
                    </div>
                </section>
            </div>
        );
    }
};
export default Profile;