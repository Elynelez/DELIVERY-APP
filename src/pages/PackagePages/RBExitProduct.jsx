import React from "react"
import { useAuth0 } from '@auth0/auth0-react';

const RBExitProduct = () =>{
    const { user } = useAuth0();

    return(
        <div className="iframe-container" >
            <iframe
                title="RBExitProduct"
                overflow="hidden"
                allowtransparency="true"
                frameborder="0"
                src={"https://script.google.com/macros/s/AKfycbw2qnpT92wXJf9liQBQVTILWo95maaZ7Y6S0VVYvlynt0UOVSw4loZZUebd9_UFX4bq/exec/cash?user="+user}
                className="iframe-content"
            />
        </div>
    )
}

export default RBExitProduct