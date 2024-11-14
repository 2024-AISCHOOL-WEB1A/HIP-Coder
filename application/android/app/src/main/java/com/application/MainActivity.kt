package com.application

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactContext

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "application"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  // 네이티브 모듈 추가 - 앱 완전 종료 기능
  @ReactMethod
  fun exitApp() {
    finishAffinity() // 모든 액티비티 종료
    System.exit(0)   // 프로세스 종료
  }
}
