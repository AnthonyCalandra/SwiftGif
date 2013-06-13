function GIFEncoder(byteArray, canvasWidth, canvasHeight, delay) {
    this.byteArray = byteArray;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    // Delay time is set as one-hundredths of a second.
    this.delay = Math.round(delay / 10);
    this.numFrames = 0;
}

GIFEncoder.prototype = {
    start: function() {
        // Header.
        this.byteArray.writeUTFBytes("GIF89a");
    },
    finish: function() {
        // Trailer.
        this.byteArray.writeUnsignedByte(0x3B);
    },
    // Logical Screen Descriptor
    writeLSD: function() {
        // Canvas width and height.
        this.byteArray.writeUnsignedShort(this.canvasWidth);
        this.byteArray.writeUnsignedShort(this.canvasHeight);
        // Packed byte: Global color table set, 8 bits/pixel, no sort, 2^8 table size.
        this.byteArray.writeUnsignedByte(0x80 | 0x70 | 7);
        // Background color index.
        this.byteArray.writeUnsignedByte(0);
        // Pixel-aspect ratio.
        this.byteArray.writeUnsignedByte(0);
    },
    writeGraphicsControlExtension: function() {
        // Indicates the GCE.
        this.byteArray.writeUnsignedByte(0x21);
        this.byteArray.writeUnsignedByte(0xF9);
        // Block size (always 0x04).
        this.byteArray.writeUnsignedByte(4);
        // Packed byte: reserved, no disposal, no user input, no transparency. 
        this.byteArray.writeUnsignedByte(0);
        // Delay time.
        this.byteArray.writeUnsignedShort(this.delay);
        // Transparent color.
        this.byteArray.writeUnsignedByte(0);
        this.byteArray.writeUnsignedByte(0);
    },
    addFrame: function(canvasContext) {
        var imageData = canvasContext.getImageData(0, 0, canvasContext.canvas.width, canvasContext.canvas.height),
            getImagePixels = (function() {
                // The pixel array returned from canvas context includes alpha.
                var rgbaPixels = imageData.data,
                    rgbPixels = [],
                    rgbPixelsIndex = 0;
                // Strip out the alpha values and store RGB values in a new array.
                for (var index = 0; index < rgbaPixels.length; index += 4) {
                    // Extract only the RGB values from the RGBA image data.
                    rgbPixels[rgbPixelsIndex++] = rgbaPixels[index];
                    rgbPixels[rgbPixelsIndex++] = rgbaPixels[index + 1];
                    rgbPixels[rgbPixelsIndex++] = rgbaPixels[index + 2];
                }

                return rgbPixels;
            })(),
            nq = new NeuQuant(getImagePixels, getImagePixels.length, 10),
            colorPalette = nq.process();

        // The first frame.
        if (this.numFrames == 0) {
            this.writeLSD();
            // Is actually global color table.
            this.setLocalColorTable(colorPalette);
            // Allows the GIF to repeat infinitely.
            this.writeNetscapeExtension();
        }

        // Split RGB array into individual pixels.
        var numPixels = getImagePixels.length / 3,
            k = 0,
            indexedPixels = [];
        for (var pixelIndex = 0; pixelIndex < numPixels; pixelIndex++) {
            // Store RGB values in quantizer.
            var index = nq.map(getImagePixels[k++] & 0xFF, 
                               getImagePixels[k++] & 0xFF, 
                               getImagePixels[k++] & 0xFF);
                               
            indexedPixels[pixelIndex] = index;
        }

        this.writeGraphicsControlExtension();
        this.writeLocalImageDescriptor();
        // Frames kther than the first use the local color table.
        if (this.numFrames > 0)
            this.setLocalColorTable(colorPalette);
        
        // Write the image data to the GIF.
        this.writeImageData(indexedPixels);
        this.numFrames++;
    },
    writeLocalImageDescriptor: function() {
        // Image seperator.
        this.byteArray.writeUnsignedByte(0x2C);
        // Image starts at (0,0) on GIF canvas.
        this.byteArray.writeUnsignedShort(0);
        this.byteArray.writeUnsignedShort(0);
        // Image width and height (by default is the size of canvas).
        this.byteArray.writeUnsignedShort(this.canvasWidth);
        this.byteArray.writeUnsignedShort(this.canvasHeight);
        
        // Local color table is set only for frames other tha the first. First
        // frame uses the global color table.
        if (this.numFrames > 0)
            // Packed byte: local color table, interlace(?), no sort, reserved,
            // table is 2^8, in size.
            this.byteArray.writeUnsignedByte(0x80 | 7);
        else
            this.byteArray.writeUnsignedByte(0);
    },
    setLocalColorTable: function(colorPalette) {
        // Write every color to the bytearray.
        this.byteArray.writeUnsignedBytes(colorPalette);
        
        // Each color table entry requires 3 bytes, so check how many
        // empty entries are left.
        var remainingTableSpace = (3 * 256) - colorPalette.length;
        if (remainingTableSpace > 0) {
            // Fill the rest of the table with black pixels.
            for (var index = 0; index < remainingTableSpace; index++)
                this.byteArray.writeUnsignedByte(0);
        }
    },
    writeImageData: function(indexedPixels) {
        // GIF writes image data using LZW compression.
        var lzw = new LZWEncoder(this.canvasWidth, this.canvasHeight, indexedPixels, 8);
        lzw.encode(this.byteArray);
    },
    writeNetscapeExtension: function() {
        // Application extension bytes.
        this.byteArray.writeUnsignedByte(0x21);
        this.byteArray.writeUnsignedByte(0xFF);
        this.byteArray.writeUnsignedByte(0x0B);
        // App id.
        this.byteArray.writeUTFBytes("NETSCAPE2.0");
        this.byteArray.writeUnsignedByte(3);
        this.byteArray.writeUnsignedByte(1);
        // Number of iterations to make (0 = forever).
        this.byteArray.writeUnsignedShort(0);
        this.byteArray.writeUnsignedByte(0);
    }
};