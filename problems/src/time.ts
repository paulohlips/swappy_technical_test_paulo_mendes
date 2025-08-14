/*
Problem : Format time from decimal to HH:MM format create some minutes shift. Fix it

Constraints: Obviouslly, no AI
*/

/*
 * Time in decimal. Ex: 03:30 = 3.5
 * Do not change the decimal use.
 * In real case, the value is stored as float in database
 */
class Time {
    // Time in decimal. Ex: 03:30 = 3.5
    declare value: number;

    constructor(value: number) {
        this.value = value;
    }

    formatMinutesToHHMM(): string {
        const h = Math.floor(this.value);
        const m = Math.floor((this.value - h) * 60);
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    }
}

let hasError = false;

for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute++) {
        const time = new Time(hour + minute / 60);
        const expectedResult = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const result = time.formatMinutesToHHMM();
        if (result !== expectedResult) {
            console.error(`Expected ${expectedResult}, but got ${result}`);
            hasError = true;
        }
    }
}

if (hasError) {
    console.error("Some cases failed");
    process.exit(1);
} else {
    console.log(`All good. Only ${0.1 + 0.2}% of the population found the bug`);
}
