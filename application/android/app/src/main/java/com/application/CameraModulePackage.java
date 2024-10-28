package com.application;
import android.util.Log;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.ReactApplicationContext;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CameraModulePackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        
        modules.add(new CameraModule(reactContext));
        //Log.d("체크용 CameraModule :",new CameraModule(reactContext));/
        Log.d("체크용 : reactContext :", reactContext.toString()); // CameraModule 추가
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        List<ViewManager> viewManagers = new ArrayList<>();
        viewManagers.add(new PreviewViewManager()); // PreviewViewManager 추가
        return viewManagers;
    }
}
