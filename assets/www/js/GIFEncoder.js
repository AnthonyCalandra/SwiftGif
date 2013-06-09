function GIFEncoder() {
    this.byteArray = [];
}

GIFEncoder.prototype = {
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
        this.writeUnsignedByte(val >> 8);
        this.writeUnsignedByte(val);
    }
};