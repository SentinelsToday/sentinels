export type NotificationType = 'anomaly_detected' | 'trust_drop' | 'firmware_update' | 'robot_offline' | 'key_rotated';

export function formatNotification(type: NotificationType, data: Record<string, any>): { subject: string; body: string } {
  const templates: Record<NotificationType, (d: Record<string, any>) => { subject: string; body: string }> = {
    anomaly_detected: (d) => ({ subject: `Anomaly Detected on Robot ${d.robotId ?? 'unknown'}`, body: `An anomaly was detected: ${d.message ?? 'No details provided.'}` }),
    trust_drop: (d) => ({ subject: `Trust Score Drop for Robot ${d.robotId ?? 'unknown'}`, body: `Trust score dropped to ${d.score ?? 'N/A'}.` }),
    firmware_update: (d) => ({ subject: `Firmware Update Available for Robot ${d.robotId ?? 'unknown'}`, body: `New firmware version ${d.version ?? 'unknown'} is available.` }),
    robot_offline: (d) => ({ subject: `Robot ${d.robotId ?? 'unknown'} Went Offline`, body: `Robot ${d.robotId ?? 'unknown'} is no longer responding.` }),
    key_rotated: (d) => ({ subject: `API Key Rotated for Robot ${d.robotId ?? 'unknown'}`, body: `The API key was rotated successfully.` }),
  };
  return templates[type](data);
}

export function sendNotification(type: NotificationType, data: Record<string, any>) {
  const { subject, body } = formatNotification(type, data);
  console.log(`[Notification] ${subject}: ${body}`);
}
