"use server"

import { createClient } from "../../lib/supabase/server"
import { Project } from "../../types/projects"
import { revalidatePath } from "next/cache"

export async function listProjects(): Promise<Project[]> {
  const supabase = await createClient()
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Failed to fetch projects:', error)
    return []
  }

  return projects || []
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient()
  
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Failed to fetch project:', error)
    return null
  }

  return project
}

export async function createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: "Authentication required" }
  }

  // Validate required fields
  if (!projectData.title?.trim()) {
    return { success: false, error: "Project title is required" }
  }

  if (!projectData.description?.trim()) {
    return { success: false, error: "Project description is required" }
  }

  if (!projectData.role_needed?.trim()) {
    return { success: false, error: "Role needed is required" }
  }

  if (!projectData.location?.trim()) {
    return { success: false, error: "Location is required" }
  }

  // Prepare data for insertion
  const insertData = {
    ...projectData,
    created_by: user.id,
    title: projectData.title.trim(),
    description: projectData.description.trim(),
    role_needed: projectData.role_needed.trim(),
    location: projectData.location.trim(),
    requirements: projectData.requirements || []
  }

  const { error: insertError } = await supabase
    .from('projects')
    .insert(insertData)

  if (insertError) {
    console.error('Failed to create project:', insertError)
    return { success: false, error: "Failed to create project" }
  }

  revalidatePath('/projects')
  return { success: true }
}

