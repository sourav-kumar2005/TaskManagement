// 'use client'

// import React, { useEffect, useState } from "react"
// import { useRouter } from 'next/navigation'
// import Link from "next/link"
// import toast from 'react-hot-toast'

// const BackendURL = 'http://3.108.228.94:8001'

// export default function EODReport() {
//   const router = useRouter()
//   const [organizations, setOrganizations] = useState([])
//   const [members, setMembers] = useState([])
//   const [selectedOrg, setSelectedOrg] = useState("")
//   const [selectedMember, setSelectedMember] = useState("")
//   const [task, setTask] = useState({ name: "", description: "" })
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [showMembersDropdown, setShowMembersDropdown] = useState(false)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     fetchOrganizations()
//   }, [])

//   const fetchOrganizations = async () => {
//     try {
//       const response = await fetch(`${BackendURL}/api/v1.0/orgs/`)
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
//       const data = await response.json()
//       setOrganizations(data.organization_name || [])
//     } catch (error) {
//       console.error("Error fetching organizations:", error)
//       toast.error("Failed to fetch organizations. Please try again.")
//     }
//   }

//   const fetchMembers = async (orgName) => {
//     try {
//       const response = await fetch(`${BackendURL}/api/v1.0/employees/${orgName}`)
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
//       const data = await response.json()
//       setMembers(data.employee_names || [])
//     } catch (error) {
//       console.error("Error fetching members:", error)
//       toast.error("Failed to fetch members. Please try again.")
//     }
//   }

//   const handleOrgChange = (e) => {
//     const orgName = e.target.value
//     setSelectedOrg(orgName)
//     setSelectedMember("")
//     setMembers([])
//     setShowMembersDropdown(false)
//     if (orgName) fetchMembers(orgName)
//   }

//   const toggleMembersDropdown = () => {
//     if (selectedOrg) {
//       setShowMembersDropdown(!showMembersDropdown)
//     } else {
//       toast.error("Please select an organization first.")
//     }
//   }

//   const handleMemberSelect = (memberName) => {
//     setSelectedMember(memberName)
//     setShowMembersDropdown(false)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsSubmitting(true)
//     setError("")

//     if (!selectedMember) {
//       toast.error("Please select a member before submitting the task.")
//       setIsSubmitting(false)
//       return
//     }

//     try {
//       const response = await fetch(`${BackendURL}/api/v1.0/tasks`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           org_name: selectedOrg,
//           mem_name: selectedMember,
//           task_name: task.name,
//           description: task.description || "",
//           date: new Date()
//         })
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || "Failed to submit EOD report")
//       }

//       const result = await response.json()
//       // console.log("Server response:", result)

//       toast.success("EOD report submitted successfully!")
//       router.push('/dashboard')

//     } catch (error) {
//       console.error("Error submitting EOD report:", error)
//       toast.error(error.message || "Failed to submit EOD report. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//       setTask({ name: "", description: "" })
//       router.push('/dashboard')
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center">
//             <h1 className="text-3xl font-bold text-gray-900">EOD Report</h1>
//             <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//               All Tasks
//             </Link>
//           </div>
//         </div>
//       </header>
//       <main>
//         <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//           <div className="px-4 py-6 sm:px-0">
//             <div className="bg-white shadow overflow-hidden rounded-lg">
//               <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                
//                 <div className="grid grid-cols-6 gap-6 text-black">
//                   <div className="col-span-6 sm:col-span-3">
//                     <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Organization</label>
//                     <select
//                       id="organization"
//                       name="organization"
//                       className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                       value={selectedOrg}
//                       onChange={handleOrgChange}
//                       required
//                     >
//                       <option value="">Select your organization</option>
//                       {organizations.map((org, index) => (
//                         <option key={index} value={org}>
//                           {org}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="col-span-6 sm:col-span-3 relative">
//                     <label htmlFor="member" className="block text-sm font-medium text-gray-700">Member</label>
//                     <div className="mt-1 relative">
//                       <button
//                         type="button"
//                         onClick={toggleMembersDropdown}
//                         className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                         aria-haspopup="listbox"
//                         aria-expanded="true"
//                         aria-labelledby="listbox-label"
//                       >
//                         <span className="block truncate">{selectedMember || "Select a member"}</span>
//                         <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
//                           <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                             <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//                           </svg>
//                         </span>
//                       </button>

//                       {showMembersDropdown && (
//                         <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm" tabIndex={-1} role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
//                           {members.map((member, index) => (
//                             <li
//                               key={index}
//                               className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
//                               id={`listbox-option-${index}`}
//                               role="option"
//                               onClick={() => handleMemberSelect(member)}
//                             >
//                               <span className="font-normal block truncate">
//                                 {member}
//                               </span>
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                     </div>
//                   </div>

//                   <div className="col-span-6">
//                     <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">Task Name</label>
//                     <input
//                       type="text"
//                       name="taskName"
//                       id="taskName"
//                       className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//                       value={task.name}
//                       onChange={(e) => setTask({ ...task, name: e.target.value })}
//                       required
//                     />
//                   </div>

//                   <div className="col-span-6">
//                     <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">Task Description</label>
//                     <textarea
//                       id="taskDescription"
//                       name="taskDescription"
//                       rows={4}
//                       className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
//                       value={task.description}
//                       onChange={(e) => setTask({ ...task, description: e.target.value })}
//                       required
//                     ></textarea>
//                   </div>
//                 </div>
//                 <div className="mt-6">
//                   <button
//                     type="submit"
//                     className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? 'Submitting...' : 'Submit EOD Report'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import toast from 'react-hot-toast'

