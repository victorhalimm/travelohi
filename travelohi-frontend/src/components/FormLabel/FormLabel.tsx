import React from "react";

interface Param {
    text: string;
    size?: string;
}

const FormLabel: React.FC<Param> = ({ text, size }) => {
    // Determine the class based on the size prop
    const sizeClass = (() => {
        switch (size) {
            case "sm":
                return "text-sm";
            case "md":
                return "text-md";
            case "lg":
                return "text-lg";
            case "xl":
                return "text-xl";
            default:
                return "text-sm";
        }
    })();

    // Use the determined class in the component's className
    return (
        <div className={`${sizeClass} font-weight-600 text-gray-800`}>
            {text}
        </div>
    );
}

export default FormLabel;