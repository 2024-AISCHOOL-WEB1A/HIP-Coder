package com.application;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.PorterDuff;
import android.graphics.Color;
import android.view.View;

public class OverlayView extends View {
    private final Paint paint;
    private final Rect focusRect;

    public OverlayView(Context context) {
        super(context);

        // 포커스 영역의 위치와 크기 설정 (가운데 650x650 크기)
        

        int screenWidth = getResources().getDisplayMetrics().widthPixels;
        int screenHeight = getResources().getDisplayMetrics().heightPixels;
        int focusSize = (int) (Math.min(screenWidth, screenHeight) * 0.75);
        int left = (screenWidth - focusSize) / 2;
        int top = (screenHeight - focusSize) / 2;

        focusRect = new Rect(left, top, left + focusSize, top + focusSize);

        // 페인트 설정
        paint = new Paint();
        paint.setColor(Color.BLACK); // 배경색 설정
        paint.setStyle(Paint.Style.FILL);
        paint.setAlpha(150); // 반투명도 설정
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        // 전체 화면을 검게 채움
        canvas.drawRect(0, 0, getWidth(), getHeight(), paint);

        // 포커스 영역을 투명하게 만들기
        paint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.CLEAR));
        canvas.drawRect(focusRect, paint);
        Paint borderPaint = new Paint();
        borderPaint.setColor(Color.WHITE);
        borderPaint.setStyle(Paint.Style.STROKE);
        borderPaint.setStrokeWidth(5);
        canvas.drawRect(focusRect, borderPaint);


        // Xfermode 초기화
        paint.setXfermode(null);
    }

    // 포커스 영역 반환 메서드
    public Rect getFocusRect() {
        return focusRect;
    }
}
