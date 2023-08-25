import React from "react"

const ExternalService = () =>{
    return(
        <div className="iframe-container">
            <iframe
                title="External Service"
                src="https://script.google.com/macros/s/AKfycbz3jXyLG1jqvrWiK6fm6AGZ8aOGf2ZCpSccbORQfUd88o8xN08SRcUbvOZqpkLAueeb/exec?ES"
                className="iframe-content"
            />
        </div>
    )
}

export default ExternalService