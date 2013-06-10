function ByteArray() {
    this.byteArray = [];
}

ByteArray.prototype = {
    writeUnsignedByte: function(val) {
        // Write an unsigned byte.
        this.byteArray.push(val & 0xFF);
    },
    writeUTFBytes: function(val) {
        // Iterate through every character and store its ASCII value.
        for (var index = 0; index < val.length; index++)
            this.byteArray.push(val.charAt(index));
    },
    writeUnsignedWord: function(val) {
        // Store the unsigned word (16 bits) as 2 bytes each.
        this.writeUnsignedByte(val);
        this.writeUnsignedByte(val >> 8);
    },
    writeRGBBytes: function(r, g, b) {
        this.writeUnsignedByte(r);
        this.writeUnsignedByte(g);
        this.writeUnsignedByte(b);
        //this.byteArray.push(((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF));
    }    
};