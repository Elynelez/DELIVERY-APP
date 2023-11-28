import React from "react"
import { useAuth0 } from '@auth0/auth0-react';

const EnterProduct = () =>{
    const { user } = useAuth0();

    return(
        <div className="iframe-container" >
            <iframe
                title="enterProduct"
                overflow="hidden"
                allowtransparency="true"
                frameborder="0"
                src={"https://script.google.com/macros/s/AKfycbyj-SVZtbarkSUKNmk5JWroAv2clZxMnJ9-D09lmi0V8BYnjJHN8P_g11SU4d3Fl57g/exec/enter?user="+user}
                className="iframe-content"
            />
        </div>
    )
}

export default EnterProduct
