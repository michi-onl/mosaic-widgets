class ImageCache {
  static cache = {};
  static timeout = 5; // 5 seconds for image loading

  static async load(url) {
    if (!url) return null;

    if (this.cache[url]) {
      return this.cache[url];
    }

    try {
      const request = new Request(url);
      request.timeoutInterval = this.timeout;
      const image = await request.loadImage();
      this.cache[url] = image;
      return image;
    } catch (error) {
      console.error(`Failed to load image: ${url}`);
      return null;
    }
  }
}

module.exports = { ImageCache };
