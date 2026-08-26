import { Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { DisasterAlert, WSAlertMessage, WSAlertEventType } from '@sikkim-yatra/shared';
import { getStoredAlerts } from '../data/disaster-data.js';

let wss: WebSocketServer | null = null;
const connectedClients = new Set<WebSocket>();

export function initDisasterWebSocketServer(server: HttpServer): WebSocketServer {
  wss = new WebSocketServer({
    server,
    path: '/ws/alerts',
  });

  wss.on('connection', (ws: WebSocket, req) => {
    connectedClients.add(ws);
    const clientIp = req.socket.remoteAddress || 'unknown';
    console.log(`📡 [WebSocket] Client connected from ${clientIp}. Total clients: ${connectedClients.size}`);

    // Send initial snapshot of active alerts immediately upon connection
    const activeAlerts = getStoredAlerts({ activeOnly: true });
    const initialMsg: WSAlertMessage = {
      type: 'INITIAL_STATE',
      payload: {
        alerts: activeAlerts,
        timestamp: new Date().toISOString(),
        message: 'Connected to Sikkim Yatra Disaster Alert Real-time Stream',
      },
    };

    try {
      ws.send(JSON.stringify(initialMsg));
    } catch (err) {
      console.error('[WebSocket] Error sending initial state to client:', err);
    }

    // Handle messages / heartbeat from client
    ws.on('message', (data: string) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.type === 'PING') {
          ws.send(JSON.stringify({ type: 'HEARTBEAT', payload: { timestamp: new Date().toISOString() } }));
        }
      } catch {
        // Ignore unparseable raw pings
      }
    });

    ws.on('close', () => {
      connectedClients.delete(ws);
      console.log(`🔌 [WebSocket] Client disconnected. Total clients: ${connectedClients.size}`);
    });

    ws.on('error', (err) => {
      console.error('[WebSocket] Client error:', err);
      connectedClients.delete(ws);
    });
  });

  console.log('⚡ [WebSocket] Disaster Alert WebSocket Server initialized on path /ws/alerts');
  return wss;
}

export function broadcastWSMessage(type: WSAlertEventType, payload: WSAlertMessage['payload']): void {
  const message: WSAlertMessage = {
    type,
    payload: {
      ...payload,
      timestamp: payload.timestamp || new Date().toISOString(),
    },
  };

  const serialized = JSON.stringify(message);
  let deliveredCount = 0;

  for (const client of connectedClients) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(serialized);
        deliveredCount++;
      } catch (err) {
        console.error('[WebSocket] Failed to send message to client:', err);
      }
    }
  }

  console.log(`📢 [WebSocket Broadcast] Dispatched "${type}" event to ${deliveredCount}/${connectedClients.size} active clients`);
}

export function broadcastAlertCreated(alert: DisasterAlert): void {
  broadcastWSMessage('ALERT_CREATED', {
    alert,
    timestamp: new Date().toISOString(),
    message: `🚨 Emergency Advisory Broadcast: ${alert.title}`,
  });
}

export function broadcastAlertUpdated(alert: DisasterAlert): void {
  const eventType: WSAlertEventType = alert.status === 'resolved' ? 'ALERT_RESOLVED' : 'ALERT_UPDATED';
  broadcastWSMessage(eventType, {
    alert,
    timestamp: new Date().toISOString(),
    message: alert.status === 'resolved'
      ? `✅ Hazard Resolved: ${alert.title}`
      : `⚠️ Hazard Advisory Updated: ${alert.title}`,
  });
}

export function broadcastAlertDeleted(alertId: string): void {
  broadcastWSMessage('ALERT_DELETED', {
    alertId,
    timestamp: new Date().toISOString(),
    message: `Hazard alert #${alertId} removed from broadcast`,
  });
}
