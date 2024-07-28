function buildName2(firstName: string, lastName?: string) {
  if (lastName) {
    return firstName + " " + lastName;
  } else {
    return firstName;
  }
}
let rs = buildName2("Bob"); // works correctly now
// let rs2 = buildName2("Bob", "Adams", "Sr.");  // error, too many parameters
let rs3 = buildName2("Bob", "Adams"); // ah, just right
