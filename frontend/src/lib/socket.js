// frontend/lib/socket.js
import { io } from "socket.io-client";

let socket = null;

/**
 * تهيئة الاتصال بالخادم
 * @param {string} serverUrl - رابط الخادم (اختياري)
 * @returns {Socket} instance
 */
export const initSocket = (serverUrl = null) => {
  if (!socket) {
    const url =
      serverUrl ||
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      "http://localhost:4000";

    socket = io(url, {
      transports: ["websocket", "polling"], // دعم متصفحات أكثر
      autoConnect: false, // عدم الاتصال تلقائياً
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    // إضافة event listeners للتصحيح
    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from server:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("⚠️ Connection error:", error.message);
    });

    socket.on("reconnect", (attempt) => {
      console.log(`🔁 Reconnected after ${attempt} attempts`);
    });

    socket.on("reconnect_error", (error) => {
      console.error("⚠️ Reconnection error:", error.message);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ Reconnection failed");
    });
  }

  return socket;
};

/**
 * الحصول على instance الـ Socket
 * @returns {Socket} instance
 * @throws {Error} إذا لم يتم تهيئة الـ Socket
 */
export const getSocket = () => {
  if (!socket) {
    throw new Error("⚠️ Socket not initialized. Call initSocket() first.");
  }
  return socket;
};

/**
 * الاتصال بالخادم
 * @returns {Promise} promise يحل عند الاتصال
 */
export const connectSocket = () => {
  const socketInstance = getSocket();

  if (socketInstance.connected) {
    return Promise.resolve(socketInstance);
  }

  return new Promise((resolve, reject) => {
    socketInstance.connect();

    const onConnect = () => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("connect_error", onError);
      resolve(socketInstance);
    };

    const onError = (error) => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("connect_error", onError);
      reject(error);
    };

    socketInstance.once("connect", onConnect);
    socketInstance.once("connect_error", onError);

    // timeout بعد 10 ثواني
    setTimeout(() => {
      socketInstance.off("connect", onConnect);
      socketInstance.off("connect_error", onError);
      reject(new Error("Connection timeout"));
    }, 10000);
  });
};

/**
 * قطع الاتصال بالخادم
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * إعادة الاتصال بالخادم
 * @returns {Promise} promise يحل عند إعادة الاتصال
 */
export const reconnectSocket = () => {
  disconnectSocket();
  return connectSocket();
};

/**
 * الانضمام إلى غرفة
 * @param {string} roomId - معرف الغرفة
 * @param {Object} participant - بيانات المشارك
 * @param {Object} playerData - بيانات اللاعب
 * @returns {Promise} promise يحل عند الانضمام
 */
export const joinRoom = (roomId, participant = null, playerData = null) => {
  const socketInstance = getSocket();

  return new Promise((resolve, reject) => {
    socketInstance.emit(
      "joinRoom",
      { roomId, participant, playerData },
      (response) => {
        if (response && response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      }
    );

    // timeout بعد 5 ثواني
    setTimeout(() => {
      reject(new Error("Join room timeout"));
    }, 5000);
  });
};

/**
 * مغادرة الغرفة
 * @param {string} roomId - معرف الغرفة
 */
export const leaveRoom = (roomId) => {
  const socketInstance = getSocket();
  socketInstance.emit("leaveRoom", { roomId });
};

/**
 * إرسال حركة لاعب
 * @param {string} id - معرف اللاعب
 * @param {Array} position - الموقع [x, y, z]
 * @param {string} roomId - معرف الغرفة
 */
export const sendMovement = (id, position, roomId = "main") => {
  const socketInstance = getSocket();
  socketInstance.emit("move", { id, pos: position, roomId });
};

/**
 * إرسال رسالة محادثة
 * @param {string} roomId - معرف الغرفة
 * @param {string} message - نص الرسالة
 */
export const sendChatMessage = (roomId, message) => {
  const socketInstance = getSocket();
  socketInstance.emit("chatMessage", { roomId, message });
};

/**
 * تغيير حالة الغرفة
 * @param {string} roomId - معرف الغرفة
 * @param {Object} newState - الحالة الجديدة
 */
export const changeRoomState = (roomId, newState) => {
  const socketInstance = getSocket();
  socketInstance.emit("changeState", { roomId, newState });
};

/**
 * الاشتراك في event
 * @param {string} eventName - اسم الـ event
 * @param {Function} callback - الدالة المستدعىة
 */
export const subscribe = (eventName, callback) => {
  const socketInstance = getSocket();
  socketInstance.on(eventName, callback);
};

/**
 * إلغاء الاشتراك من event
 * @param {string} eventName - اسم الـ event
 * @param {Function} callback - الدالة المستدعىة
 */
export const unsubscribe = (eventName, callback) => {
  const socketInstance = getSocket();
  socketInstance.off(eventName, callback);
};

/**
 * الاشتراك لمرة واحدة في event
 * @param {string} eventName - اسم الـ event
 * @param {Function} callback - الدالة المستدعىة
 */
export const subscribeOnce = (eventName, callback) => {
  const socketInstance = getSocket();
  socketInstance.once(eventName, callback);
};

/**
 * الحالة الحالية للاتصال
 * @returns {boolean} حالة الاتصال
 */
export const isConnected = () => {
  return socket ? socket.connected : false;
};

/**
 * معرف الـ Socket الحالي
 * @returns {string} socket ID
 */
export const getSocketId = () => {
  return socket ? socket.id : null;
};

export default {
  initSocket,
  getSocket,
  connectSocket,
  disconnectSocket,
  reconnectSocket,
  joinRoom,
  leaveRoom,
  sendMovement,
  sendChatMessage,
  changeRoomState,
  subscribe,
  unsubscribe,
  subscribeOnce,
  isConnected,
  getSocketId,
};
