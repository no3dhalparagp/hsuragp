import React from "react";

import { auth } from "@/auth";
import { useRouter } from "next/navigation";

const Home = () => {
  const session = auth();
  const router = useRouter();
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You must be logged in to view this page.
          </p>

          <button
            onClick={() => router.push("auth/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return <div>Home</div>;
};

export default Home;
