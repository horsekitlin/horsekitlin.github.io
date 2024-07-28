function buildName3(firstName: string, lastName = "Smith") {
  return firstName + " " + lastName;
}

let res1 = buildName3("Bob"); // works correctly now, returns "Bob Smith"
let res2 = buildName3("Bob", undefined); // still works, also returns "Bob Smith"
// let res3 = buildName3("Bob", "Adams", "Sr.");  // error, too many parameters
let res4 = buildName3("Bob", "Adams"); // ah, just right
