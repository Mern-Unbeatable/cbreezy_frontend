import { Loader2 } from "lucide-react";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8 transition-all duration-500 ease-in-out">
  
      <div className="relative flex flex-col items-center">
        
        
        <div className="relative">
          
          <Loader2 className="w-12 h-12 text-[#f3f4f6] animate-none absolute" />
          
         
          <Loader2 className="w-12 h-12 text-[#ec8d47] animate-spin relative z-10" />
        </div>

       
      
        <div className="mt-4 flex flex-col items-center">
          <p className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent animate-pulse">
            {message}
          </p>
        </div>

      
      </div>
    </div>
  );
}