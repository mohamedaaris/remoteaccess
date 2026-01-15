package com.flowlink.agent

import com.google.gson.Gson
import okhttp3.*
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class SignalingClient(private val serverUrl: String) {
    private var webSocket: WebSocket? = null
    private val client = OkHttpClient.Builder()
        .readTimeout(0, TimeUnit.MILLISECONDS)
        .build()
    private val gson = Gson()
    
    var onDeviceRegistered: ((String) -> Unit)? = null
    var onSessionRequest: ((String, String) -> Unit)? = null
    var onSessionStarted: ((String) -> Unit)? = null
    var onDisconnected: (() -> Unit)? = null
    var onOffer: ((String, String) -> Unit)? = null
    var onAnswer: ((String, String) -> Unit)? = null
    var onIceCandidate: ((String, String) -> Unit)? = null

    fun connect(deviceName: String, deviceType: String, platform: String) {
        val request = Request.Builder()
            .url(serverUrl)
            .build()

        webSocket = client.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                register(deviceName, deviceType, platform)
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                handleMessage(text)
            }

            override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
                onDisconnected?.invoke()
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                onDisconnected?.invoke()
            }
        })
    }

    fun disconnect() {
        webSocket?.close(1000, "User disconnect")
        webSocket = null
    }

    private fun register(deviceName: String, deviceType: String, platform: String) {
        val message = JSONObject().apply {
            put("type", "register_device")
            put("timestamp", System.currentTimeMillis())
            put("device", JSONObject().apply {
                put("name", deviceName)
                put("type", deviceType)
                put("platform", platform)
            })
        }
        send(message.toString())
    }

    private fun handleMessage(text: String) {
        val json = JSONObject(text)
        val type = json.getString("type")

        when (type) {
            "device_registered" -> {
                val deviceId = json.getString("deviceId")
                onDeviceRegistered?.invoke(deviceId)
            }
            "session_request" -> {
                val sessionId = json.getString("sessionId")
                val fromDevice = json.getJSONObject("fromDevice").getString("name")
                onSessionRequest?.invoke(sessionId, fromDevice)
            }
            "session_started" -> {
                val sessionId = json.getString("sessionId")
                onSessionStarted?.invoke(sessionId)
            }
            "offer" -> {
                val sessionId = json.getString("sessionId")
                val sdp = json.getString("sdp")
                onOffer?.invoke(sessionId, sdp)
            }
            "answer" -> {
                val sessionId = json.getString("sessionId")
                val sdp = json.getString("sdp")
                onAnswer?.invoke(sessionId, sdp)
            }
            "ice_candidate" -> {
                val sessionId = json.getString("sessionId")
                val candidate = json.getJSONObject("candidate").toString()
                onIceCandidate?.invoke(sessionId, candidate)
            }
            "ping" -> {
                val pong = JSONObject().apply {
                    put("type", "pong")
                    put("timestamp", System.currentTimeMillis())
                }
                send(pong.toString())
            }
        }
    }

    fun acceptSession(sessionId: String) {
        val message = JSONObject().apply {
            put("type", "accept_session")
            put("timestamp", System.currentTimeMillis())
            put("sessionId", sessionId)
        }
        send(message.toString())
    }

    fun rejectSession(sessionId: String, reason: String) {
        val message = JSONObject().apply {
            put("type", "reject_session")
            put("timestamp", System.currentTimeMillis())
            put("sessionId", sessionId)
            put("reason", reason)
        }
        send(message.toString())
    }

    fun sendOffer(sessionId: String, sdp: String) {
        val message = JSONObject().apply {
            put("type", "offer")
            put("timestamp", System.currentTimeMillis())
            put("sessionId", sessionId)
            put("sdp", sdp)
        }
        send(message.toString())
    }

    fun sendAnswer(sessionId: String, sdp: String) {
        val message = JSONObject().apply {
            put("type", "answer")
            put("timestamp", System.currentTimeMillis())
            put("sessionId", sessionId)
            put("sdp", sdp)
        }
        send(message.toString())
    }

    fun sendIceCandidate(sessionId: String, candidate: String) {
        val message = JSONObject().apply {
            put("type", "ice_candidate")
            put("timestamp", System.currentTimeMillis())
            put("sessionId", sessionId)
            put("candidate", JSONObject(candidate))
        }
        send(message.toString())
    }

    private fun send(message: String) {
        webSocket?.send(message)
    }
}
