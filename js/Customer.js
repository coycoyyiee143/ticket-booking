// Customer Class (Extends User)
class Customer extends User {
    constructor(username, password) {
        super(username, password, "customer");
    }

    // Book an event
    bookEvent(eventId, seatIndex) {
        try {
            const events = JSON.parse(localStorage.getItem("events")) || [];
            let event = null;

            // Loop through events to find the correct event by ID
            for (let i = 0; i < events.length; i++) {
                if (events[i].id === eventId) {
                    event = events[i];
                    break; // Stop looping once we find the event
                }
            }

            if (!event) throw new Error("Event not found.");
            if (event.seatMap[seatIndex] !== "available") throw new Error("Seat is already booked.");

            // Book the seat
            event.seatMap[seatIndex] = "booked";
            event.availableSeats--;
            localStorage.setItem("events", JSON.stringify(events));

            // Save the booking
            const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
            const newBooking = {
                id: Date.now(),
                eventId,
                seatIndex,
                username: this.username,
                status: "unpaid",
            };

            // Validate booking data manually
            if (!newBooking.id || !newBooking.eventId || newBooking.seatIndex === undefined || !newBooking.username || !newBooking.status) {
                throw new Error("Invalid booking data.");
            }

            bookings.push(newBooking);
            localStorage.setItem("bookings", JSON.stringify(bookings));
        } catch (error) {
            console.error("Error booking event:", error.message);
        }
    }
}