const BackendURL = 'http://3.108.228.94:8001'

export default function EODReport() {
  const router = useRouter()
  const [organizations, setOrganizations] = useState([])
  const [members, setMembers] = useState([])
  const [selectedOrg, setSelectedOrg] = useState("")
  const [selectedMember, setSelectedMember] = useState("")
  const [tasks, setTasks] = useState([{ name: "", description: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMembersDropdown, setShowMembersDropdown] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      const response = await fetch(`${BackendURL}/api/v1.0/orgs/`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setOrganizations(data.organization_name || [])
    } catch (error) {
      console.error("Error fetching organizations:", error)
      toast.error("Failed to fetch organizations. Please try again.")
    }
  }

  const fetchMembers = async (orgName) => {
    try {
      const response = await fetch(`${BackendURL}/api/v1.0/employees/${orgName}`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setMembers(data.employee_names || [])
    } catch (error) {
      console.error("Error fetching members:", error)
      toast.error("Failed to fetch members. Please try again.")
    }
  }

  const handleOrgChange = (e) => {
    const orgName = e.target.value
    setSelectedOrg(orgName)
    setSelectedMember("")
    setMembers([])
    setShowMembersDropdown(false)
    if (orgName) fetchMembers(orgName)
  }

  const toggleMembersDropdown = () => {
    if (selectedOrg) {
      setShowMembersDropdown(!showMembersDropdown)
    } else {
      toast.error("Please select an organization first.")
    }
  }

  const handleMemberSelect = (memberName) => {
    setSelectedMember(memberName)
    setShowMembersDropdown(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (!selectedMember) {
      toast.error("Please select a member before submitting the tasks.")
      setIsSubmitting(false)
      return
    }

    try {
      for (let task of tasks) {
        const response = await fetch(`${BackendURL}/api/v1.0/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            org_name: selectedOrg,
            mem_name: selectedMember,
            task_name: task.name,
            description: task.description || "",
            date: new Date()
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to submit EOD report")
        }
      }

      toast.success("EOD report submitted successfully!")
      router.push('/dashboard')

    } catch (error) {
      console.error("Error submitting EOD report:", error)
      toast.error(error.message || "Failed to submit EOD report. Please try again.")
    } finally {
      setIsSubmitting(false)
      setTasks([{ name: "", description: "" }])
      router.push('/dashboard')
    }
  }

  const addTask = () => {
    if (tasks[tasks.length -1].name && tasks[tasks.length -1].description) {
      setTasks([...tasks, { name: "", description: "" }])
    } else {
      toast.error("Please fill out the current task before adding more.")
    }
  }

  const removeTask = (index) => {
    if (tasks.length > 1) {
      const newTasks = [...tasks];
      newTasks.splice(index, 1);
      setTasks(newTasks);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">EOD Report</h1>
            <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              All Tasks
            </Link>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-6 gap-6 text-black">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Organization</label>
                    <select
                      id="organization"
                      name="organization"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={selectedOrg}
                      onChange={handleOrgChange}
                      required
                    >
                      <option value="">Select your organization</option>
                      {organizations.map((org, index) => (
                        <option key={index} value={org}>
                          {org}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3 relative">
                    <label htmlFor="member" className="block text-sm font-medium text-gray-700">Member</label>
                    <div className="mt-1 relative">
                      <button
                        type="button"
                        onClick={toggleMembersDropdown}
                        className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        aria-haspopup="listbox"
                        aria-expanded="true"
                        aria-labelledby="listbox-label"
                      >
                        <span className="block truncate">{selectedMember || "Select a member"}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </button>

                      {showMembersDropdown && (
                        <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm" tabIndex={-1} role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-option-3">
                          {members.map((member, index) => (
                            <li
                              key={index}
                              className="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                              id={`listbox-option-${index}`}
                              role="option"
                              onClick={() => handleMemberSelect(member)}
                            >
                              <span className="font-normal block truncate">
                                {member}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {tasks.map((task, index) => (
                    <React.Fragment key={index}>
                      <div className="col-span-6 flex justify-between items-center">
                        <label htmlFor={`taskName-${index}`} className="block text-sm font-medium text-gray-700">Task Name</label>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeTask(index)}
                            className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="col-span-6">
                        <input
                          type="text"
                          name={`taskName-${index}`}
                          id={`taskName-${index}`}
                          className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                          value={task.name}
                          onChange={(e) => {
                            const newTasks = [...tasks]
                            newTasks[index].name = e.target.value
                            setTasks(newTasks)
                          }}
                          required
                        />
                      </div>

                      <div className="col-span-6">
                        <label htmlFor={`taskDescription-${index}`} className="block text-sm font-medium text-gray-700">Task Description</label>
                        <textarea
                          id={`taskDescription-${index}`}
                          name={`taskDescription-${index}`}
                          rows={4}
                          className="mt-1 p-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
                          value={task.description}
                          onChange={(e) => {
                            const newTasks = [...tasks]
                            newTasks[index].description = e.target.value
                            setTasks(newTasks)
                          }}
                          required
                        ></textarea>
                      </div>
                    </React.Fragment>
                  ))}
                  <div className="col-span-6">
                    <button
                      type="button"
                      onClick={addTask}
                      className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Add Task
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit EOD Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

