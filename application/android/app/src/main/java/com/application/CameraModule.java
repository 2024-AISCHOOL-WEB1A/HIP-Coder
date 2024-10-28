package com.application;

import android.app.Activity;
import android.graphics.Bitmap;
import android.util.Log;
import android.util.Size;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.ImageProxy;
import androidx.camera.core.Preview;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.LifecycleOwner;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.google.mlkit.vision.barcode.Barcode;
import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.common.InputImage;
import com.google.common.util.concurrent.ListenableFuture;

import java.util.concurrent.ExecutionException;

public class CameraModule extends ReactContextBaseJavaModule {
    private static final String TAG = "CameraModule";
    private final ReactApplicationContext reactContext;
    private PreviewView previewView;
    private BarcodeScanner barcodeScanner;

    public CameraModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        barcodeScanner = BarcodeScanning.getClient();
    }

    @NonNull
    @Override
    public String getName() {
        return "CameraModule";
    }

    @ReactMethod
    public void startCamera() {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            // 메인 스레드에서 실행
            reactContext.runOnUiQueueThread(() -> {
                // Camera Preview 설정
                previewView = new PreviewView(activity);
                previewView.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                ));

                // PreviewView를 Activity의 ViewGroup에 추가
                ViewGroup rootView = (ViewGroup) activity.findViewById(android.R.id.content);
                rootView.addView(previewView); // PreviewView를 루트 뷰에 추가

                ListenableFuture<ProcessCameraProvider> cameraProviderFuture = ProcessCameraProvider.getInstance(reactContext);
                cameraProviderFuture.addListener(() -> {
                    try {
                        ProcessCameraProvider cameraProvider = cameraProviderFuture.get();

                        // Camera Preview 설정
                        Preview preview = new Preview.Builder().build();
                        preview.setSurfaceProvider(previewView.getSurfaceProvider());

                        // Image Analysis 설정
                        ImageAnalysis imageAnalysis = new ImageAnalysis.Builder()
                            .setTargetResolution(new Size(1280, 720))
                            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                            .build();

                        imageAnalysis.setAnalyzer(ContextCompat.getMainExecutor(reactContext), image -> {
                            scanQRCode(image);
                        });

                        CameraSelector cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA;
                        cameraProvider.unbindAll();

                        // Activity를 LifecycleOwner로 캐스팅
                        cameraProvider.bindToLifecycle((LifecycleOwner) activity, cameraSelector, preview, imageAnalysis);
                    } catch (ExecutionException | InterruptedException e) {
                        Log.e(TAG, "카메라 초기화 중 오류 발생: ", e);
                    }
                }, ContextCompat.getMainExecutor(reactContext));
            });
        } else {
            Log.e(TAG, "현재 Activity가 null입니다.");
        }
    }

    // QR 코드 스캔 성공 시 React Native에 이벤트 전송
    private void scanQRCode(ImageProxy image) {
        Bitmap bitmap = previewView.getBitmap(); // 미리보기에서 Bitmap 가져오기
        if (bitmap != null) {
            InputImage inputImage = InputImage.fromBitmap(bitmap, image.getImageInfo().getRotationDegrees());
            barcodeScanner.process(inputImage)
                .addOnSuccessListener(barcodes -> {
                    for (Barcode barcode : barcodes) {
                        String qrText = barcode.getRawValue();
                        Log.d(TAG, "QR Code detected: " + qrText);

                        // QR 코드 스캔 성공 이벤트 전송
                        WritableMap params = Arguments.createMap();
                        params.putString("result", qrText);
                        sendEvent("QRScanSuccess", params); // 이벤트 발생
                    }
                })
                .addOnFailureListener(e -> Log.e(TAG, "QR code scan error", e))
                .addOnCompleteListener(task -> image.close());
        } else {
            image.close();
        }
    }

    // 이벤트를 보내는 메서드 정의
    private void sendEvent(String eventName, WritableMap params) {
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
        }
    }
}
