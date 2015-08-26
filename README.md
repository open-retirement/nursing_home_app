Nursing Home Comparison Web Application

Purpose is to provide information about nearby nursing homes so that users can determine which is the best
option.

This is a node.js application using express and jade templating
My working version of node is v0.10.26 which is a little old, but it should work no problem with newer node versions

Start command with debug is- DEBUG=nursing_home_app npm start

CHI Data Sources:
     - Senior Centers https://data.cityofchicago.org/Health-Human-Services/Senior-Centers/qhfc-4cw2
     - Building Code Scofflaw List https://data.cityofchicago.org/Buildings/Building-Code-Scofflaw-List-Map/hgat-td
     - Building Violations https://data.cityofchicago.org/Buildings/Building-Violations/22u3-xenr
     - Crime https://data.cityofchicago.org/Public-Safety/Crimes-Map/dfnk-7re6
     - Crimes by Neighborhood https://data.cityofchicago.org/Public-Safety/Crimes-by-Neighborhood/awnt-66py

Nursing Home Compare: https://data.medicare.gov/data/nursing-home-compare
Nursing Home Reviewing Methodology: http://www.cms.gov/Medicare/Provider-Enrollment-and-Certification/CertificationandComplianc/Downloads/usersguide.pdf


-----------------------------------------------

Here’s the PDFs with the special data we need:
http://www2.illinois.gov/hfs/MedicalProvider/CostReports/Pages/default.aspx

Go to “Staffing and Salary Costs”
Then find.. “Registered nurses” row’s number of hours actually worked
divide that by total patient days

And we also need the Facility Name from the PDFs

--------------------------------------------------

Various other links:

