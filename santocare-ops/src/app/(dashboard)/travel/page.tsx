"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plane, Hotel, Stethoscope, CheckSquare, Ban, Clock, MapPin, User,
  ArrowRight, CalendarDays, Luggage, Syringe, Car, FileText, Loader2,
} from "lucide-react";
import { fetchWithAuth } from "@/lib/fetch-client";
import { formatDate } from "@/lib/utils";

const EVENT_ICONS: Record<string, React.ReactNode> = {
  FLIGHT: <Plane className="h-4 w-4" />,
  HOTEL: <Hotel className="h-4 w-4" />,
  PROCEDURE: <Syringe className="h-4 w-4" />,
  CONSULTATION: <Stethoscope className="h-4 w-4" />,
  DISCHARGE: <CheckSquare className="h-4 w-4" />,
  VISA: <FileText className="h-4 w-4" />,
  TRANSPORT: <Car className="h-4 w-4" />,
  OTHER: <CalendarDays className="h-4 w-4" />,
};

const STATUS_COLORS: Record<string, string> = {
  PLANNED: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const TYPE_LABELS: Record<string, string> = {
  FLIGHT: "Flight",
  HOTEL: "Hotel",
  PROCEDURE: "Procedure",
  CONSULTATION: "Consultation",
  DISCHARGE: "Discharge",
  VISA: "Visa",
  TRANSPORT: "Transport",
  OTHER: "Other",
};

interface EventItem {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  date: string;
  location?: string | null;
  notes?: string | null;
  status: string;
  order: number;
  partner?: { id: string; name: string; category: string } | null;
  itinerary: {
    patient: { id: string; name: string; referenceNumber: string };
  };
}

export default function TravelPage() {
  const [events, setEvents] = React.useState<EventItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [daysFilter, setDaysFilter] = React.useState(30);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchWithAuth(`/api/itinerary?days=${daysFilter}&limit=100`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to load");
        setEvents(json.data ?? []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [daysFilter]);

  const groupedByDate = events.reduce<Record<string, EventItem[]>>((acc, ev) => {
    const key = ev.date?.slice(0, 10) ?? "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <CalendarDays className="h-8 w-8 text-brand-600" /> Travel & Calendar
          </h1>
          <p className="text-muted-foreground mt-1">
            Upcoming itineraries, events, and travel plans for all patients
          </p>
        </div>
        <div className="flex items-center gap-2">
          {[7, 14, 30, 60, 90].map((d) => (
            <Button
              key={d}
              variant={daysFilter === d ? "default" : "outline"}
              size="sm"
              onClick={() => setDaysFilter(d)}
            >
              {d}d
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Plane className="h-5 w-5 text-blue-600" /> Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{events.length}</p>
            <p className="text-xs text-muted-foreground">in next {daysFilter} days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" /> Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {new Set(events.map((e) => e.itinerary.patient.id)).size}
            </p>
            <p className="text-xs text-muted-foreground">with upcoming travel</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-green-600" /> Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {events.filter((e) => e.status === "CONFIRMED").length}
            </p>
            <p className="text-xs text-muted-foreground">events confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" /> Planned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {events.filter((e) => e.status === "PLANNED").length}
            </p>
            <p className="text-xs text-muted-foreground">awaiting confirmation</p>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading events...</span>
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => setDaysFilter(daysFilter)}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading && !error && sortedDates.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No upcoming events</h3>
            <p className="text-muted-foreground mt-1">
              No travel events scheduled in the next {daysFilter} days.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && sortedDates.length > 0 && (
        <div className="space-y-6">
          {sortedDates.map((dateKey) => (
            <div key={dateKey}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 bg-brand-50 text-brand-700 px-3 py-1.5 rounded-lg font-medium text-sm">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(dateKey)}
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="space-y-2 ml-2">
                {groupedByDate[dateKey].map((event) => (
                  <Card key={event.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${
                          event.status === "COMPLETED" ? "bg-green-50" :
                          event.status === "CANCELLED" ? "bg-red-50" :
                          event.status === "CONFIRMED" ? "bg-amber-50" :
                          "bg-blue-50"
                        }`}>
                          {EVENT_ICONS[event.type] ?? <CalendarDays className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{event.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {TYPE_LABELS[event.type] ?? event.type}
                            </Badge>
                            <Badge className={`text-xs ${STATUS_COLORS[event.status] ?? "bg-gray-100 text-gray-800"}`}>
                              {event.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {event.itinerary.patient.name}
                              <span className="text-muted-foreground/60">
                                ({event.itinerary.patient.referenceNumber})
                              </span>
                            </span>
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </span>
                            )}
                            {event.partner && (
                              <span className="flex items-center gap-1">
                                <Building2Icon className="h-3 w-3" />
                                {event.partner.name}
                              </span>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Building2Icon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 21h18" />
      <path d="M9 21V3h6v18" />
      <path d="M9 7h6" />
      <path d="M9 11h6" />
      <path d="M9 15h6" />
    </svg>
  );
}
