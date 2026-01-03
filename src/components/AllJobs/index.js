import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const failureViewImg =
  'https://assets.ccbp.in/frontend/react-js/failure-img.png'

class AllJobs extends Component {
  state = {
    profileData: [],
    jobsData: [],
    checkboxInputs: [],
    radioInput: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    apiJobStatus: apiJobsStatusConstants.initial,
  }

  componentDidMount() {
    this.onGetProfileDetails()
    this.onGetJobDetails()
  }

  onGetProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const {checkboxInputs, radioInput, searchInput} = this.state
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const optionsProfile = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responsesProfile = await fetch(profileApiUrl, optionsProfile)

    if (responsesProfile.ok === true) {
      const fetchedDataProfile = [await responsesProfile.json()]
      const updatedDataProfile = fetchedDataProfile.map(eachItem => ({
        name: eachItem.profile_details_name,
        profileImageUrl: eachItem.profile_details_profile_image_url,
        shortBio: eachItem.profile_details_short_bio,
      }))

      this.setState({
        profileData: updatedDataProfile,
        responseSuccess: true,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiJobsStatusConstants.failure})
    }
  }

  onGetJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {checkboxInputs, radioInput, searchInput} = this.state
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const optionsJobs = {
      header: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseJobs = await fetch(jobsApiUrl, optionsJobs)
    if (responseJobs.ok === true) {
      const fetchedDataJobs = await responseJobs.json()
      const updatedDataJobs = fetchedDataJobs.jobs.map(eachJobs => ({
        companyLogoUrl: eachJobs.company_logo_url,
        employmentType: eachJobs.employment_type,
        id: eachJobs.id,
        jobsDescription: eachJobs.job_description,
        location: eachJobs.location,
        packagePerAnnum: eachJobs.package_per_annum,
        rating: eachJobs.rating,
        title: eachJobs.title,
      }))
      this.setState({
        jobsData: updatedDataJobs,
        apiJobStatus: apiJobStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiJobsStatusConstants.failure})
    }
  }

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.onGetJobDetails)
  }

  onGetInputOption = event => {
    const {checkboxInputs} = this.state
    const inputNotInList = checkboxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInputs: [...prevState.checkboxInputs, event.target.id],
        }),
        this.onGetJobDetails,
      )
    } else {
      const filteredData = checkboxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState(
        prevState => ({
          checkboxInputs: prevState.filteredData,
        }),
        this.onGetJobDetails,
      )
    }
  }

  onGetProfileView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData[0]
      return (
        <div className="profile-container">
          <img src={profileImageUrl} alt="profile" className="profile-icon" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-description">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  onRetryProfile = () => {
    this.onGetProfileDetails()
  }

  onGetProfileFailureView = () => (
    <div className="failure-button-container">
      <button
        className="failure-button"
        type="button"
        onClick={this.onRetryProfile}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingview = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRenderProfileStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.onGetProfileView()
      case apiStatusConstants.failure:
        return this.onGetProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingview()
      default:
        return null
    }
  }

  onRetryJobs = () => {
    this.onGetJobDetails()
  }

  onGetJobsFailureView = () => (
    <div className="failure-img-button-container">
      <img src={failureViewImg} alt="failure view" className="failure-img" />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        we cannot seem to find the page you are looking for
      </p>
      <button
        className="failure-button"
        type="button"
        onClick={this.onRetryJobs}
      >
        Retry
      </button>
    </div>
  )

  onGetJobsView = () => {
    const {jobsData} = this.state
    const noJobs = jobsData.length === 0
    return noJobs ? (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="no jobs"
          className="no-jobs-img"
        />
        <h1>No jobs found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    ) : (
      <ul className="ul-jobs-items-container">
        {jobsData.map(eachItem => (
          <jobItem key={eachItem.id} jobData={eachItem} />
        ))}
      </ul>
    )
  }

  onRenderJobStatus = () => {
    const {apiJobStatus} = this.state

    switch (apiJobStatus) {
      case apiJobsStatusConstants.success:
        return this.onGetJobsView()
      case apiJobsStatusConstants.failure:
        return this.onGetJobsFailureView()
      case apiJobsStatusConstants.inProgress:
        return this.renderLoadingview()
      default:
        return null
    }
  }

  onGetCheckBoxesView = () => (
    <ul className="check-boxes-container">
      {employmentTypesList.map(eachItem => (
        <li className="li-container" key={eachItem.employmentTypeId}>
          <input
            type="checkbox"
            className="input"
            id={eachItem.employmentTypeId}
            onChange={this.onGetInputOption}
          />
          <label className="label" htmlFor={eachItem.employmentTypeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetRadioButtonView = () => (
    <ul className="radio-button-container">
      {salaryRangesList.map(eachItem => (
        <li className="li-container" key={eachItem.salaryRangeId}>
          <input
            className="radio"
            id={eachItem.salaryRangeId}
            type="radio"
            name="option"
            onChange={this.onGetRadioOption}
          />
          <label className="label" htmlFor={eachItem.salaryRangeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.onGetJobDetails()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.onGetJobDetails()
    }
  }

  render() {
    const {checkboxInputs, radioInput, searchInput} = this.state

    return (
      <>
        <Header />
        <div className="all-jobs-container">
          <div className="side-bar-container">
            {this.onRenderProfileStatus()}
            <hr className="hr-line" />
            <h1 className="text">Type of Employment</h1>
            {this.onGetCheckBoxesView()}
            <hr className="hr-line" />
            <h1>Salary Range</h1>
            {this.onGetRadioButtonView()}
          </div>
          <div className="job-container">
            <div>
              <input
                className="search-input"
                type="search"
                value={searchInput}
                placeholder="Search"
                onChange={this.onGetSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                type="button"
                className="search-button"
                onClick={this.onSubmitSearchInput}
              >
                <AiOutlineSearch className="search-icon" />
              </button>
              {this.onRenderJobStatus()}
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default AllJobs
