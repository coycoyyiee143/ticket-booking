class Booking {
    constructor(id, eventId, eventName, seatIndex, price, username, venue, status = "unpaid", poster = null) {
        this.id = id; // Unique booking ID
        this.eventId = eventId; // ID of the event
        this.eventName = eventName; // Name of the event
        this.seatIndex = seatIndex; // Seat index (0-based)
        this.price = price; // Price of the booking
        this.username = username; // Username of the customer
        this.venue = venue; // Venue of the event
        this.status = status; // Booking status: "unpaid", "paid", or "refund requested"
        this.poster = poster; // Poster image (optional, Base64 string)
    }

    static loadBookings() {
        const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    
        // Loop through and validate bookings
        const validBookings = [];
    
        for (let i = 0; i < bookings.length; i++) {
            const booking = bookings[i];
    
            // Check for required fields
            if (
                booking.id &&
                booking.eventId &&
                booking.eventName &&
                booking.seatIndex !== undefined && // Ensure seatIndex is not null or undefined
                booking.price !== undefined && // Ensure price is not null or undefined
                booking.username &&
                booking.venue
            ) {
                // If valid, create a Booking object and add to validBookings array
                validBookings.push(new Booking(...Object.values(booking)));
            } else {
                console.error("Invalid booking data at index", i, ":", booking);
            }
        }
    
        return validBookings;
    }

    static saveBookings(bookings) {
        localStorage.setItem("bookings", JSON.stringify(bookings));
    }

    static getNextId() {
        let lastId = parseInt(localStorage.getItem("lastBookingId")) || 0;
        const bookings = Booking.loadBookings();
        const maxExistingId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) : 0;
        const nextId = Math.max(lastId, maxExistingId) + 1;
        localStorage.setItem("lastBookingId", nextId);
        return nextId;
    }

    static addBooking(eventId, eventName, seatIndex, price, username, venue, poster) {
        const bookings = Booking.loadBookings();
        const newBooking = new Booking(
            Booking.getNextId(),
            eventId,
            eventName,
            seatIndex,
            price,
            username,
            venue,
            "unpaid",
            poster
        );
        bookings.push(newBooking);
        Booking.saveBookings(bookings);
    }

    static findBookingById(bookingId) {
        const bookings = Booking.loadBookings();
    
        // Loop through bookings and find the one with the matching ID
        for (let i = 0; i < bookings.length; i++) {
            if (bookings[i].id === bookingId) {
                return bookings[i]; // Return the booking if found
            }
        }
    
        return null; // Return null if no booking is found
    }
    
    static updateBookingStatus(bookingId, newStatus) {
        const bookings = Booking.loadBookings();
    
        // Loop through bookings and find the one with the matching ID
        for (let i = 0; i < bookings.length; i++) {
            const booking = bookings[i];
            if (booking.id === bookingId) {
                // Update the status
                booking.status = newStatus;
    
                // Save updated bookings back to localStorage
                Booking.saveBookings(bookings);
                return true; // Return true indicating the update was successful
            }
        }
    
        // If no booking was found
        console.error(`Booking with ID ${bookingId} not found.`);
        return false; // Return false if booking wasn't found
    }
    
    static getBookingsByUser(username) {
        if (!username) {
            console.error("Invalid username provided for fetching bookings.");
            return [];
        }
    
        const bookings = Booking.loadBookings();
        const userBookings = [];
    
        // Loop through bookings and add those that match the username
        for (let i = 0; i < bookings.length; i++) {
            if (bookings[i].username === username) {
                userBookings.push(bookings[i]);
            }
        }
    
        return userBookings;
    }    

    static deleteBooking(bookingId) {
        const bookings = Booking.loadBookings();
        const updatedBookings = [];
    
        // Loop through bookings and add only those that don't match the bookingId
        for (let i = 0; i < bookings.length; i++) {
            if (bookings[i].id !== bookingId) {
                updatedBookings.push(bookings[i]);
            }
        }
    
        // Save the updated bookings back to localStorage
        Booking.saveBookings(updatedBookings);
        return true;
    }
}