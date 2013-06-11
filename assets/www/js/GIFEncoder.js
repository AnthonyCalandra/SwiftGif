function GIFEncoder(byteArray, canvasWidth, canvasHeight, delay) {
    this.byteArray = byteArray;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    // Delay time is set as one-hundredths of a second.
    this.delay = delay / 100;
}

GIFEncoder.prototype = {
    start: function() {
        this.byteArray.writeUTFBytes("GIF89a");
        this.writeLSD();
        this.writeGlobalColorTable();
        this.writeGraphicsControlExtension();
    },
    // Logical Screen Descriptor
    writeLSD: function() {
        // Canvas width and height.
        this.byteArray.writeUnsignedWord(this.canvasWidth);
        this.byteArray.writeUnsignedWord(this.canvasHeight);
        // Packed byte: Global color table set, 8 bits/pixel, no sort, 2^1 table size.
        this.byteArray.writeUnsignedByte(0x80 | 0x70 | 0);
        // Background color index.
        this.byteArray.writeUnsignedByte(0);
        // Pixel-aspect ratio.
        this.byteArray.writeUnsignedByte(0);
    },
    writeGlobalColorTable: function() {
        this.byteArray.writeRGBBytes(0, 0, 0);
        this.byteArray.writeRGBBytes(255, 255, 255);
    },
    writeGraphicsControlExtension: function() {
        // Indicates the GCE.
        this.writeUnsignedByte(0x21);
        this.writeUnsignedByte(0xF9);
        // Block size (always 0x04).
        this.writeUnsignedByte(0x04);
        // Packed byte: reserved, no disposal, no user input, no transparency. 
        this.writeUnsignedByte(0);
        // Delay time.
        this.writeUnsignedWord(this.delay);
        // Transparent color.
        this.writeUnsignedByte(0xFFFF);
        this.writeUnsignedByte(0);
    },
    addFrame: function(canvas) {
        //this.writeImageDescriptor();
    },
    writeImageDescriptor: function(imageWidth, imageHeight) {
        // Image seperator.
        this.writeUnsignedByte(0x2C);
        // Image starts at (0,0) on GIF canvas.
        this.writeUnsignedWord(0);
        this.writeUnsignedWord(0);
        // Image width and height.
        this.writeUnsignedWord(imageWidth);
        this.writeUnsignedWord(imageHeight);
        // Packed byte: local color table, interlace(?), no sort, reserved,
        // table is 2^8, in size.
        this.writeUnsignedByte(0x80 | 0x7);
    },
    localColorTable: function() {
        
    }
};