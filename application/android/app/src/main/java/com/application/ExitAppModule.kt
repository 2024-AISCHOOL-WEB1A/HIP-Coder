package com.application

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ExitAppModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ExitAppModule"
    }

    @ReactMethod
    fun exitApp() {
        val activity = currentActivity
        activity?.finishAffinity()
        System.exit(0)
    }
}
