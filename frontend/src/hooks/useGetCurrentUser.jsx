import React from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useEffect } from 'react'
function useGetCurrentUser() {
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/user/current`, { withCredentials: true })
        console.log("Current User:", response.data)
      } catch (error) {
        console.error("Error fetching current user:", error)
      }
    }
    fetchCurrentUser()
  }, [])
}

export default useGetCurrentUser