import React from 'react';

const PrimaryButton = ({ 
  title, 
  onClick, 
  icon: Icon, 
  iconPosition = "right", 
  className = "", 
  type = "button" 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        /* Base Styles */
        bg-[#00d094] text-[#002147] font-semibold rounded-xl
        transition-all duration-300 ease-in-out
        flex items-center justify-center gap-2 
        
       
        px-6 py-3 text-sm 
        md:px-8 md:py-4 md:text-base
        lg:px-10 lg:py-3
        
      
        hover:bg-[#00b371] hover:shadow-lg active:scale-95
        
        /* Custom classes */
        ${className}
      `}
    >
      {/* Agar icon left par chahiye */}
      {Icon && iconPosition === "left" && <Icon className="text-xl" />}
      
      <span>{title}</span>
      
      {/* Agar icon right par chahiye (Default) */}
      {Icon && iconPosition === "right" && <Icon className="text-xl" />}
    </button>
  );
};

export default PrimaryButton;