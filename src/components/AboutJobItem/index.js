import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AboutJobItem extends Component {
  state = {
    jobDataDetails: [],
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getJobData = async props => {
    const {match} = props
    const {params} = match
    const {id} = params
    this.setState = {
      apiStatus: apiStatusConstants.inProgress,
    }
    const jwtToken = Cookies.get('jwt_token')
    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const optionsJobsData = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseJobsData = await fetch(jobDetailsApiUrl, optionsJobsData)
    if (responseJobsData.ok === true) {
      const fetchedJobata = await responseJobsData.json()
      const updatedJobDetailsData = [fetchedJobata.job_details].map(
        eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          companyWebsiteUrl: eachItem.company_website_url,
          employmentType: eachItem.employment_type,
          id: eachItem.id,
          jobsDescription: eachItem.job_description,
          lifeAtCompany: {
            description: eachItem.life_at_company.description,
            imageUrl: eachItem.life_at_company.image_url,
          },
          location: eachItem.location,
          packagePerAnnum: eachItem.package_per_annum,
          rating: eachItem.rating,
          skills: eachItem.skills.map(eachSkill => ({
            imageUrl: eachSkill.image_url,
            name: eachSkill.name,
          })),
          title: eachItem.title,
        }), 

      const updatedSimilarJobDetails = fetchedJobata.similar_jobs.map(
        eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          employmentType: eachItem.employment_type,
          location: eachItem.location,
          rating: eachItem.rating,
          title: eachItem.title,
        }),
      )
      this.setState({
        jobDataDetails: updatedJobDetailsData,
        similarJobsData: updatedSimilarJobDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobDetailsSuccessView = () => {
    const {jobDataDetails, similarJobsData} = this.state
    if (jobDataDetails.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        id,
        jobDescription,
        lifeAtCompany,
        location,
        packagePerAnnum,
        rating,
        skills,
        title,
      } = jobDataDetails[0]
      return (
        <>
          <div className="job-item-container">
            <div className="first-part-container">
              <div className="img-title-container">
                <img
                  src={companyLogoUrl}
                  alt="job details company logo"
                  className="companylogo"
                />
                <div className="title-rating-container">
                  <h1 className="title-heading">{title}</h1>
                  <div className="star-rating-contaiber">
                    <AiFillStar className="star-icon" />
                    <p className="rating-text">{rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-package-container">
                <div className="location-job-type-container">
                  <div className="location-icon-location-container">
                    <MdLocationOn className="location-icon" />
                    <p className="location">{location}</p>
                  </div>
                  <div className="employemt-type-icon-container">
                    <p>{employmentType}</p>
                  </div>
                </div>
                <div className="package-container">
                  <p className="package">{packagePerAnnum}</p>
                </div>
              </div>
              <hr className="item-hr-line" />
              <div className="second-part-container">
                <div className="description-visit-container">
                  <h1>Description</h1>
                  <a href={companyWebsiteUrl}>
                    Visit <BiLinkExternal />
                  </a>
                </div>
                <p className="description-para">{jobDescription}</p>
              </div>
              <h1>Skills</h1>
              <ul>
                {skills.map(eachItem => (
                  <li key={eachItem.name}>
                    <img
                      src={eachItem.imageUrl}
                      alt={eachItem.name}
                      className="skill-img"
                    />
                    <p>{eachItem.name}</p>
                  </li>
                ))}
              </ul>
              <div className="company-life-img-container">
                <div className="life-heading-para-container">
                  <h1>Life at Company</h1>
                  <p>{lifeAtCompany.description}</p>
                </div>
                <img src={lifeAtCompany.imageUrl} alt="life at company" />
              </div>
              <h1 className="similar-jobs-heading">Similar Jobs</h1>
              <ul className="similar-jobs-ul-container">
                {similarJobsData.map(eachItem => (
                  <SimilarJobs
                    key={eachItem.id}
                    similarJobsData={eachItem}
                    employmentType={employmentType}
                  />
                ))}
              </ul>
            </div>
          </div>
        </>
      )
    }
    return null
  }

  onRetryJobDetails = () => {
    this.getJobData()
  }

  renderJobFailureView = () => (
    <div className="job-details-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        we cannot seem to find the page you are looking for
      </p>
      <button
        className="failure-button"
        type="button"
        onClick={this.onRetryJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderJobLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobFailureView()
      case apiStatusConstants.inProgress:
        return this.renderJobLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-view-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}
export default AboutJobItem
