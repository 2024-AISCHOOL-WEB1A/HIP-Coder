package com.application;

import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Handler;
import android.util.Log;
import android.util.Size;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

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
    private boolean isScanning = false;
    private Button closeButton;

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
                // 카메라 프리뷰 설정
                setupPreviewView(activity);

                // Close Camera 버튼 설정
                setupCloseButton(activity);

                // 나머지 카메라 초기화 코드
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
                            if (!isScanning) {
                                scanQRCode(image);
                            } else {
                                image.close();
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

    private void setupPreviewView(Activity activity) {
        previewView = new PreviewView(activity);
        previewView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        ViewGroup rootView = (ViewGroup) activity.findViewById(android.R.id.content);
        rootView.addView(previewView);
    }

    private void setupCloseButton(Activity activity) {
        closeButton = new Button(activity);
        closeButton.setText("Close");

        // 버튼 크기와 위치 설정
        ViewGroup.LayoutParams params = new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
        );
        closeButton.setLayoutParams(params);

        // 버튼 클릭 시 동작 설정
        closeButton.setOnClickListener(v -> {
            Log.d(TAG, "Close button clicked. Stopping camera.");
            stopCamera();
        });

        // 버튼을 중앙 하단에 위치시키기 위한 추가 설정
        closeButton.post(() -> {
            // 화면 크기 구하기
            int screenWidth = activity.getResources().getDisplayMetrics().widthPixels;
            int screenHeight = activity.getResources().getDisplayMetrics().heightPixels;

            // 버튼을 중앙에 배치
            closeButton.setX((screenWidth - closeButton.getWidth()) / 2f);

            // 하단에서 조금 위로 이동 (여백 조정)
            closeButton.setY(screenHeight - closeButton.getHeight() - 100); // 100 픽셀 위로 조정
        });

        // 버튼을 레이아웃에 추가
        ViewGroup rootView = (ViewGroup) activity.findViewById(android.R.id.content);
        rootView.addView(closeButton);
    }

    private void stopCamera() {
        if (previewView != null) {
            ViewGroup rootView = (ViewGroup) previewView.getParent();
            if (rootView != null) {
                rootView.removeView(previewView); // 프리뷰 제거
            }
            previewView = null; // previewView 초기화
        } else {
            Log.e(TAG, "Preview view is null, cannot remove.");
        }

        // Close Camera 버튼 제거
        if (closeButton != null) {
            ViewGroup rootView = (ViewGroup) closeButton.getParent();
            if (rootView != null) {
                rootView.removeView(closeButton); // 버튼 제거
            }
            closeButton = null; // closeButton 초기화
        } else {
            Log.e(TAG, "Close button is null, cannot remove.");
        }

        // 바코드 스캐너 리소스 해제 및 상태 초기화
        releaseBarcodeScanner();

        isScanning = false; // 스캔 상태 초기화
        Log.d(TAG, "Camera stopped and resources released."); // 로그 출력

        // 이벤트 전송
        WritableMap params = Arguments.createMap();
        params.putString("message", "CameraClosed");
        sendEvent("CameraCloseEvent", params); // 이벤트 전송
    }

    private void releaseBarcodeScanner() {
        if (barcodeScanner != null) {
            barcodeScanner.close();
            barcodeScanner = null; // 스캐너 초기화
        }
    }

    @ReactMethod
    public void cancelScan() {
        stopCamera(); // 카메라를 종료하고 리소스를 해제합니다.
    }

    private void scanQRCode(ImageProxy image) {
        if (previewView == null) {
            // previewView가 null일 경우 스캔을 중단
            image.close();
            return;
        }

        Bitmap bitmap = previewView.getBitmap();
        if (bitmap == null) {
            // bitmap이 null일 경우 스캔을 중단
            image.close();
            return;
        }

        try {
            InputImage inputImage = InputImage.fromBitmap(bitmap, image.getImageInfo().getRotationDegrees());
            barcodeScanner.process(inputImage)
                    .addOnSuccessListener(barcodes -> {
                        if (!isScanning) {
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
                                }, 10000);
                            }
                        }
                    })
                    .addOnFailureListener(e -> {
                        Log.e(TAG, "QR code scan error", e);
                    })
                    .addOnCompleteListener(task -> {
                        // 반드시 image.close() 호출
                        image.close();
                        if (bitmap != null) {
                            bitmap.recycle(); // 비트맵 메모리 해제
                        }
                    });
        } catch (Exception e) {
            Log.e(TAG, "Error processing image", e);
            image.close(); // 리소스 해제
            if (bitmap != null) {
                bitmap.recycle(); // 비트맵 메모리 해제
            }
        }
    }

    private void sendEvent(String eventName, WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
