// ====================== SOCKET.IO EVENT TYPES ======================

/**
 * Real-time location update for active trips
 * Emitted when a driver's location changes
 */
export interface DispatchLocationUpdate {
  ride_id: string;
  driver_id: string;
  latitude: number;
  longitude: number;
  heading?: number; // Direction in degrees (0 = North, 90 = East, etc.)
  speed?: number; // Speed in mph
  timestamp: string;
}

/**
 * Event when tracking session starts
 */
export interface TrackingStartedEvent {
  ride_id: string;
  driver_id: string;
  rider_id: string;
  session_id: string;
  timestamp: string;
}

/**
 * Event when tracking session ends
 */
export interface TrackingEndedEvent {
  ride_id: string;
  session_id: string;
  reason?: string; // 'completed', 'cancelled', etc.
  timestamp: string;
}

/**
 * Response when joining dispatch center room
 */
export interface JoinDispatchCenterResponse {
  status: 'joined' | 'error';
  room: string;
  message?: string;
}

/**
 * Response when leaving dispatch center room
 */
export interface LeaveDispatchCenterResponse {
  status: 'left' | 'error';
  room: string;
  message?: string;
}

/**
 * Socket.IO event names
 */
export enum SocketEvent {
  // Client -> Server
  JOIN_DISPATCH_CENTER = 'join_dispatch_center',
  LEAVE_DISPATCH_CENTER = 'leave_dispatch_center',

  // Server -> Client
  DISPATCH_LOCATION_UPDATE = 'dispatch_location_update',
  TRACKING_STARTED = 'tracking_started',
  TRACKING_ENDED = 'tracking_ended',

  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_ERROR = 'connect_error',
  RECONNECT = 'reconnect',
  RECONNECT_ATTEMPT = 'reconnect_attempt',
  RECONNECT_ERROR = 'reconnect_error',
  RECONNECT_FAILED = 'reconnect_failed',
}
