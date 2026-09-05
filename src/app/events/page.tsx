import { clubs, events as eventRows, isUpcomingEvent } from '@/lib/data/content';
import EventsClient from './EventsClient';
import { Box, Typography } from '@mui/material';

// Define the type for our joined data
export type EventWithClub = {
    name: string;
    description: string;
    image: string;
    location: string;
    date: string;
    timings: string;
    requirements: string;
    club: string;
    link: string;
    clubLogo: string;
};


function getEventsData(): EventWithClub[] {
    // Format the data to match the structure needed by the client component
    return eventRows.filter((item) => isUpcomingEvent(item)).map(item => {
        const eventDate = new Date(item.start_time);
        const club = clubs.find((entry) => entry.club_id === item.club_id);
        return {
            name: item.name,
            description: item.description,
            image: item.imageUrl ?? '/default-event-image.webp', // Fallback image
            location: item.location,
            date: eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            timings: eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            requirements: item.requirements,
            club: club?.name ?? 'Unknown Club', // Fallback club name
            link: item.link ?? '#', // Fallback link
            clubLogo: club?.iconUrl ?? '/default-club-logo.webp', // Fallback logo
        };
    });
}

export default function EventsPage() {
    const events = getEventsData();

    return (
        <Box sx={{ minHeight: '100vh', pt: { xs: 10, md: 12 }, px: { xs: 2, sm: 4 } }}>
            <Typography variant="h3" component="h1" fontWeight="bold" textAlign="center" gutterBottom sx={{ color: 'primary.main' }}>
                Upcoming Events
            </Typography>
            {events.length > 0 ? (
                <EventsClient events={events} />
            ) : (
                <Typography textAlign="center" mt={4}>No upcoming events found.</Typography>
            )}
        </Box>
    );
}
