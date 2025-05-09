import { useState, useEffect } from 'react';
import Team from '../../db/teams';

export default function TeamPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedteam, setSelectedTeam] = useState<number | null>(null);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [newteamname, setNewTeamName] = useState('');
  const [username, setUsername] = useState<string>(
    localStorage.getItem('username') || '',
  ); // use this line

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch('/api/team', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        credentials: 'include',
      });
      const data = await response.json();
      setTeams(data);
    };
    fetchTeams();
  }, []);

  const handleCreateTeam = async () => {
    const response = await fetch('/api/team', {
      method: 'POST',
      body: JSON.stringify({ teamname: newteamname, username: localStorage.getItem('username') }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      credentials: 'include',
    });
    const data = await response.json();
    setTeams([...teams, data]);
    setNewTeamName('');
  };

  const handleSelectTeam = async (teamid: string) => {
    const response = await fetch(`/api/projects?teamId=${teamid}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      credentials: 'include',
    });
    const data = await response.json();
    setProjects(data);
    setSelectedTeam(Number(teamid));
  };

  const handleDeleteTeam = async (teamid: string) => {
    await fetch(`/api/teams/${teamid}`, {
      method: 'DELETE',
    });
    setTeams(teams.filter((team) => team.id !== Number(teamid)));
  };

  return (
    <div className="form">
      <div className="inner-form">
        <h1 style={{ color: 'white' }}>Teams</h1>
        <br />
        <input
          type="text"
          className="form-control"
          value={newteamname}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="Enter new team name"
        />
        <input
          type="text"
          className="form-control"
          style={{ marginTop: '10px' }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <br />
        <button className="btn btn-primary" onClick={handleCreateTeam}>
          Create Team
        </button>
      </div>
      <br />
      <div className="inner-form">
        <h2 style={{ color: 'white' }}>Select Team</h2>
        {teams.length ? (
          <ul style={{ paddingLeft: 0 }}>
            {teams.map((team) => (
              <li
                key={team.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '8px',
                  listStyle: 'none',
                }}
              >
                <button
                  onClick={() => handleSelectTeam(team.id.toString())}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    marginRight: '10px',
                  }}
                >
                  {team.teamname}
                </button>
                <button
                  onClick={() => handleDeleteTeam(team.id.toString())}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'gray' }}>No teams available. Create one!</p>
        )}
      </div>
      <br />
      <div className="inner-form">
        <h2 style={{ color: 'white' }}>Projects</h2>
        {projects.length ? (
          <ul>
            {projects.map((project) => (
              <li key={project.id} style={{ marginBottom: '8px' }}>
                {project.name}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'gray' }}>
            No projects available. Create one within the team.
          </p>
        )}
      </div>
    </div>
  );
}
