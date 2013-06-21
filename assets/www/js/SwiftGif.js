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
        document.addEventListener("deviceready", swiftgif.onDeviceReady, false);
        // The image element that is being updated/cloned.
        swiftgif.updateId = 0;
        swiftgif.currentFrameId = -1;
        swiftgif.frames = [];
        swiftgif.tempImage = null;
    },
    onDeviceReady: function() {
        swiftgif.bindEvents();
    },
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        // Completely disable back button (causes app to crash when making gifs - thanks dad!).
        document.addEventListener("backbutton", function() {}, false);
        document.getElementById("captureButton").addEventListener("click", function() {
            swiftgif.onCaptureMedia(false);
        }, false);
        document.getElementById("recaptureButton").addEventListener("click", function() {
            swiftgif.onCaptureMedia(true);
        }, false);
        document.getElementById("addButton").addEventListener("click", function() {
            var image = new Image();

            // Use the stored image file for the JS Image object.
            image.src = swiftgif.tempImage;
            image.onload = function() {
                swiftgif.addFrame(image);
                swiftgif.framesPanel.add();
            };
        }, false);
        document.getElementById("updateButton").addEventListener("click", function() {
            var image = new Image();

            // Use the stored image file for the JS Image object.
            image.src = swiftgif.tempImage;
            image.onload = function() {
                swiftgif.addFrame(image);
                swiftgif.framesPanel.update();
            };
        }, false);
        document.getElementById("cancelButton").addEventListener("click", function() {
            swiftgif.resetPage();
        }, false);
        document.getElementById("clearAllButton").addEventListener("click", swiftgif.framesPanel.clearAll, false);
        document.getElementById("cloneButton").addEventListener("click", swiftgif.framesPanel.clone, false);
        document.getElementById("showSettingsButton").addEventListener("click", swiftgif.showGifPage, false);
        document.getElementById("createGifButton").addEventListener("click", swiftgif.createGif, false);
    },
    addFrame: function(image) {
        // Add the frame to the list of frames and increment the frame id.
        swiftgif.frames.push(new Frame(++swiftgif.currentFrameId, image));
    },
    updateFrame: function(frameId, image) {
        var oldFrame = swiftgif.getFrameById(frameId);
        // No sense updating a null frame.
        if (oldFrame === null)
            return;
        
        // Replace the frame at the index with the new Frame object.
        // The new frame object contains the new image but same id.
        swiftgif.frames[swiftgif.getFrameIndex(frameId)] = new Frame(oldFrame.frameId, image);
    },
    getFrameById: function(frameId) {
        // Iterate through the list until a matching frame id is found.
        for (var index = 0; index < swiftgif.frames.length; index++) {
            if (swiftgif.frames[index].getFrameId() === frameId)
                return swiftgif.frames[index];
        }
        
        return null;
    },
    getFrameIndex: function(frameId) {
        // Iterate through the list until a matching frame id is found.
        for (var index = 0; index < swiftgif.frames.length; index++) {
            if (swiftgif.frames[index].getFrameId() === frameId)
                return index;
        }
        
        return -1;
    },
    showGifPage: function() {
        var framesList = document.getElementById("framesList"),
            createGifButton = document.getElementById("createGifButton"),
            showSettingsButton = document.getElementById("showSettingsButton"),
            captureButton = document.getElementById("captureButton"),
            cancelButton = document.getElementById("cancelButton"),
            imageSettings = document.getElementById("imageSettings"),
            imageDesc = document.getElementById("imageDesc");
        
        framesList.className = "hide";
        createGifButton.className = "orange";
        showSettingsButton.className = "hide";
        captureButton.className = "hide";
        cancelButton.className = "red";
        imageSettings.className = "show";
        imageDesc.className = "show";
    },
    // Invoked when a user attempts to take a picture/capture a video.
    onCaptureMedia: function(recapture) {
        var options = {
            quality: 95,
            destinationType: Camera.DestinationType.FILE_URI,
            // Aspect ratios don't guarantee these values.
            targetWidth: 800,
            targetHeight: 1000,
            correctOrientation: true,
            saveToPhotoAlbum: false
        };
        
        // Recapturing or capturing? Determine which success callback to use.
        var successCallback = recapture ? swiftgif.onRecaptureSuccess : swiftgif.onCaptureSuccess;
        // Take the picture!
        navigator.camera.getPicture(successCallback, swiftgif.onCameraFailure, options);
    },
    onCaptureSuccess: function(imageURI) {
        var image = new Image(),
            addButton = document.getElementById("addButton"),
            captureButton = document.getElementById("captureButton"),
            cancelButton = document.getElementById("cancelButton"),
            showSettingsButton = document.getElementById("showSettingsButton"),
            framesList = document.getElementById("framesList");
        
        // Use the stored image file for the JS Image object.
        image.src = imageURI;
        image.onload = function() {
            // Add the image URI to the temp variable for later.
            swiftgif.tempImage = imageURI;
            swiftgif.addToPreviewer(image);
            addButton.className = "green";
            framesList.className = "hide";
            captureButton.className = "hide";
            showSettingsButton.className = "hide";
            cancelButton.className = "red";
        };
    },
    onRecaptureSuccess: function(imageURI) {
        var image = new Image(),
            updateButton = document.getElementById("updateButton"),
            recaptureButton = document.getElementById("recaptureButton"),
            cloneButton = document.getElementById("cloneButton"),
            showSettingsButton = document.getElementById("showSettingsButton"),
            framesList = document.getElementById("framesList");
        
        // Use the stored image file for the JS Image object.
        image.src = imageURI;
        image.onload = function() {
            // Add the image URI to the temp variable for later.
            swiftgif.tempImage = imageURI;
            swiftgif.addToPreviewer(image);
            cloneButton.className = "hide";
            showSettingsButton.className = "hide";
            framesList.className = "hide";
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
    createGif: function() {
        var canvasWidth = new Number(document.getElementById("canvasWidth").value),
            canvasHeight = new Number(document.getElementById("canvasHeight").value),
            delayTime = new Number(document.getElementById("delayTime").value),
            imageQuality = new Number(document.getElementById("imageQuality").value),
            canvas = document.createElement("canvas"),
            context = canvas.getContext("2d");
        
        // Most likely canvas isn't supported at this point. Older phone?
        if (canvas === null) {
            alert("Unable to initialize canvas!");
            return;
        }
    
        // Canvas width must be a number greater than zero.
        if (canvasWidth === NaN || !(canvasWidth !== NaN && canvasWidth > 0)) {
            alert("Canvas width must be bigger than zero!");
            return;
        }
        
        // Canvas height must be a number greater than zero.
        if (canvasHeight === NaN || !(canvasHeight !== NaN && canvasHeight > 0)) {
            alert("Canvas height must be bigger than zero!");
            return;
        }
        
        // Delay time must be a number greater than zero.
        if (delayTime === NaN || !(delayTime !== NaN && delayTime > 0)) {
            alert("Delay time must be longer than zero milliseconds!");
            return;
        }
        
        // Image quality must be between one and ten.
        if (imageQuality === NaN || !(imageQuality !== NaN && (imageQuality >= 1 && imageQuality <= 10))) {
            alert("Image quality must be between one and ten!");
            return;
        }
        
        alert("Creating gif... This may take a minute.");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        // Use a black blackground as the drawing canvas.
        context.fillStyle = "rgb(0,0,0)";
        context.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Create the bytearray which will hold the gif file and initialize the encoder.
        var byteArray = new ByteArray(),
            encoder = new GIFEncoder(byteArray, canvasWidth, canvasHeight, delayTime, imageQuality);

        // Begin the encoding process.
        encoder.start();
        // Add each frame at a time from the list.
        for (var index = 0; index < swiftgif.frames.length; index++) {
            var frame = swiftgif.frames[index];
            
            // Draw the image to the canvas and use the canvas object to encode the frame.
            context.drawImage(frame.image, 0, 0, canvasWidth, canvasHeight);
            encoder.addFrame(context);
        }
        
        // Add the gif trailer byte (finished!).
        encoder.finish();
        
        // Show the image on the previewer.
        var image = new Image();
        image.src = "data:image/gif;base64," + encode64(byteArray.getData());
        image.onload = function() {
            swiftgif.addToPreviewer(image);
        };
        
        var fileName = prompt("Enter the name of your gif file: ");
        // Filename must be valid.
        if (fileName !== null && fileName.length > 0) {
            // Save the image to the device's filesystem.
            window.plugins.base64ToGIF.saveImage(encode64(byteArray.getData()), 
                {
                    filename: fileName, 
                    overwrite: true
                }, 
                function(result) {}, 
                function(error) {
                    alert(error);
                });
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
            cloneButton = document.getElementById("cloneButton"),
            showSettingsButton = document.getElementById("showSettingsButton"),
            createGifButton = document.getElementById("createGifButton"),
            framesList = document.getElementById("framesList"),
            imageSettings = document.getElementById("imageSettings"),
            imageDesc = document.getElementById("imageDesc");
            
        if (imagePreview.firstChild !== null)
            imagePreview.removeChild(imagePreview.firstChild);
        
        imagePreview.style.width = 500 + "px";
        imagePreview.style.height = 500 + "px";
        
        showSettingsButton.className = "hide";
        captureButton.className = "green";
        addButton.className = "hide";
        cancelButton.className = "hide";
        recaptureButton.className = "hide";
        updateButton.className = "hide";
        cloneButton.className = "hide";
        createGifButton.className = "hide";
        showSettingsButton.className = "hide";
        imageSettings.className = "hide";
        imageDesc.className = "hide";
        
        if (swiftgif.frames.length > 0)
            framesList.className = "show";
        else
            framesList.className = "hide";
        
        if (swiftgif.frames.length > 0 && swiftgif.updateId === 0)
            showSettingsButton.className = "orange";
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
                        cloneButton = document.getElementById("cloneButton"),
                        showSettingsButton = document.getElementById("showSettingsButton");
                        
                    swiftgif.addToPreviewer(previewImage);
                    swiftgif.updateId = frame.getFrameId();
                    captureButton.className = "hide";
                    showSettingsButton.className = "hide";
                    recaptureButton.className = "green";
                    cloneButton.className = "blue";
                    cancelButton.className = "red";
                };
            }, false);
            
            // Add to the list of frames.
            framesList.appendChild(frameImageElement);
            
            alert("Successfully added image to list of GIF frames!");
            swiftgif.updateId = 0;
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
            
            // The temporary frame is no longer needed.
            swiftgif.frames.pop();
            alert("Successfully updated frame!");
            swiftgif.updateId = 0;
            swiftgif.resetPage();
        },
        clearAll: function() {
            var doDelete = confirm("Are you sure you want to remove all frames?"),
                framesList = document.getElementById("framesList");
            
            // If the user wants to delete...
            if (doDelete) {
                var element = framesList.firstElementChild;
                element = element.nextElementSibling;
                // Get each element (except the first - the button!) and delete every one.
                // These elements are the thumbnail-sized frames.
                while (element) {
                    var nextElement = element.nextElementSibling;
                    framesList.removeChild(element);
                    element = nextElement;
                }
                
                // Reset some properties.
                swiftgif.updateId = 0;
                swiftgif.nextFrameId = 1;
                swiftgif.currentFrameId = -1;
                swiftgif.frames = [];
            }
            
            swiftgif.resetPage();
        }
    }
};
