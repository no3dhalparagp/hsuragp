import React from "react";

const PMAYEligibilityPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-white text-center">
            PMAY-G Eligibility Criteria
          </h1>
          <p className="text-blue-100 text-center mt-2">
            Pradhan Mantri Awaas Yojana - Gramin
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-[1.01] transition-transform">
            <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center">
              <span className="bg-blue-100 p-2 rounded-lg mr-3">📋</span>
              Basic Eligibility Requirements
            </h2>
            <ul className="list-none pl-6 space-y-3">
              <li>
                Households with no house or living in kutcha/dilapidated house
              </li>
              <li>
                Must be listed in SECC (Socio Economic Caste Census) 2011 data
              </li>
              <li>
                Should belong to one of the following categories:
                <ul className="list-circle pl-6 mt-2">
                  <li>Houseless families</li>
                  <li>Manual scavengers</li>
                  <li>Primitive tribal groups</li>
                  <li>Legally released bonded laborers</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-[1.01] transition-transform">
            <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center">
              <span className="bg-blue-100 p-2 rounded-lg mr-3">⭐</span>
              Priority Criteria
            </h2>
            <ul className="list-none space-y-3">
              <li>SC/ST households</li>
              <li>Minorities</li>
              <li>Disabled persons</li>
              <li>Widows or next-of-kin of deceased defense personnel</li>
              <li>Households with a woman as the head</li>
              <li>Natural calamity-affected families</li>
            </ul>
          </section>

          <section className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-[1.01] transition-transform">
            <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center">
              <span className="bg-blue-100 p-2 rounded-lg mr-3">💰</span>
              Financial Assistance
            </h2>
            <p className="mb-4 text-gray-600">
              Under PMAY-G, beneficiaries receive:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Plain Areas</h3>
                <p className="text-2xl font-bold text-blue-600">₹1.20 lakh</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">
                  Hilly States/UTs
                </h3>
                <p className="text-2xl font-bold text-blue-600">₹1.30 lakh</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">•</span>
                Additional ₹12,000 for toilet construction
              </li>
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">•</span>
                90/95 person-days of unskilled labor wages
              </li>
            </ul>
          </section>

          <section className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-[1.01] transition-transform">
            <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center">
              <span className="bg-blue-100 p-2 rounded-lg mr-3">📝</span>
              How to Apply
            </h2>
            <div className="flex flex-col space-y-4">
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                  1
                </span>
                <p>Visit your local Gram Panchayat office</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                  2
                </span>
                <p>Verify if your name is in the SECC-2011 list</p>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                  3
                </span>
                <div>
                  <p className="mb-2">Submit required documents including:</p>
                  <ul className="grid md:grid-cols-2 gap-2 pl-4">
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Identity proof (Aadhaar card)
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Income certificate
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Land ownership documents
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      Bank account details
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start">
                <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                  4
                </span>
                <p>Wait for verification and approval from authorities</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PMAYEligibilityPage;
