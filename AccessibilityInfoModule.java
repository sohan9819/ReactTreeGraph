package com.yourpackage;

import android.content.ContentResolver;
import android.os.Build;
import android.provider.Settings;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

public class AccessibilityInfoModule extends ReactContextBaseJavaModule {

    private static final String MODULE = "AccessibilityInfo";
    private final ReactApplicationContext reactContext;

    public AccessibilityInfoModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return MODULE;
    }

    @Override
    public @Nullable Map<String, Object> getConstants() {
        HashMap<String, Object> constants = new HashMap<>();
        constants.put("isBoldTextEnabled", isBoldTextEnabledSync());
        return constants;
    }

    @ReactMethod
    public void isBoldTextEnabled(Promise promise) {
        try {
            promise.resolve(isBoldTextEnabledSync());
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to get bold text setting", e);
        }
    }

    private boolean isBoldTextEnabledSync() {
        ContentResolver contentResolver = reactContext.getContentResolver();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) { // Android 12+ (API 31+)
            int fontWeightAdjustment = Settings.Secure.getInt(contentResolver, "font_weight_adjustment", 0);
            return fontWeightAdjustment > 100; // Bold text enabled if value > 100
        } else {
            // For older Android versions, check ACCESSIBILITY_HIGH_TEXT_CONTRAST
            try {
                int highTextContrast = Settings.Secure.getInt(contentResolver, Settings.Secure.ACCESSIBILITY_HIGH_TEXT_CONTRAST, 0);
                return highTextContrast == 1;
            } catch (Settings.SettingNotFoundException e) {
                return false; // Default to false if setting not found
            }
        }
    }
}
