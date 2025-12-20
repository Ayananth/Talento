import React from 'react'
import { Button, TextInput, Select } from "flowbite-react";
import { Search, MapPin } from "lucide-react";
import { useNavigate } from 'react-router-dom';


import { popularCitiesInIndia } from "@/utils/common/utils";

const SearchBox = () => {
  const navigate = useNavigate();
  return (
    <div>
          <div className="mt-10 bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

              {/* KEYWORD */}
              <TextInput
                icon={Search}
                placeholder="Job title or keyword"
                sizing="lg"
                
              />

              {/* LOCATION */}
              <Select icon={MapPin} sizing="lg">


                {
                    popularCitiesInIndia.map((city)=>{
                        return  <option key={city} value="">{city}</option>

                    })
                }


{/* 
                <option value="">Location</option>
                <option value="remote">Remote</option>
                <option value="kochi">Kochi</option>
                <option value="bangalore">Bangalore</option>
                <option value="hyderabad">Hyderabad</option> */}





              </Select>

              {/* SEARCH BUTTON */}
              <Button
              onClick={()=> navigate('/jobsearch')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Search Jobs
              </Button>
            </div>
          </div>
      
    </div>
  )
}

export default SearchBox
