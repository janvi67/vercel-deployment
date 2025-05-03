import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  remoteSocketId: null,
  myStream: null,
  remoteStream: null,
  call: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, { query: { userId: authUser._id } });
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => set({ onlineUsers: userIds }));
    socket.on("user:joined", ({ id }) => set({ remoteSocketId: id }));
    console.log("👥 User joined");

    // Handle incoming calls
    socket.on("incomingCall", ({ from, signal }) => {
      console.log("📞 Incoming call from:", from);
      set({ remoteSocketId: from, signal });
    });

    socket.on("callAccepted", ({ signal, to }) => {
      console.log("📞 Accepting call to:", to);
      set({ remoteSocketId: to, signal });
    });
  },

  startCall: async () => {
    const configuration = {
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
      ],
      iceCandidatePoolSize: 10,
    };

    try {
      pc.current = new RTCPeerConnection(configuration);
      pc.current.onicecandidate = (e) => {
        const message = {
          type: "candidate",
          candidate: null,
          id: userInfo,
        };
        if (e.candidate) {
          message.candidate = e.candidate.candidate;
          message.sdpMid = e.candidate.sdpMid;
          message.sdpMLineIndex = e.candidate.sdpMLineIndex;
        }
        socket.emit("calling", message);
      };
      pc.current.ontrack = (e) =>
        (remoteVideo.current.srcObject = e.streams[0]);
      localStream.current
        .getTracks()
        .forEach((track) => pc.current.addTrack(track, localStream.current));
      const offer = await pc.current.createOffer();
      socket.emit("calling", { id: userInfo, type: "offer", sdp: offer.sdp });
      await pc.current.setLocalDescription(offer);
    } catch (e) {
      console.log(e);
    }
    try {
      pc.current = new RTCPeerConnection(configuration);
      pc.current.onicecandidate = (e) => {
        const message = {
          type: "candidate",
          id: userInfo,
          candidate: e.candidate ? e.candidate.candidate : null,
          sdpMid: e.candidate ? e.candidate.sdpMid : undefined,
          sdpMLineIndex: e.candidate ? e.candidate.sdpMLineIndex : undefined,
        };
        socket.emit("calling", message);
      };
      pc.current.ontrack = (e) =>
        (remoteVideo.current.srcObject = e.streams[0]);
      localStream.current
        .getTracks()
        .forEach((track) => pc.current.addTrack(track, localStream.current));
      await pc.current.setRemoteDescription(offer);
      const answer = await pc.current.createAnswer();
      socket.emit("calling", { id: userInfo, type: "answer", sdp: answer.sdp });
      await pc.current.setLocalDescription(answer);
    } catch (e) {
      console.log(e);
    }
  },

  disconnectSocket: () => {
    console.log("Disconnecting socket...");
    if (get().socket) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },
}));
