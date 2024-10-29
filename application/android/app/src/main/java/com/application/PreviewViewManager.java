package com.application;

import androidx.annotation.NonNull;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

public class PreviewViewManager extends SimpleViewManager<CustomPreviewView> {

    public static final String REACT_CLASS = "PreviewView";

    @NonNull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @NonNull
    @Override
    protected CustomPreviewView createViewInstance(@NonNull ThemedReactContext reactContext) {
        return new CustomPreviewView(reactContext);
    }
}
