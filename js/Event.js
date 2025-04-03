class Event {
    #id;
    #name;
    #date;
    #time;
    #seatCount;
    #availableSeats;
    #pricePerSeat;
    #venue;
    #poster;

    constructor(id, name, date, time, seatCount, pricePerSeat, venue, poster) {
        this.#id = id;
        this.#name = name;
        this.#date = date;
        this.#time = time;
        this.#seatCount = seatCount;
        this.#availableSeats = seatCount;
        this.#pricePerSeat = pricePerSeat;
        this.#venue = venue;
        this.#poster = poster;
        this.seatMap = Array(seatCount).fill("available"); // Initialize all seats as available
    }

    // Getter and Setter methods for private fields (as previously defined)
    get id() {
        return this.#id;
    }

    set id(value) {
        throw new Error("ID cannot be changed directly.");
    }

    get name() {
        return this.#name;
    }

    set name(value) {
        if (value.trim() === "") {
            throw new Error("Name cannot be empty.");
        }
        this.#name = value;
    }

    get date() {
        return this.#date;
    }

    set date(value) {
        this.#date = value;
    }

    get time() {
        return this.#time;
    }

    set time(value) {
        this.#time = value;
    }

    get seatCount() {
        return this.#seatCount;
    }

    set seatCount(value) {
        if (value < 0) {
            throw new Error("Seat count cannot be negative.");
        }
        this.#seatCount = value;
        this.#availableSeats = value;  // Update availableSeats if seatCount is modified
    }

    get availableSeats() {
        return this.#availableSeats;
    }

    set availableSeats(value) {
        if (value < 0 || value > this.#seatCount) {
            throw new Error("Available seats must be between 0 and seatCount.");
        }
        this.#availableSeats = value;
    }

    get pricePerSeat() {
        return this.#pricePerSeat;
    }

    set pricePerSeat(value) {
        if (value <= 0) {
            throw new Error("Price per seat must be a positive value.");
        }
        this.#pricePerSeat = value;
    }

    get venue() {
        return this.#venue;
    }

    set venue(value) {
        this.#venue = value;
    }

    get poster() {
        return this.#poster;
    }

    set poster(value) {
        this.#poster = value;
    }

      // Static method to load events from localStorage
      static loadEvents() {
        const events = JSON.parse(localStorage.getItem("events")) || [];
        const eventInstances = [];

        // Loop through the events array to manually create Event instances
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const eventInstance = new Event(
                event.id,
                event.name,
                event.date,
                event.time,
                event.seatCount,
                event.pricePerSeat,
                event.venue,
                event.poster
            );
            eventInstances.push(eventInstance); // Add the new Event instance to the array
        }

        return eventInstances;
    }

    // Static method to save events to localStorage
    static saveEvents(events) {
        localStorage.setItem("events", JSON.stringify(events));
    }

    // Static method to add a new event
    static addEvent(name, date, time, seatCount, pricePerSeat, venue, poster) {
        const events = Event.loadEvents();
        const newEvent = new Event(Date.now(), name, date, time, seatCount, pricePerSeat, venue, poster);
        events.push(newEvent);
        Event.saveEvents(events);
    }

    // Static method to delete an event
    static deleteEvent(eventId) {
        let events = Event.loadEvents();
        const updatedEvents = [];

        // Loop through the events and add events that do not match the eventId to updatedEvents
        for (let i = 0; i < events.length; i++) {
            if (events[i].id !== eventId) {
                updatedEvents.push(events[i]);
            }
        }

        // Save the updated events back to localStorage
        Event.saveEvents(updatedEvents);
    }


    // Static method to find an event by ID
    static findEventById(eventId) {
        const events = Event.loadEvents();
        
        // Loop through the events to find the matching event by ID
        for (let i = 0; i < events.length; i++) {
            if (events[i].id === eventId) {
                return events[i];  // Return the event if it matches the ID
            }
        }

        // Return null if no matching event is found
        return null;
    }


    // Convert the Event object to a plain object for JSON serialization
    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            date: this.#date,
            time: this.#time,
            seatCount: this.#seatCount,
            availableSeats: this.#availableSeats,
            pricePerSeat: this.#pricePerSeat,
            venue: this.#venue,
            poster: this.#poster,
            seatMap: this.seatMap
        };
    }

    // Create an Event instance from a plain object
    static fromJSON(json) {
        return new Event(
            json.id,
            json.name,
            json.date,
            json.time,
            json.seatCount,
            json.pricePerSeat,
            json.venue,
            json.poster
        );
    }
}
