/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var swiftgif = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        // The image element that is being updated/cloned.
        this.updateId = 0;
        this.nextFrameId = 1;
        this.currentFrameId = -1;
        this.frames = [];
    },
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
        document.getElementById("captureButton").addEventListener("click", function() {
            swiftgif.onCaptureMedia(false);
        }, false);
        document.getElementById("recaptureButton").addEventListener("click", function() {
            swiftgif.onCaptureMedia(true);
        }, false);
        document.getElementById("addButton").addEventListener("click", this.framesPanel.add, false);
        document.getElementById("updateButton").addEventListener("click", this.framesPanel.update, false);
        document.getElementById("cancelButton").addEventListener("click", this.resetPage, false);
        document.getElementById("clearAllButton").addEventListener("click", this.framesPanel.clearAll, false);
        document.getElementById("cloneButton").addEventListener("click", this.framesPanel.clone, false);
    },
    onDeviceReady: function() {
    },
    addFrame: function(image) {
        this.frames.push(new Frame(++this.currentFrameId, image));
        this.nextFrameId++;
    },
    updateFrame: function(frameId, image) {
        var oldFrame = this.getFrameById(frameId);
        if (oldFrame === null)
            return;
        
        this.frames[this.getFrameIndex(frameId)] = new Frame(oldFrame.frameId, image);
    },
    getFrameById: function(frameId) {
        for (var index = 0; index < this.frames.length; index++) {
            if (this.frames[index].getFrameId() === frameId)
                return this.frames[index];
        }
        
        return null;
    },
    getFrameIndex: function(frameId) {
        for (var index = 0; index < this.frames.length; index++) {
            if (this.frames[index].getFrameId() === frameId)
                return index;
        }
        
        return -1;
    },      
    // Invoked when a user attempts to take a picture/capture a video.
    onCaptureMedia: function(recapture) {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            // Aspect ratios don't guarantee these values.
            targetWidth: 700,
            targetHeight: 900,
            correctOrientation: true,
            saveToPhotoAlbum: false
        };
        
        var successCallback = recapture ? this.onRecaptureSuccess : this.onCaptureSuccess;
        navigator.camera.getPicture(successCallback, this.onCameraFailure, options);
    },
    onCaptureSuccess: function(imageURI) {
        var image = new Image(),
            addButton = document.getElementById("addButton");
        
        // Use the stored image file for the JS Image object.
        image.src = imageURI;
        image.onload = function() {
            swiftgif.addFrame(image);
            swiftgif.addToPreviewer(image);
            addButton.className = "green";
            captureButton.className = "hide";
            cancelButton.className = "red";
        };
    },
    onRecaptureSuccess: function(imageURI) {
        var image = new Image(),
            updateButton = document.getElementById("updateButton"),
            recaptureButton = document.getElementById("recaptureButton"),
            cloneButton = document.getElementById("cloneButton");
        
        // Use the stored image file for the JS Image object.
        image.src = imageURI;
        image.onload = function() {
            swiftgif.addFrame(image);
            swiftgif.addToPreviewer(image);
            cloneButton.className = "hide";
            updateButton.className = "green";
            recaptureButton.className = "hide";
        };
    },
    onCameraFailure: function(errorMessage) {
        if (errorMessage === "Camera cancelled.")
            return;
            
        alert(errorMessage);
    },
    addToPreviewer: function(image) {
        var imagePreview = document.getElementById("imagePreview");
            
        // Resize the previewing box to take into account the image sizes
        // since they are never at a specific width/height on different devices.
        imagePreview.style.height = image.height + "px";
        imagePreview.style.width = image.width + "px";

        // Replace or add image to previewer!
        if (imagePreview.hasChildNodes()) {
            imagePreview.replaceChild(image, imagePreview.firstChild);
        } else {
            imagePreview.appendChild(image);
        }
    },
    // Returns the UI to its default state.
    resetPage: function() {
        var imagePreview = document.getElementById("imagePreview"),
            captureButton = document.getElementById("captureButton"),
            cancelButton = document.getElementById("cancelButton"),
            addButton = document.getElementById("addButton"),
            recaptureButton = document.getElementById("recaptureButton"),
            updateButton = document.getElementById("updateButton"),
            cloneButton = document.getElementById("cloneButton");
            
        imagePreview.removeChild(imagePreview.firstChild);
        captureButton.className = "green";
        addButton.className = "hide";
        cancelButton.className = "hide";
        recaptureButton.className = "hide";
        updateButton.className = "hide";
        cloneButton.className = "hide";
        if (this.updateId !== 0) {
            this.updateId = 0;
            // Pop the temporary frame off the list.
            this.frames.pop();
        }
    },
    framesPanel: {
        add: function() {
            var framesList = document.getElementById("framesList"),
                frameImageElement = document.createElement("img"),
                frame = swiftgif.getFrameById(swiftgif.currentFrameId);

            frameImageElement.src = frame.getImage().src;
            // Resize it into a thumbnail.
            frameImageElement.height = 100;
            frameImageElement.width = 100;
            frameImageElement.id = "frameImage" + frame.getFrameId();
            
            frameImageElement.addEventListener("click", function() {
                // Use the original framed image.
                var previewImage = new Image();
                previewImage.src = frameImageElement.src;
                previewImage.onload = function() {
                    var captureButton = document.getElementById("captureButton")
                        recaptureButton = document.getElementById("recaptureButton"),
                        cancelButton = document.getElementById("cancelButton"),
                        cloneButton = document.getElementById("cloneButton");
                        
                    swiftgif.addToPreviewer(previewImage);
                    swiftgif.updateId = frame.getFrameId();
                    captureButton.className = "hide";
                    recaptureButton.className = "green";
                    cloneButton.className = "blue";
                    cancelButton.className = "red";
                };
            }, false);
            
            // Add to the list of frames.
            framesList.appendChild(frameImageElement);
            
            alert("Successfully added image to list of GIF frames!");
            swiftgif.resetPage();
        },
        clone: function() {
            var frameToClone = swiftgif.getFrameById(swiftgif.updateId);
            swiftgif.addFrame(frameToClone.getImage());
            swiftgif.framesPanel.add();
        },
        update: function() {
            var originalFrameElement = document.getElementById("frameImage" + swiftgif.updateId),
                updatedFrame = swiftgif.getFrameById(swiftgif.currentFrameId);
            
            swiftgif.updateFrame(swiftgif.updateId, updatedFrame.getImage());
            originalFrameElement.src = updatedFrame.getImage().src;
            // Resize it into a thumbnail.
            originalFrameElement.height = 100;
            originalFrameElement.width = 100;
            
            alert("Successfully updated frame!");
            swiftgif.resetPage();
        },
        clearAll: function() {
            var doDelete = confirm("Are you sure you want to remove all frames?"),
                framesList = document.getElementById("framesList");
            
            if (doDelete) {
                var element = framesList.firstElementChild;
                element = element.nextElementSibling;
                while (element) {
                    var nextElement = element.nextElementSibling;
                    framesList.removeChild(element);
                    element = nextElement;
                }
                
                swiftgif.updateId = 0;
                swiftgif.nextFrameId = 1;
                swiftgif.currentFrameId = -1;
                swiftgif.frames = [];
            }
            
            swiftgif.resetPage();
        }
    }
};
