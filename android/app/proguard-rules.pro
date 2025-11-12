# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:





# Keep React Native classes
-keep class com.facebook.react.** { *; }

# Keep Hermes classes if you use Hermes
-keep class com.facebook.hermes.** { *; }

# Keep JNI classes (Java Native Interface) for native bridge
-keep class com.facebook.jni.** { *; }

# Keep classes annotated with DoNotStrip (important for native code)
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}

# Keep OkHttp classes (React Native networking) if used
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# Prevent warnings about missing classes from react native
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**
-dontwarn com.facebook.jni.**

# If you have other native libraries, add their keep rules here


# ML Kit Vision and Barcode detection
-keep class com.google.mlkit.** { *; }
-dontwarn com.google.mlkit.**

-keep class org.reactnative.camera.** { *; }
-dontwarn org.reactnative.camera.**