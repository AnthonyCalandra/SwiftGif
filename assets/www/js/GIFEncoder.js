function GIFEncoder(byteArray, canvasWidth, canvasHeight) {
    this.byteArray = byteArray;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
}

GIFEncoder.prototype = {
    start: function() {
        this.byteArray.writeUTFBytes("GIF89a");
        this.writeLSD();
        this.writeGlobalColorTable();
    },
    // Logical Screen Descriptor
    writeLSD: function() {
        // Canvas width and height.
        this.byteArray.writeUnsignedWord(this.canvasWidth);
        this.byteArray.writeUnsignedWord(this.canvasHeight);
        // Packed byte: Global color table set, 8 bits/pixel, no sort, 2^8 table size.
        this.byteArray.writeUnsignedByte(0x80 | 0x70 | 0x7);
        // Background color index.
        this.byteArray.writeUnsignedByte(0);
        // Pixel-aspect ratio.
        this.byteArray.writeUnsignedByte(0);
    },
    writeGlobalColorTable: function() {
        
    }
};