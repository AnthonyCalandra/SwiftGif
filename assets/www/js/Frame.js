function Frame(frameId, image) {
    this.frameId = frameId;
    this.image = image;
}

Frame.prototype = {
    getFrameId: function() {
        return this.frameId;
    },
    getImage: function() {
        return this.image;
    }
};