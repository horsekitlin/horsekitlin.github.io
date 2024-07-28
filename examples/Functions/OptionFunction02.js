function buildName2(firstName, lastName) {
    if (lastName) {
        return firstName + " " + lastName;
    }
    else {
        return firstName;
    }
}
var rs = buildName2("Bob"); // works correctly now
// let rs2 = buildName2("Bob", "Adams", "Sr.");  // error, too many parameters
var rs3 = buildName2("Bob", "Adams"); // ah, just right
