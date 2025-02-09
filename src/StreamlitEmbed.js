import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const StreamlitEmbed = () => {
    const { user, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    
    if (!user) {
        return <div>Please log in to view this content.</div>;
    }
    
    const auth0Id = user.sub;
    console.log("auth0Id:", auth0Id);

    return (
        <iframe
            src={`http://localhost:8501/?auth0Id=${auth0Id}`}
            width="100%"
            height="800px"
            style={{ border: 'none' }}
            title="Streamlit App"
        />
    );
};

export default StreamlitEmbed;