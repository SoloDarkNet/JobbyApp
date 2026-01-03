import './index.css'

const SkillsCard = props => {
  const {skillDetails} = props
  const {imageUrl, name} = skillDetails
  return (
    <div className="dis">
      <li className="skills-item-container">
        <div className="skills-container">
          <img src={imageUrl} alt={name} className="skill-image" />
          <p>{name}</p>
        </div>
      </li>
    </div>
  )
}
export default SkillsCard
