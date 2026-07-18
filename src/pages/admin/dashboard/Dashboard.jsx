import { useAuth } from '@/hooks/useAuth'
import React from 'react'
import BusinessDashboard from "./BusinessDashboard";
import RootDashbaord from './RootDashbaord';
const Dashboard = () => {
  const {user} = useAuth();
  console.log("user - ",user)
  
    if(user?.type == "super_admin"){
      return <RootDashbaord/>
    }

    if(user?.type == 'business'){
      return <BusinessDashboard/>
    }
}

export default Dashboard