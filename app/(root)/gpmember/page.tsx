import React from "react";
import {db} from "@/lib/db"
const page = async () => {
//Notification
const  notification = await db.notification.findMany()
  return <div>
  <pre>

    {
      JSON.stringify(notification, null, 2)
    }
  </pre>
  
  </div>;
};

export default page;
