class Person {
  // Private field declarations
  #firstname;
  #lastname;

  // Initializes instance variables
  constructor(firstname, lastname) {
    this.#firstname = firstname;
    this.#lastname = lastname;
  }

  // Getter for first name
  get firstname() {
    return this.#firstname;
  }

  // Setter for first name
  set firstname(firstname) {
    this.#firstname = firstname;
  }

  // Getter for last name
  get lastname() {
    return this.#lastname;
  }

  // Setter for last name
  set lastname(lastname) {
    this.#lastname = lastname;
  }
}

/* CONSTRUCTOR — Handles object initialization. Binds incoming parameters 
   securely to the class's private internal fields upon instantiation. 
   FIRSTNAME SETTER — Acts as a data gateway. Provides a secure location 
   to intercept and validate input before updating the first name property. 
   LASTNAME SETTER — Manages data mutation independently. Ensures strict 
   encapsulation rules are maintained specifically for the last name property.
*/
