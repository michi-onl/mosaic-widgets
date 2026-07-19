// Minimal stand-ins for the Scriptable globals Mosaic.js touches at module-load time
// (currently just Color, used while building CONFIG.colors). Extend this file if a
// future test needs to exercise rendering (Stack/ListWidget/SFSymbol/Font/etc.).
global.Color = class Color {
  constructor(hex) {
    this.hex = hex;
  }
  static dynamic(light) {
    return light;
  }
  static white() {
    return new Color("#FFFFFF");
  }
};
