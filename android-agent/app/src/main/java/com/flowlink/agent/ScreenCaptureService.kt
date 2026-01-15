package com.flowlink.agent

import android.app.*
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

class ScreenCaptureService : Service() {
    private lateinit var webRTCManager: WebRTCManager
    
    companion object {
        private const val NOTIFICATION_ID = 1
        private const val CHANNEL_ID = "screen_capture_channel"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, createNotification())
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val resultCode = intent?.getIntExtra("resultCode", Activity.RESULT_CANCELED) ?: return START_NOT_STICKY
        val data = intent.getParcelableExtra<Intent>("data") ?: return START_NOT_STICKY
        
        webRTCManager = WebRTCManager(this, resultCode, data)
        webRTCManager.initialize()
        
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        webRTCManager.cleanup()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Screen Capture",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "FlowLink screen sharing active"
            }
            
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("FlowLink")
            .setContentText("Screen sharing active")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }
}
