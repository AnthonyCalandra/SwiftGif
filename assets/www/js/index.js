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
        this.nextUpdateId = 0;
    },
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
        document.getElementById("captureButton").addEventListener("click", function() {
            swiftgif.onCaptureMedia("image", false);
        }, false);
        document.getElementById("recaptureButton").addEventListener("click", function() {
            swiftgif.onCaptureMedia("image", true);
        }, false);
        document.getElementById("addButton").addEventListener("click", this.framesPanel.add, false);
        document.getElementById("updateButton").addEventListener("click", this.framesPanel.update, false);
        document.getElementById("cancelButton").addEventListener("click", this.resetPage, false);
    },
    onDeviceReady: function() {
    },
    // Invoked when a user attempts to take a picture/capture a video.
    onCaptureMedia: function(type, recapture) {
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
            swiftgif.addToPreviewer(image);
            addButton.className = "continue";
            captureButton.className = "hide";
            cancelButton.className = "cancel";
        };
    },
    onRecaptureSuccess: function(imageURI) {
        var image = new Image(),
            updateButton = document.getElementById("updateButton"),
            recaptureButton = document.getElementById("recaptureButton");
        
        // Use the stored image file for the JS Image object.
        image.src = imageURI;
        image.onload = function() {
            swiftgif.addToPreviewer(image);
            updateButton.className = "continue";
            recaptureButton.className = "hide";
        };
    },
    onCameraFailure: function(errorMessage) {
        if (errorMessage == "Camera cancelled.")
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
            updateButton = document.getElementById("updateButton");
            
        imagePreview.removeChild(imagePreview.firstChild);
        captureButton.className = "continue";
        addButton.className = "hide";
        cancelButton.className = "hide";
        recaptureButton.className = "hide";
        updateButton.className = "hide";
        this.updateId = "";
    },
    framesPanel: {
        add: function() {
            var framesList = document.getElementById("framesList"),
                frameImageElement = document.createElement("img"),
                imagePreview = document.getElementById("imagePreview");
                
            // Clone the imagePreview element to retrieve its image. Cloning must
            // be used because retrieving its image from the original element
            // doesn't allow the previewer image to be destroyed later in resetPage().
            frameImageElement.src = imagePreview.cloneNode(true).firstChild.src;
            // Resize it into a thumbnail.
            frameImageElement.height = 100;
            frameImageElement.width = 100;
            frameImageElement.id = "frameImage" + swiftgif.nextUpdateId++;
            
            frameImageElement.addEventListener("click", function() {
                // Use the original framed image.
                var previewImage = new Image();
                previewImage.src = frameImageElement.src;
                previewImage.onload = function() {
                    var captureButton = document.getElementById("captureButton")
                        recaptureButton = document.getElementById("recaptureButton"),
                        cancelButton = document.getElementById("cancelButton");
                        
                    swiftgif.addToPreviewer(previewImage);
                    swiftgif.updateId = frameImageElement.id;
                    captureButton.className = "hide";
                    recaptureButton.className = "continue";
                    cancelButton.className = "cancel";
                };
            }, false);
            
            // Add to the list of frames.
            framesList.appendChild(frameImageElement);
            
            alert("Successfully added image to list of GIF frames!");
            swiftgif.resetPage();
        },
        update: function() {
            var originalFrameElement = document.getElementById(swiftgif.updateId);
                
            // Clone the imagePreview element to retrieve its image. Cloning must
            // be used because retrieving its image from the original element
            // doesn't allow the previewer image to be destroyed later in resetPage().
            originalFrameElement.src = imagePreview.cloneNode(true).firstChild.src;
            // Resize it into a thumbnail.
            originalFrameElement.height = 100;
            originalFrameElement.width = 100;
            
            alert("Successfully updated frame!");
            swiftgif.resetPage();
        }
    }
};