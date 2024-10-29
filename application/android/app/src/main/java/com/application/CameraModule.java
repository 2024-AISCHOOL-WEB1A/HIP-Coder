package com.application;

import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Handler; // 추가: Handler 임포트
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
    private boolean isScanning = false; // 추가: 스캔 중 여부 확인

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
            reactContext.runOnUiQueueThread(() -> {
                previewView = new PreviewView(activity);
                previewView.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                ));

                ViewGroup rootView = (ViewGroup) activity.findViewById(android.R.id.content);
                rootView.addView(previewView);

                ListenableFuture<ProcessCameraProvider> cameraProviderFuture = ProcessCameraProvider.getInstance(reactContext);
                cameraProviderFuture.addListener(() -> {
                    try {
                        ProcessCameraProvider cameraProvider = cameraProviderFuture.get();

                        Preview preview = new Preview.Builder().build();
                        preview.setSurfaceProvider(previewView.getSurfaceProvider());

                        ImageAnalysis imageAnalysis = new ImageAnalysis.Builder()
                            .setTargetResolution(new Size(1280, 720))
                            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                            .build();

                        imageAnalysis.setAnalyzer(ContextCompat.getMainExecutor(reactContext), image -> {
                            if (!isScanning) { // 스캔 중이 아닐 때만 분석 수행
                                scanQRCode(image);
                            } else {
                                image.close(); // 스캔 중일 때는 이미지를 닫음
                            }
                        });

                        CameraSelector cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA;
                        cameraProvider.unbindAll();

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

    @ReactMethod
    private void scanQRCode(ImageProxy image) {
        Bitmap bitmap = previewView.getBitmap();
        if (bitmap != null) {
            InputImage inputImage = InputImage.fromBitmap(bitmap, image.getImageInfo().getRotationDegrees());
            barcodeScanner.process(inputImage)
                .addOnSuccessListener(barcodes -> {
                    if (!isScanning) { // QR 코드가 감지되었을 때만 처리
                        for (Barcode barcode : barcodes) {
                            String qrText = barcode.getRawValue();
                            Log.d(TAG, "QR Code detected: " + qrText);

                            // QR 코드 스캔 성공 이벤트 전송
                            WritableMap params = Arguments.createMap();
                            params.putString("result", qrText);
                            sendEvent("QRScanSuccess", params);

                            isScanning = true; // 스캔 중 상태로 변경
                            new Handler().postDelayed(() -> {
                                isScanning = false; // 10초 후 스캔 가능
                            }, 10000); // 10초 대기
                        }
                    }
                })
                .addOnFailureListener(e -> Log.e(TAG, "QR code scan error", e))
                .addOnCompleteListener(task -> image.close());
        } else {
            image.close();
        }
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    @ReactMethod
    private void sendQRCodeDetected(String qrText) {
        WritableMap params = Arguments.createMap();
        params.putString("qrText", qrText);
        sendEvent("QRCodeDetected", params);
    }
}







