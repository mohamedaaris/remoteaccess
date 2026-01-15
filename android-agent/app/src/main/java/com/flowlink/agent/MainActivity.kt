package com.flowlink.agent

import android.app.Activity
import android.content.Intent
import android.media.projection.MediaProjectionManager
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var statusText: TextView
    private lateinit var connectButton: Button
    private lateinit var signalingClient: SignalingClient
    
    private var isConnected = false
    private val serverUrl = "ws://YOUR_SERVER_IP:8080"
    
    companion object {
        private const val REQUEST_MEDIA_PROJECTION = 1
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        statusText = findViewById(R.id.statusText)
        connectButton = findViewById(R.id.connectButton)
        
        signalingClient = SignalingClient(serverUrl)
        setupSignalingCallbacks()
        
        connectButton.setOnClickListener {
            if (!isConnected) {
                connectToServer()
            } else {
                disconnectFromServer()
            }
        }
    }

    private fun setupSignalingCallbacks() {
        signalingClient.onDeviceRegistered = { deviceId ->
            runOnUiThread {
                isConnected = true
                statusText.text = "Connected (ID: ${deviceId.take(8)}...)"
                connectButton.text = "Disconnect"
            }
        }
        
        signalingClient.onSessionRequest = { sessionId, fromDevice ->
            runOnUiThread {
                showSessionRequestDialog(sessionId, fromDevice)
            }
        }
        
        signalingClient.onSessionStarted = { sessionId ->
            runOnUiThread {
                startScreenCapture(sessionId)
            }
        }
        
        signalingClient.onDisconnected = {
            runOnUiThread {
                isConnected = false
                statusText.text = "Disconnected"
                connectButton.text = "Connect"
            }
        }
    }

    private fun connectToServer() {
        val deviceName = android.os.Build.MODEL
        val platform = "Android ${android.os.Build.VERSION.RELEASE}"
        
        signalingClient.connect(deviceName, "mobile", platform)
        statusText.text = "Connecting..."
    }

    private fun disconnectFromServer() {
        signalingClient.disconnect()
    }

    private fun showSessionRequestDialog(sessionId: String, fromDevice: String) {
        AlertDialog.Builder(this)
            .setTitle("Remote Access Request")
            .setMessage("$fromDevice wants to access your device")
            .setPositiveButton("Accept") { _, _ ->
                signalingClient.acceptSession(sessionId)
            }
            .setNegativeButton("Reject") { _, _ ->
                signalingClient.rejectSession(sessionId, "User rejected")
            }
            .setCancelable(false)
            .show()
    }

    private fun startScreenCapture(sessionId: String) {
        val mediaProjectionManager = getSystemService(MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        val captureIntent = mediaProjectionManager.createScreenCaptureIntent()
        startActivityForResult(captureIntent, REQUEST_MEDIA_PROJECTION)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        
        if (requestCode == REQUEST_MEDIA_PROJECTION) {
            if (resultCode == Activity.RESULT_OK && data != null) {
                val serviceIntent = Intent(this, ScreenCaptureService::class.java).apply {
                    putExtra("resultCode", resultCode)
                    putExtra("data", data)
                }
                startForegroundService(serviceIntent)
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        signalingClient.disconnect()
    }
}
