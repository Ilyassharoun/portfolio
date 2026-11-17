import mongoose, { Document, Schema } from 'mongoose';

export interface IVisitor extends Document {
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  path: string;
  location: string;
  formattedIP: string;
}

// Helper function to format IP address (handle ::1 -> 127.0.0.1)
const formatIP = (ip: string): string => {
  // If IP is ::1 (IPv6 localhost), return 127.0.0.1
  if (ip === '::1') return '127.0.0.1';
  // If IP looks like IPv6 and has compressed zeros, we could expand it
  // But for now, just return as-is if it's a valid IP
  return ip;
};

const VisitorSchema: Schema = new Schema({
  ipAddress: { type: String, required: true },
  userAgent: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  path: { type: String, required: true },
  location: { type: String, default: 'Unknown' }
});

// Virtual to get formatted IP address
VisitorSchema.virtual('formattedIP').get(function(this: any) {
  return formatIP(this.ipAddress);
});

VisitorSchema.index({ ipAddress: 1, timestamp: -1 });

const Visitor = mongoose.model<IVisitor>('Visitor', VisitorSchema);

export default Visitor;