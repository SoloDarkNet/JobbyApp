import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import SkillsCard from '../SkillsCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getFormattedSimilarData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getFormattedata = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    rating: data.rating,
    title: data.title,
    packagePerAnnum: data.package_per_annum,
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
  })

  getJobData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateData = this.getFormattedata(data.job_details)
      const updatedSimilarjobData = data.similar_jobs.map(eachSimilarJob =>
        this.getFormattedSimilarData(eachSimilarJob),
      )
      this.setState({
        jobData: updateData,
        similarJobsData: updatedSimilarjobData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    return (
      <div className='failure-img-button-container'>
        <img
          src='https://assets.ccbp.in/frontend/react-js/failure-img.png'
          alt='failure view'
          className='failure-img'
        />
        <h1 className='failure-heading'>Oops! Something Went Wrong</h1>
        <p className='failure-paragraph'>
          we cannot seem to find the page you are looking for
        </p>
        <button
          type='button'
          id={id}
          className='failure-button'
          onClick={this.getJobData}
        >
          Retry
        </button>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className='loader-container' data-testid='loader'>
      <Loader type='ThreeDots' color='#0b69ff' height='50' width='50' />
    </div>
  )

  renderJobDetailsView = () => {
    const {jobData, similarJobsData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      lifeAtCompany,
      skills,
      title,
    } = jobData
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className='job-details-view-container'>
        <div className='job-item'>
          <div className='logo-title-location-container'>
            <div className='logo-title-container'>
              <img
                src={companyLogoUrl}
                alt='job details company logo'
                className='company-logo'
              />
              <div className='title-rating-container'>
                <h1>{title}</h1>
                <div className='rating-container'>
                  <BsStarFill className='rating-icon' />
                  <p>{rating}</p>
                </div>
              </div>
            </div>
            <div className='location-package-container'>
              <div className='location-employee-container'>
                <div className='location-container'>
                  <MdLocationOn />
                  <p>{location}</p>
                </div>
                <div className='employee-type-container'>
                  <BsFillBriefcaseFill />
                  <p>{employmentType}</p>
                </div>
              </div>
              <p>{packagePerAnnum}</p>
            </div>
          </div>
          <hr />
          <h1>Description</h1>
          <div className='visit-container'>
            <a href={companyWebsiteUrl}>
              Visit
              <BiLinkExternal />
            </a>
          </div>
          <p>{jobDescription}</p>
          <h1>Skills</h1>

          <ul>
            {skills.map(eachSkill => (
              <SkillsCard skillDetails={eachSkill} key={eachSkill.name} />
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div>
            <p>{description}</p>
            <img src={imageUrl} alt='life at company' />
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul>
          {similarJobsData.map(eachSimilarJob => (
            <SimilarJobItem
              jobDetails={eachSimilarJob}
              key={eachSimilarJob.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderJobDetails()}</div>
      </>
    )
  }
}
export default JobItemDetails
