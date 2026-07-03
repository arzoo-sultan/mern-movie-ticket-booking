import { inngest } from "../client.js"; 
import User from "../../models/user.model.js";

const syncUserUpdation = inngest.createFunction(
    { 
        id: 'update-user-from-clerk',
        triggers: { event: 'clerk/user.updated' } // Combined into the first object
    }, 
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`, 
            image: image_url
        };
        
        await User.findByIdAndUpdate(id, userData);
    }
);

export default syncUserUpdation;