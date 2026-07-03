import { inngest } from "../client.js"; 
import User from "../../models/user.model.js";

const syncUserDeletion = inngest.createFunction(
    { 
        id: 'delete-user-with-clerk',
        triggers: { event: 'clerk/user.deleted' } // Combined into the first object
    }, 
    async ({ event }) => {
        const { id } = event.data;
        await User.findByIdAndDelete(id);
    }
);

export default syncUserDeletion;