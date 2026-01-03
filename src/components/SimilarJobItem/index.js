import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails

  return (
    <li className="similar-job-item">
      <div className="logo-title-location-container">
        <div className="logo-title-container">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
            className="company-logo"
          />
          <div className="title-rating-container">
            <h1>{title}</h1>
            <div className="rating-container">
              <BsStarFill className="rating-icon" />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <hr />
        <h1>Description</h1>
        <p>{jobDescription}</p>
        <div className="locationEmployee">
          <div className="location-container">
            <MdLocationOn />
            <p>{location}</p>
          </div>
          <div className="employee-type-container">
            <BsFillBriefcaseFill />
            <p>{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}
export default SimilarJobItem
