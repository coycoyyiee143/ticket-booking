// Admin Class (Extends User)
class Admin extends User {
    constructor(username, password) {
        super(username, password, "admin");
    }

    // Add a new event
    addEvent(name, date, time, seatCount, pricePerSeat) {
        const events = JSON.parse(localStorage.getItem("events")) || [];
        const newEvent = {
            id: Date.now(),
            name,
            date,
            time,
            seatCount,
            availableSeats: seatCount,
            pricePerSeat,
            seatMap: Array(seatCount).fill("available"),
        };
        events.push(newEvent);
        localStorage.setItem("events", JSON.stringify(events));
    }

    // Edit an existing event
    editEvent(eventId, updatedData) {
        const events = JSON.parse(localStorage.getItem("events")) || [];
        const event = events.find(e => e.id === eventId);
        if (!event) throw new Error("Event not found.");
        Object.assign(event, updatedData);
        localStorage.setItem("events", JSON.stringify(events));
    }

    // Delete an event
    deleteEvent(eventId) {
        let events = JSON.parse(localStorage.getItem("events")) || [];
        events = events.filter(e => e.id !== eventId);
        localStorage.setItem("events", JSON.stringify(events));
    }
}