//const database = firebase.database();
Module.register("MMM-TodoList", {
    todo: [],

    // Define module defaults
    defaults: {
        updateInterval: 300000, // Update interval in milliseconds (5 minute)
        email: "", // actual email of the user
		uid: "", //userid
        onlyShowUnchecked: true,
        maxItemsInList: 10,
        fade: true,
        fadePoint: 0.5,
        animationSpeed: 2000,
        textAlign: 'center'
    },

    // Define start sequence
    start: function () {
        // Schedule update timer
        this.scheduleUpdate();
    },

    // Define required scripts
    getScripts: function () {
        return ["moment.js"];
    },

     // Define method to fetch tasks from Firebase Firestore
     fetchTasks: function () {
        const { email, uid } = this.config; 

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, uid }), 
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched tasks:", data); 
                this.todo = data;
                console.log("Updating DOM with fetched tasks"); 
                this.updateDom();
            })
            .catch((error) => {
                console.error("Error fetching tasks:", error);
            });
    },

    // Override dom generator
    getDom: function () {
        // Create wrapper element
        var wrapper = document.createElement("div");
        // If tasks are available, display them
        if (this.todo.length > 0) {
            // Create unordered list element
            var ul = document.createElement("ul");

            // Loop through tasks and create list items
            this.todo.forEach((todo) => {
                // Create list item
                var li = document.createElement("li");

                // Format due date using Moment.js
                var dueDate = moment(todo.dueDate).format("MM D, YYYY");

                // Set list item text
                li.textContent = `${todo.data.title} (Due: ${dueDate})`;

                // Append list item to unordered list
                ul.appendChild(li);
            });

            // Append unordered list to wrapper
            wrapper.appendChild(ul);
        } else {
            // Display loading message if no todo available
            wrapper.innerHTML = "Register for classes - April 9 ,2024";
        }

        // Return the wrapper
        return wrapper;
    },

    // Define update schedule
    scheduleUpdate: function () {
        // Update tasks at the defined interval
        setInterval(() => {
            this.fetchTasks();
        }, this.config.updateInterval);
    },
});