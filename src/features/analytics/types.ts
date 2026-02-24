export type VisitorSessionCache = {
  visitor: string;
  session_id: string;
  last_heartbeat: Date;
  blur: {
    started: Date;
    ended: Date;
  };
};
