// Base User Class
class User {
    #username; // Private field
    #password; // Private field
    #role;     // Private field

    constructor(username, password, role) {
        this.#username = username;
        this.#password = password;
        this.#role = role; // "admin" or "customer"
    }

    // Getter for username
    get username() {
        return this.#username;
    }

    // Setter for username
    set username(value) {
        if (!value) {
            throw new Error("Username cannot be empty.");
        }
        this.#username = value;
    }

    // Getter for password
    get password() {
        return this.#password;
    }

    // Setter for password
    set password(value) {
        if (!value) {
            throw new Error("Password cannot be empty.");
        }
        this.#password = value;
    }

    // Getter for role
    get role() {
        return this.#role;
    }

    // Setter for role
    set role(value) {
        if (value !== "admin" && value !== "customer") {
            throw new Error("Role must be either 'admin' or 'customer'.");
        }
        this.#role = value;
    }

    // Convert the user object to a plain object for JSON serialization
    toJSON() {
        return {
            username: this.#username,
            password: this.#password,
            role: this.#role,
        };
    }

    // Create a User instance from a plain object
    static fromJSON(json) {
        return new User(json.username, json.password, json.role);
    }

    // Static method to load users from localStorage
    static loadUsers() {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const loadedUsers = [];

        for (let i = 0; i < users.length; i++) {
            const userInstance = User.fromJSON(users[i]); // Convert plain object to User instance
            loadedUsers.push(userInstance);
        }

        return loadedUsers;
    }


    // Static method to save users to localStorage
    static saveUsers(users) {
        localStorage.setItem("users", JSON.stringify(users.map(user => user.toJSON())));
    }

    // Static method to register a new user
    static register(username, password, role) {
        // Validate input
        if (!username || !password || !role) {
            throw new Error("All fields are required.");
        }

        const users = User.loadUsers();

        // Check if the username already exists
        let usernameExists = false;
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username) {
                usernameExists = true;
                break; // Exit loop once the username is found
            }
        }

        if (usernameExists) {
            throw new Error("Username already exists. Please choose a different username.");
        }

        // Create a new user and save it
        const newUser = new User(username, password, role);
        users.push(newUser);
        User.saveUsers(users);
    }


    // Static method to log in a user
    static login(username, password) {
        const users = User.loadUsers();

        // Loop through the users to find the matching credentials
        let user = null;
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === username && users[i].password === password) {
                user = users[i];
                break; // Exit loop once the user is found
            }
        }

        if (!user) {
            throw new Error("Invalid username or password.");
        }

        // Save the logged-in user to localStorage
        localStorage.setItem("currentUser", JSON.stringify(user.toJSON()));

        // Return the user instance based on their role
        if (user.role === "admin") {
            return Object.assign(new Admin(), user);
        } else if (user.role === "customer") {
            return Object.assign(new Customer(), user);
        } else {
            throw new Error("Invalid user role.");
        }
    }


    static getCurrentUser() {
        const user = JSON.parse(localStorage.getItem("currentUser"));
        if (!user) return null;
    
        // Return the user instance based on their role
        if (user.role === "admin") {
            return new Admin(user.username, user.password);
        } else if (user.role === "customer") {
            return new Customer(user.username, user.password);
        } else {
            return null;
        }
    }

    // Static method to log out the current user
    static logout() {
        localStorage.removeItem("currentUser");
    }
}