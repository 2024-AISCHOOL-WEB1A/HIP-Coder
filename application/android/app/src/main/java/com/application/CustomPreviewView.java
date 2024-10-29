package com.application;

import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;
import android.view.ViewGroup;
import androidx.camera.view.PreviewView;

public class CustomPreviewView extends ViewGroup {
    private static final String TAG = "CustomPreviewView";
    private final PreviewView previewView;

    public CustomPreviewView(Context context) {
        super(context);
        previewView = new PreviewView(context);
    }

    public CustomPreviewView(Context context, AttributeSet attrs) {
        super(context, attrs);
        previewView = new PreviewView(context);
    }

    public CustomPreviewView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        previewView = new PreviewView(context);
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        // Layout을 설정하는 메서드, 여기에 previewView의 위치를 설정합니다.
        previewView.layout(left, top, right, bottom);
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        Log.d(TAG, "CustomPreviewView가 화면에 추가되었습니다.");
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        Log.d(TAG, "CustomPreviewView가 화면에서 제거되었습니다.");
    }

    // PreviewView를 반환하는 메서드
    public PreviewView getPreviewView() {
        return previewView;
    }
}
