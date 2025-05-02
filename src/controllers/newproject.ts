import { Request, Response } from "express";
import { createProjects, deleteExistingProject, getAllProjects, getProjectsByTeams, updateProjects } from "../../db/projects.js";


export const getNewProjectPage = (req: Request, res: Response) => {
  res.send('Welcome to the new project page!');
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Server error while fetching projects.' });
  }
  
};

export const getProjectsByTeam = async (req: Request, res: Response) => {
  try {
    const { teamid } = req.params;
    const projects = await getProjectsByTeams(teamid);
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects by team:', error);
    res.status(500).json({ error: 'Server error while fetching projects by team.' });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectname, projectdescription, status, startdate, enddate } = req.body;
    const project = await createProjects(projectname, projectdescription, status, startdate, enddate);
    if (!project) {
      res.status(400).json({ error: 'Failed to create project.' });
      return;
    }
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while creating project.' });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { projectname, description, status, startdate, enddate } = req.body;
    const project = await updateProjects(id, projectname, description, status, startdate, enddate);
    if (!project) {
      res.status(400).json({ error: 'Failed to update project.' });
      return;
    }
    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating project.' });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedProject = await deleteExistingProject(req.params.id);
    if (!deletedProject) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }
    res.status(200).json(deletedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while deleting project.' });
  }
};
