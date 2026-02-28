import React from "react";
import { Calendar, Video, MapPin, ExternalLink } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  isOnline: boolean;
  location: string;
  meetingLink?: string;
  color: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Daily Standup",
    startTime: "09:00",
    endTime: "09:15",
    isOnline: true,
    location: "Microsoft Teams",
    meetingLink: "https://teams.microsoft.com",
    color: "hsl(var(--primary))",
  },
  {
    id: "2",
    title: "Product Review",
    startTime: "10:30",
    endTime: "11:30",
    isOnline: true,
    location: "Google Meet",
    meetingLink: "https://meet.google.com",
    color: "#10B981",
  },
  {
    id: "3",
    title: "Mittagspause",
    startTime: "12:00",
    endTime: "13:00",
    isOnline: false,
    location: "Kantine, 2. OG",
    color: "#F59E0B",
  },
  {
    id: "4",
    title: "Kundentermin Acme Corp",
    startTime: "14:00",
    endTime: "15:30",
    isOnline: false,
    location: "Raum Berlin, 3. OG",
    color: "#8B5CF6",
  },
  {
    id: "5",
    title: "Sprint Planning",
    startTime: "16:00",
    endTime: "17:00",
    isOnline: true,
    location: "Microsoft Teams",
    meetingLink: "https://teams.microsoft.com",
    color: "#EF4444",
  },
];

const CalendarPreview = () => {
  const now = new Date();
  const dayNames = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  const dateString = `${dayNames[now.getDay()]}, ${now.getDate()}. ${monthNames[now.getMonth()]}`;

  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-white/70" />
        <h3 className="text-sm font-semibold text-white">{dateString}</h3>
      </div>

      <div className="space-y-2">
        {mockEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors px-3 py-2.5"
          >
            {/* Time */}
            <div className="flex-shrink-0 w-[52px] text-right">
              <span className="text-xs font-medium text-white/60">{event.startTime}</span>
            </div>

            {/* Color bar */}
            <div
              className="w-[3px] rounded-full self-stretch flex-shrink-0"
              style={{ backgroundColor: event.color }}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{event.title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {event.isOnline ? (
                  <>
                    <Video className="w-3 h-3 text-white/50" />
                    {event.meetingLink ? (
                      <a
                        href={event.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-white/50 hover:text-white/80 flex items-center gap-1 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {event.location}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-white/50">Online</span>
                    )}
                  </>
                ) : (
                  <>
                    <MapPin className="w-3 h-3 text-white/50" />
                    <span className="text-xs text-white/50">{event.location}</span>
                  </>
                )}
              </div>
            </div>

            {/* Duration */}
            <span className="text-[10px] text-white/40 flex-shrink-0 mt-0.5">
              {event.startTime} – {event.endTime}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarPreview;
