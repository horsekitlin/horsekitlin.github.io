class Control {
  private state: any;
}

class Control2 {
  private state: any;
}

interface SelectableControl extends Control {
  select(): void;
}

class Button extends Control implements SelectableControl {
  select() {}
}

class TextBox extends Control {}

//Error: property 'state' is missing in type Image

class NewImage implements SelectableControl {
  select() {}
}
const i = new NewImage();
// class Location {}
