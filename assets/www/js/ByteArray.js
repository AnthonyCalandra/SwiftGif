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
            this.byteArray.push(val.charCodeAt(index));
    },
    writeUnsignedShort: function(val) {
        // Store the unsigned short (16 bits) as 2 bytes each.
        this.writeUnsignedByte(val);
        this.writeUnsignedByte(val >> 8);
    },
    writeUnsignedBytes: function(array, length) {
        var len = length || array.length;
        for (var i = 0; i < len; i++)
            this.writeUnsignedByte(array[i]);
    },
    writeRGBBytes: function(r, g, b) {
        // Take RGB and stash it into 24 bits.
        this.byteArray.push(((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF));
    },
    getData: function() {
        var chr = {},
            v = "";
    
	for (var i = 0; i < 256; i++)
            chr[i] = String.fromCharCode(i);
        
        for (var v = '', l = this.byteArray.length, j = 0; j < l; j++)
            v += chr[this.byteArray[j]];
      
        return v;
    }
};