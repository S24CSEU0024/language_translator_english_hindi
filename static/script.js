
// --------------------------------------------------
// Get HTML elements
// --------------------------------------------------

const englishText = document.getElementById("englishText");

const hindiText = document.getElementById("hindiText");

const translateBtn = document.getElementById("translateBtn");

const clearBtn = document.getElementById("clearBtn");

const copyBtn = document.getElementById("copyBtn");

const charCount = document.getElementById("charCount");

const statusMessage = document.getElementById("statusMessage");

const buttonText = document.getElementById("buttonText");

const loadingSpinner = document.getElementById("loadingSpinner");


// --------------------------------------------------
// Character counter
// --------------------------------------------------

englishText.addEventListener("input", function () {

    const length = englishText.value.length;

    charCount.textContent = `${length} / 500`;

});


// --------------------------------------------------
// Translate button
// --------------------------------------------------

translateBtn.addEventListener("click", async function () {

    const text = englishText.value.trim();


    // Check empty input

    if (!text) {

        statusMessage.textContent =
            "Please enter an English sentence.";

        return;

    }


    // Show loading state

    buttonText.textContent = "Translating...";

    loadingSpinner.classList.remove("hidden");

    translateBtn.disabled = true;

    statusMessage.textContent =
        "AI is generating your translation...";


    try {

        // Send request to Flask

        const response = await fetch("/translate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: text
            })

        });


        // Convert response into JSON

        const data = await response.json();


        // Display translation

        hindiText.textContent =
            data.translation;


        statusMessage.textContent =
            "Translation completed successfully!";


    }

    catch (error) {

        console.error(error);

        statusMessage.textContent =
            "Something went wrong. Please try again.";

    }


    finally {

        // Restore button

        buttonText.textContent = "Translate";

        loadingSpinner.classList.add("hidden");

        translateBtn.disabled = false;

    }

});


// --------------------------------------------------
// Clear button
// --------------------------------------------------

clearBtn.addEventListener("click", function () {

    englishText.value = "";

    hindiText.textContent =
        "Your Hindi translation will appear here...";

    charCount.textContent =
        "0 / 500";

    statusMessage.textContent = "";

});


// --------------------------------------------------
// Copy translation
// --------------------------------------------------

copyBtn.addEventListener("click", async function () {

    const translation =
        hindiText.textContent.trim();


    if (!translation ||
        translation === "Your Hindi translation will appear here...") {

        statusMessage.textContent =
            "There is no translation to copy.";

        return;

    }


    try {

        await navigator.clipboard.writeText(
            translation
        );

        statusMessage.textContent =
            "Translation copied! 📋";

    }

    catch (error) {

        statusMessage.textContent =
            "Unable to copy translation.";

    }

});
