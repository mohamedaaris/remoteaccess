package com.flowlink.agent

import android.content.Context
import android.content.Intent
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import org.webrtc.*

class WebRTCManager(
    private val context: Context,
    private val resultCode: Int,
    private val data: Intent
) {
    private var peerConnectionFactory: PeerConnectionFactory? = null
    private var peerConnection: PeerConnection? = null
    private var videoCapturer: VideoCapturer? = null
    private var videoSource: VideoSource? = null
    private var mediaProjection: MediaProjection? = null

    fun initialize() {
        val options = PeerConnectionFactory.InitializationOptions.builder(context)
            .setEnableInternalTracer(true)
            .createInitializationOptions()
        PeerConnectionFactory.initialize(options)

        val encoderFactory = DefaultVideoEncoderFactory(
            EglBase.create().eglBaseContext,
            true,
            true
        )
        val decoderFactory = DefaultVideoDecoderFactory(EglBase.create().eglBaseContext)

        peerConnectionFactory = PeerConnectionFactory.builder()
            .setVideoEncoderFactory(encoderFactory)
            .setVideoDecoderFactory(decoderFactory)
            .createPeerConnectionFactory()

        setupMediaProjection()
    }

    private fun setupMediaProjection() {
        val mediaProjectionManager = context.getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        mediaProjection = mediaProjectionManager.getMediaProjection(resultCode, data)
    }

    fun createPeerConnection(
        onIceCandidate: (IceCandidate) -> Unit,
        onDataChannel: (DataChannel) -> Unit
    ): PeerConnection? {
        val iceServers = listOf(
            PeerConnection.IceServer.builder("stun:stun.l.google.com:19302").createIceServer(),
            PeerConnection.IceServer.builder("stun:stun1.l.google.com:19302").createIceServer()
        )

        val rtcConfig = PeerConnection.RTCConfiguration(iceServers).apply {
            sdpSemantics = PeerConnection.SdpSemantics.UNIFIED_PLAN
        }

        peerConnection = peerConnectionFactory?.createPeerConnection(
            rtcConfig,
            object : PeerConnection.Observer {
                override fun onIceCandidate(candidate: IceCandidate) {
                    onIceCandidate(candidate)
                }

                override fun onDataChannel(dataChannel: DataChannel) {
                    onDataChannel(dataChannel)
                }

                override fun onSignalingChange(state: PeerConnection.SignalingState?) {}
                override fun onIceConnectionChange(state: PeerConnection.IceConnectionState?) {}
                override fun onIceConnectionReceivingChange(receiving: Boolean) {}
                override fun onIceGatheringChange(state: PeerConnection.IceGatheringState?) {}
                override fun onAddStream(stream: MediaStream?) {}
                override fun onRemoveStream(stream: MediaStream?) {}
                override fun onRenegotiationNeeded() {}
                override fun onAddTrack(receiver: RtpReceiver?, streams: Array<out MediaStream>?) {}
            }
        )

        addVideoTrack()
        return peerConnection
    }

    private fun addVideoTrack() {
        videoCapturer = createScreenCapturer()
        videoSource = peerConnectionFactory?.createVideoSource(videoCapturer?.isScreencast ?: false)
        
        videoCapturer?.initialize(
            SurfaceTextureHelper.create("CaptureThread", EglBase.create().eglBaseContext),
            context,
            videoSource?.capturerObserver
        )
        
        videoCapturer?.startCapture(1280, 720, 30)

        val videoTrack = peerConnectionFactory?.createVideoTrack("video", videoSource)
        peerConnection?.addTrack(videoTrack, listOf("stream"))
    }

    private fun createScreenCapturer(): VideoCapturer {
        return ScreenCapturerAndroid(data, object : MediaProjection.Callback() {
            override fun onStop() {
                super.onStop()
                cleanup()
            }
        })
    }

    fun cleanup() {
        videoCapturer?.stopCapture()
        videoCapturer?.dispose()
        videoSource?.dispose()
        peerConnection?.close()
        peerConnection?.dispose()
        peerConnectionFactory?.dispose()
        mediaProjection?.stop()
    }
}
