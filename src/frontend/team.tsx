import { useState, useEffect } from 'react';


export default function TeamPage() {
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch('/api/teams');
      const data = await response.json();
      setTeams(data);
    };
    fetchTeams();
  }, []);

  const handleCreateTeam = async () => {
    const response = await fetch('/api/team', {
      method: 'POST',
      body: JSON.stringify({ name: newTeamName }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    setTeams([...teams, data]);
    setNewTeamName('');
  };

  const handleSelectTeam = async (teamId: string) => {
    const response = await fetch(`/api/projects?teamId=${teamId}`);
    const data = await response.json();
    setProjects(data);
    setSelectedTeam(Number(teamId));
  };

  const handleDeleteTeam = async (teamId: number) => {
    await fetch(`/api/teams/${teamId}`, {
      method: 'DELETE',
    });
    setTeams(teams.filter(team => team.id !== teamId.toString()));
  };

  return (
    <div>
      <h1>Teams</h1>
      <div>
        <input
          type="text"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="Enter new team name"
        />
        <button onClick={handleCreateTeam}>Create Team</button>
      </div>

      <div>
        <h2>Select Team</h2>
        {teams.length ? (
          <select onChange={(e) => handleSelectTeam(String(e.target.value))}>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        ) : (
          <p>No teams available. Create one!</p>
        )}
      </div>

      <div>
        <h2>Projects</h2>
        {projects.length ? (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>{project.name}</li>
            ))}
          </ul>
        ) : (
          <p>No projects available. Create one within the team.</p>
        )}
      </div>
    </div>
  );
}
