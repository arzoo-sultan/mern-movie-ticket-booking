import { inngest } from "../client.js"; 
import User from "../../models/user.model.js";

const syncUserCreation = inngest.createFunction(
    { 
        id: 'sync-user-from-clerk',
        triggers: { event: 'clerk/user.created' } // Combined into the first object
    }, 
    async ({ event }) => { // The handler is now the 2nd argument
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`, 
            image: image_url
        };
        
        await User.create(userData);
    }
);

export default syncUserCreation;