
package org.apache.cordova;

/**
* A phonegap plugin that converts a Base64 String to a PNG file.
*
* @author mcaesar
* @lincese MIT.
*/

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import org.json.JSONArray;

import android.os.Environment;
import java.io.*;
import org.json.JSONException;
import org.json.JSONObject;
import com.anthonycalandra.swiftgif.util.Base64;
import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;

public class Base64ToGIF extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callback) {
        if (!action.equals("saveImage")) {
            return false;
        }

        try {
            String b64String = "";
            if (b64String.startsWith("data:image")) {
                b64String = args.getString(0).substring(21);
            } else {
                b64String = args.getString(0);
            }
            JSONObject params = args.getJSONObject(1);

            //Optional parameter
            String filename = params.has("filename")
                    ? params.getString("filename") + ".gif"
                    : "b64Image_" + System.currentTimeMillis() + ".gif";

            String folder = params.has("folder")
                    ? params.getString("folder")
                    : Environment.getExternalStorageDirectory() + "/Pictures";

            boolean overwrite = params.has("overwrite") 
                    ? params.getBoolean("overwrite") 
                    : false;

            return saveImage(b64String, filename, folder, overwrite);
        } catch (JSONException e) {
            System.err.println(e.getMessage());
            return false;
        } catch (InterruptedException e) {
            System.err.println(e.getMessage());
            return false;
        }
    }

    private boolean saveImage(String b64String, String fileName, String dirName, boolean overwrite) throws InterruptedException, JSONException {
        try {
            //Directory and File
            File dir = new File(dirName);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            File file = new File(dirName, fileName);

            //Avoid overwriting a file
            if (!overwrite && file.exists()) {
                return false;
            }

            //Decode Base64 back to Binary format
            byte[] decodedBytes = Base64.decode(b64String.getBytes());

            //Save Binary file to phone
            file.createNewFile();
            FileOutputStream fOut = new FileOutputStream(file);
            fOut.write(decodedBytes);
            fOut.close();
            return true;
        } catch (FileNotFoundException e) {
            System.err.println(e.getMessage());
            return false;
        } catch (IOException e) {
            System.err.println(e.getMessage());
            return false;
        }
    }
}
