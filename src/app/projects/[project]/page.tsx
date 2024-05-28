import { getProjectData, getProjects } from "@/utils/db/dbFunctions";
import { formatCurrency } from "@/utils/utils";
import DeleteButton from "../deleteButton";

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const projects = await getProjects(null);

    console.log('Projects loaded', projects)

    return projects.map((project) => ({
        project: project.project_id.toString()
    }))
}

export default async function Page({ params }: { params: { project: number } }) {
    const { project } = params

    const res = await getProjectData(project)
    
    if (!res.project_id) {
        console.error("Error fetching project data!");
        return <h1>Project not found!</h1>
    }
    
    console.log("project data", res)

    return (
        <>
            <h1>Project: {project}</h1>
            <h6>Project Name: {res.project_name}</h6>
            <h6>Project Description: {res.description}</h6>
            <h6>Amount due: {formatCurrency(res.amount_due)}</h6>
            <h6>Amount Paid: {formatCurrency(res.amount_paid)}</h6>
            <h6>Balance: {formatCurrency(res.balance)}</h6>

            <div className='pt-10'>
                <DeleteButton project={project} />
            </div>
        </>
    )
}