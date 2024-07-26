'use client'
import { useCallback, useEffect, useState } from 'react'
import { getProjectData, getProjects } from "@/utils/db/dbFunctions"
import { formatCurrency } from "@/utils/utils"
import DeleteButton from "../deleteButton"
import Spinner from '@/components/spinner/Spinner'

// Return a list of `params` to populate the [id] dynamic segment
// export async function generateStaticParams() {
//     const projects = await getProjects(null)

//     console.log('Projects loaded', projects)

//     return projects.map((project) => ({
//         project: project.project_id.toString()
//     }))
// }

export default function ProjectDetail({ params }: { params: { project: number } }) {
    const { project } = params
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [projectData, setProjectData] = useState<any | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const res = await getProjectData(project)

            if (res) {
                setProjectData(res)
            } else {
                setError('Project not found')
            }
        } catch (error: any) {
            console.log("An error occurred:", error)
            setError('Failed to fetch project data')
        } finally {
            setLoading(false)
        }
    }, [project])

    useEffect(() => {
        fetchData()
    }, [project, fetchData])

    if (loading) return  <Spinner />
    if (error) return <h1>{error}</h1>

    return (
        <>
            <h1>Project: {project}</h1>
            <h6>Project Name: {projectData.project_name}</h6>
            <h6>Project Description: {projectData.description}</h6>
            <h6>Amount due: {formatCurrency(projectData.amount_due)}</h6>
            <h6>Amount Paid: {formatCurrency(projectData.amount_paid)}</h6>
            <h6>Balance: {formatCurrency(projectData.balance)}</h6>

            <div className='pt-10'>
                <DeleteButton project={project} />
            </div>
        </>
    )
}
