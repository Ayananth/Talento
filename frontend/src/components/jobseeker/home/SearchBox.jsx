import { Button, TextInput, Select } from "flowbite-react";
import { Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { popularCitiesInIndia } from "@/utils/common/utils";

const SearchBox = () => {
  const navigate = useNavigate();

  return (

<div className="mt-8">
  <Button
    size="xl"
    color="blue"
    className="px-10"
    onClick={() => navigate("/jobsearch")}
  >
    Explore Jobs
  </Button>
</div>




    // <div className="mt-12">
    //   <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-3xl p-6 md:p-8">
    //     <div className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center">

    //       {/* LOCATION (smaller but first) */}
    //       <div className="md:col-span-2">
    //         <Select
    //           icon={MapPin}
    //           sizing="lg"
    //           className="w-full"
    //         >
    //           <option value="">Location</option>
    //           {popularCitiesInIndia.map((city) => (
    //             <option key={city} value={city}>
    //               {city}
    //             </option>
    //           ))}
    //         </Select>
    //       </div>

    //       {/* KEYWORD (larger, main focus) */}
    //       <div className="md:col-span-4">
    //         <TextInput
    //           icon={Search}
    //           placeholder="Job title, skill, or company"
    //           sizing="lg"
    //           className="w-full"
    //         />
    //       </div>

    //       {/* SEARCH BUTTON */}
    //       <div className="md:col-span-2">
    //         <Button
    //           size="lg"
    //           className="w-full bg-blue-600 hover:bg-blue-700"
    //           onClick={() => navigate("/jobsearch")}
    //         >
    //           Search Jobs
    //         </Button>
    //       </div>

    //     </div>
    //   </div>
    // </div>
  );
};

export default SearchBox;
