function buildName4(firstName: string, ...restOfName: string[]) {
  console.log(`firstName: ${firstName}`);
  console.log(`restOfName: ${restOfName}`);
  return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName4("Joseph", "Samuel", "Lucas", "MacKinzie");
