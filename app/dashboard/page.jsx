"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { format } from "date-fns";

const BackendURL = "http://3.108.228.94:8001";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // New state for date filter
  const router = useRouter();

  useEffect(() => {
    fetchOrganizations();
    fetchTasks();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch(`${BackendURL}/api/v1.0/orgs/`);
      if (!response.ok) throw new Error("Failed to fetch organizations");
      const data = await response.json();
      setOrganizations(data.organization_name || []);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const fetchMembers = async (orgName) => {
    try {
      const response = await fetch(
        `${BackendURL}/api/v1.0/employees/${orgName}`
      );
      if (!response.ok) throw new Error("Failed to fetch members");
      const data = await response.json();
      setMembers(data.employee_names || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any existing errors

      // Validate unsupported filter combinations
      if (selectedMember && selectedDate) {
        setError(
          "Filtering by member along with date is not supported. Please deselect the member."
        );
        setLoading(false);
        return;
      }

      if (selectedDate && !selectedOrg) {
        setError(
          "Filtering by date without selecting an organization is not supported. Please select an organization and remove the date filter."
        );
        setLoading(false);
        return;
      }
      let url = `${BackendURL}/api/v1.0/eod-reports`;

      // Add filters to the URL dynamically
      if (selectedOrg && selectedMember) {
        url += `/${selectedOrg}/employee/${selectedMember}`;
      }

      if (selectedDate && selectedOrg) {
        const formattedDate = format(new Date(selectedDate), "yyyy-MM-dd");
        url += `/${selectedOrg}/date/${formattedDate}`;
      }

      // console.log("Fetching tasks from URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch tasks: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      // console.log("API Response:", data);

      // Handle empty or invalid responses
      if (data && data.eod_reports_data && data.eod_reports_data.length > 0) {
        setTasks(data.eod_reports_data);
      } else {
        setTasks([]);
        const errorMessage = selectedDate
          ? `No tasks found for Org ${selectedOrg}${
              selectedMember ? ` and employee ${selectedMember}` : ""
            } on ${format(new Date(selectedDate), "dd-MM-yyyy")}.`
          : `No tasks found for Org ${selectedOrg}${
              selectedMember ? ` and employee ${selectedMember}` : ""
            }.`;
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrgChange = (e) => {
    const orgName = e.target.value;
    setSelectedOrg(orgName);
    setSelectedMember("");
    if (orgName) {
      fetchMembers(orgName);
    } else {
      setMembers([]);
    }
  };

  const handleMemberChange = (e) => {
    setSelectedMember(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedOrg, selectedMember, selectedDate]);

  return (
    <div className="min-h-screen bg-gray-100 max-sm:w-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center max-sm:flex-col max-sm:gap-4">
          <h1
            className="text-3xl font-bold text-gray-900 cursor-pointer"
            onClick={() => router.push("/")}
          >
            Tasks Dashboard
          </h1>

          <div className="flex flex-row gap-4">
            <button
              onClick={() => router.push("/")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <Plus className="mr-2" size={20} />
              <span>New Task</span>
            </button>
            <button
              onClick={() => {
                setSelectedOrg("");
                setSelectedMember("");
                setSelectedDate("");
                fetchTasks();
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="mb-6 mx-auto grid grid-cols-3 text-black max-sm:grid-cols-2 max-sm:gap-2 max-sm:px-4">
            <select
              value={selectedOrg}
              onChange={handleOrgChange}
              className="block w-64 max-sm:w-40 px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Organizations</option>
              {organizations.map((org, index) => (
                <option key={index} value={org}>
                  {org}
                </option>
              ))}
            </select>
            <select
              value={selectedMember}
              onChange={handleMemberChange}
              className="block w-64 max-sm:w-40 px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={!selectedOrg}
            >
              <option value="">All Members</option>
              {members.map((member, index) => (
                <option key={index} value={member}>
                  {member}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="block w-64 max-sm:w-40 px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {loading ? (
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
              <p className="mt-2 text-gray-600">Loading tasks...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              <p className="text-xl max-w-3xl mx-auto">{error}</p>
              <button
                onClick={fetchTasks}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Try Again
              </button>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center">
              <p className="text-xl text-gray-600">No tasks found.</p>
              <Link
                href="/"
                className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Your First Task
              </Link>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      S.No.
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Organization
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Member Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Task Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date Added
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {task[1]}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {task[2]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task[3]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task[4]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(task[5]).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
