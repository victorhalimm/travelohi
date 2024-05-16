import React from "react";

interface Param {
    text : string
}

const PageHeader : React.FC<Param> = ({text}) => {
    return (
        <div className="text-xl text-bold">
            {text}
        </div>
    )
}

export default PageHeader;