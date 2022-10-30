
export default function ProfileTeamMember({ document }) {
  return (
    <div>
      <h4 className="page-subtitle">Teams</h4>
      {document.teams[0] ? (
        <ul className="team-items">
          {document.teams.map((team, index) => (
            <li key={index} className="team-item">{team}</li>
          ))}
        </ul>
      ) : (
        <p className="team-item">No team yet</p>
      )}
    </div>
  )
}
