//button
const calcBtn = document.querySelector("#calc-btn");
//inputs and error messages
const dayInput = document.querySelector("#day");
const dayMessage = document.querySelector("#day-message");
const monthInput = document.querySelector("#month");
const monthMessage = document.querySelector("#month-message");
const yearInput = document.querySelector("#year");
const yearMessage = document.querySelector("#year-message");
//input labels
const dayLabel = document.querySelector("#day-label");
const monthLabel = document.querySelector("#month-label");
const yearLabel = document.querySelector("#year-label");
//outputs
const yearsDisplay = document.querySelector("#year-answer");
const monthDisplay = document.querySelector("#month-answer");
const dayDisplay = document.querySelector("#day-answer");

const checkInput = (inputValue, type, max) => {
    if (!inputValue) {
        return "This field is required";
    }

    if (type === "year" && inputValue > max) {
        return "Must be in the past";
    }

    if (inputValue < 1 || inputValue > max) {
        return "Must be a valid " + type;
    }

    return "";
}

const getMonthLength = (month) => {
    switch (month) {
        case 2:
            return 28;

        case 4:
        case 6:
        case 9:
        case 11:
            return 30;

        default:
            return 31;
    }
}

const calculateAge = () => {

    //get current date
    const currentDate = new Date();

    //get input values as numbers
    const day = parseInt(dayInput.value);
    const month = parseInt(monthInput.value) - 1;
    const year = parseInt(yearInput.value);

    //basic check (not empty and less than max)
    let daymsg = checkInput(day, "day", 31);
    let monthmsg = checkInput(month, "month", 12);
    let yearmsg = checkInput(year, "year", currentDate.getFullYear());

    //get date
    const birthDate = new Date(year, month, day);

    //make sure valid date (didn't enter an invalid day for the month) April 31 would be set as May 1, so make sure day & month match
    if (day !== birthDate.getDate() || month !== birthDate.getMonth()) {
        //will set message on day, but add error to all 3 fields
        daymsg = "Must be a valid date";
        monthInput.classList.add("red-border");
        monthLabel.classList.add("red");
        yearInput.classList.add("red-border");
        yearLabel.classList.add("red");
    }

    //make sure date is in past
    if (birthDate > currentDate) {
        yearmsg = "Must be in the past";
    }

    //set any error messages
    dayMessage.innerText = daymsg;
    monthMessage.innerText = monthmsg;
    yearMessage.innerText = yearmsg;

    //if any errors, set error class on inputs & labels and return
    if (daymsg || monthmsg || yearmsg) {
        if (daymsg) {
            dayInput.classList.add("red-border");
            dayLabel.classList.add("red");
        }

        if (monthmsg) {
            monthInput.classList.add("red-border");
            monthLabel.classList.add("red");
        }

        if (yearmsg) {
            yearInput.classList.add("red-border");
            yearLabel.classList.add("red");
        }
        return;
    }

    //no errors, reset classes if needed
    dayInput.classList.remove("red-border");
    dayLabel.classList.remove("red");
    monthInput.classList.remove("red-border");
    monthLabel.classList.remove("red");
    yearInput.classList.remove("red-border");
    yearLabel.classList.remove("red");

    //find most recent birthday
    const currentYear = currentDate.getFullYear();
    let lastBirthday = new Date(currentYear, month, day);
    if (lastBirthday > currentDate) {
        //last birthday was prior year
        lastBirthday.setFullYear(currentYear - 1);
    }


    //years, count from most recent birthday
    let numYears = lastBirthday.getFullYear() - birthDate.getFullYear();
    yearsDisplay.innerText = numYears;

    //months
    let numMonths = 0;
    if (currentDate.getMonth() === birthDate.getMonth()) {
        //birthday is in current month
        if (birthDate.getDate() > currentDate.getDate()) {
            numMonths = 11;
        } else {
            numMonths = 0;
        }
    }
    else {
        //increment by month from last birthday to count months
        while (lastBirthday < currentDate) {
            const mon = lastBirthday.getMonth();
            if (mon === 11) {
                //hit dec, reset to jan this year
                lastBirthday.setMonth(0);
                lastBirthday.setFullYear(currentYear);

            } else {
                lastBirthday.setMonth(mon + 1);
            }
            numMonths++;
        }
        numMonths--;
    }
    monthDisplay.innerText = numMonths;

    //days 
    let numDays = 0;
    if (currentDate.getDate() !== birthDate.getDate()) {
        if (currentDate.getDate() > birthDate.getDate()) {
            //current date is after birthday, so get number of days since previous month
            numDays = currentDate.getDate() - birthDate.getDate();
        } else {
            //otherwise, get number of days remaining in last month plus days so far this month
            numDays = (getMonthLength(lastBirthday.getMonth()) - birthDate.getDate()) + currentDate.getDate();
        }
    }
    dayDisplay.innerText = numDays;


}

calcBtn.addEventListener("click", calculateAge);

