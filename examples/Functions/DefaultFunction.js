function buildName3(firstName, lastName) {
    if (lastName === void 0) { lastName = "Smith"; }
    return firstName + " " + lastName;
}
var res1 = buildName3("Bob"); // works correctly now, returns "Bob Smith"
var res2 = buildName3("Bob", undefined); // still works, also returns "Bob Smith"
// let res3 = buildName3("Bob", "Adams", "Sr.");  // error, too many parameters
var res4 = buildName3("Bob", "Adams"); // ah, just right
